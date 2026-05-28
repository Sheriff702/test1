import "server-only";
import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/auth";

export async function requireAdmin() {
  if (!(await isAuthed())) redirect("/admin/login");
}
