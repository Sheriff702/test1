export const dynamic = "force-dynamic";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="max-w-6xl mx-auto px-6 pt-32 pb-20">{children}</div>;
}
