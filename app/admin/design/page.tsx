import { requireAdmin } from "@/lib/admin-guard";
import { getDesignBundle } from "@/lib/design";
import { DesignEditor } from "@/components/admin/DesignEditor";

export const dynamic = "force-dynamic";

export default async function AdminDesignPage() {
  await requireAdmin();
  const bundle = await getDesignBundle();
  return (
    <DesignEditor
      initialTokens={bundle.tokens}
      initialRoles={bundle.roles}
    />
  );
}
