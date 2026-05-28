import "server-only";

/**
 * Tiny Cloudflare D1 HTTP client wrapped in the shape Drizzle's sqlite-proxy
 * driver expects. Calls the Cloudflare REST API directly so we can read/write
 * D1 from a Vercel-hosted Next.js app (i.e., outside the Workers runtime).
 *
 * Docs: https://developers.cloudflare.com/api/operations/cloudflare-d1-query-database
 */

type Method = "all" | "run" | "get" | "values";

type D1Response = {
  success: boolean;
  errors?: Array<{ code: number; message: string }>;
  result?: Array<{
    success: boolean;
    results?: Array<Record<string, unknown>>;
    meta?: Record<string, unknown>;
  }>;
};

export type D1Config = {
  accountId: string;
  databaseId: string;
  apiToken: string;
};

function endpoint(c: D1Config) {
  return `https://api.cloudflare.com/client/v4/accounts/${c.accountId}/d1/database/${c.databaseId}/query`;
}

async function callD1(
  cfg: D1Config,
  sql: string,
  params: unknown[],
): Promise<Array<Array<unknown>>> {
  const res = await fetch(endpoint(cfg), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${cfg.apiToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sql, params }),
    // D1 doesn't need caching here; this runs in server actions / RSC.
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`D1 HTTP ${res.status}: ${text}`);
  }

  const json = (await res.json()) as D1Response;
  if (!json.success) {
    const msg = json.errors?.map((e) => e.message).join("; ") ?? "Unknown D1 error";
    throw new Error(`D1 error: ${msg}`);
  }

  // D1 returns rows as objects; drizzle/sqlite-proxy wants rows-as-arrays so
  // the column order matches the SELECT. We preserve it from Object.values
  // (which follows insertion order for plain objects, matching the SQL).
  const rows = json.result?.[0]?.results ?? [];
  return rows.map((r) => Object.values(r));
}

export function makeD1Driver(cfg: D1Config) {
  return async (sql: string, params: unknown[], _method: Method) => {
    const rows = await callD1(cfg, sql, params);
    return { rows };
  };
}

export function makeD1BatchDriver(cfg: D1Config) {
  return async (
    queries: { sql: string; params: unknown[]; method: Method }[],
  ) => {
    const results = [] as { rows: unknown[][] }[];
    for (const q of queries) {
      const rows = await callD1(cfg, q.sql, q.params);
      results.push({ rows });
    }
    return results;
  };
}
