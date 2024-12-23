import { db } from "@/lib/db";

export async function getSiteSettings() {
  const settings = await db.settings.findFirst();
  return settings;
}