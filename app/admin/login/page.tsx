import { redirect } from "next/navigation";
import { checkPassword, isAuthed, startSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

async function loginAction(formData: FormData) {
  "use server";
  const password = String(formData.get("password") ?? "");
  if (!checkPassword(password)) {
    redirect("/admin/login?e=1");
  }
  await startSession();
  redirect("/admin");
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ e?: string }>;
}) {
  if (await isAuthed()) redirect("/admin");
  const { e } = await searchParams;
  return (
    <div className="min-h-[80vh] flex items-center justify-center -mt-10">
      <form
        action={loginAction}
        className="w-full max-w-sm bg-smoke border border-cream/10 p-8 rounded-lg space-y-6"
      >
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-mares mb-2">
            / Admin
          </p>
          <h1 className="font-display text-3xl tracking-tight">Sign in</h1>
          <p className="text-cream/60 text-sm mt-2">
            Enter the admin password to manage the store.
          </p>
        </div>
        <div>
          <label className="font-mono text-[10px] uppercase tracking-widest text-cream/60 mb-2 block">
            Password
          </label>
          <input
            type="password"
            name="password"
            autoFocus
            required
            className="w-full bg-ink border border-cream/20 px-4 py-3 rounded-md outline-none focus:border-mares font-mono text-sm"
          />
        </div>
        {e ? (
          <p className="text-blood text-sm font-mono">Wrong password.</p>
        ) : null}
        <button
          type="submit"
          className="w-full bg-mares text-ink font-display tracking-tight text-lg py-3 rounded-md hover:opacity-90 transition-opacity"
        >
          Enter →
        </button>
        <p className="text-[10px] font-mono uppercase tracking-widest text-cream/40">
          Default password: <span className="text-cream">mares-admin</span>
          <br />
          Set <span className="text-cream">ADMIN_PASSWORD</span> env to override.
        </p>
      </form>
    </div>
  );
}
