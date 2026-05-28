import "server-only";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const ACCOUNT = process.env.R2_ACCOUNT_ID;
const ACCESS_KEY = process.env.R2_ACCESS_KEY_ID;
const SECRET_KEY = process.env.R2_SECRET_ACCESS_KEY;
const BUCKET = process.env.R2_BUCKET;
const PUBLIC_URL = process.env.R2_PUBLIC_URL?.replace(/\/$/, "");

export const r2Configured = Boolean(
  ACCOUNT && ACCESS_KEY && SECRET_KEY && BUCKET && PUBLIC_URL,
);

let cachedClient: S3Client | null = null;

function client(): S3Client {
  if (cachedClient) return cachedClient;
  cachedClient = new S3Client({
    region: "auto",
    endpoint: `https://${ACCOUNT}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: ACCESS_KEY!,
      secretAccessKey: SECRET_KEY!,
    },
  });
  return cachedClient;
}

export async function r2Upload(opts: {
  key: string;
  body: Buffer;
  contentType: string;
}): Promise<string> {
  if (!r2Configured) throw new Error("R2 not configured");
  await client().send(
    new PutObjectCommand({
      Bucket: BUCKET!,
      Key: opts.key,
      Body: opts.body,
      ContentType: opts.contentType,
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );
  return `${PUBLIC_URL}/${opts.key}`;
}
