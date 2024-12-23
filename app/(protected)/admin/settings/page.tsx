import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";
import { db } from "@/lib/db";
import { UserNameForm } from "@/components/forms/user-name-form";
import { SiteSettingsForm } from "@/components/forms/SiteSettingsForm";
import { SocialLinksForm } from "@/components/forms/SocialLinksForm";

export const metadata = constructMetadata({
  title: "الاعدادات",
  description: "اعدادات الموقع",
});

export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user?.id) redirect("/login");

  const settings = await db.settings.findFirst();

  return (
    <>
      <DashboardHeader
        heading="الاعدادات"
        text="إدارة إعدادات الموقع"
      />
      <div className="divide-y divide-muted pb-10">
        <UserNameForm user={{ id: user.id, name: user.name || "" }} />
        <SiteSettingsForm settings={settings} />
        <SocialLinksForm settings={settings} />
      </div>
    </>
  );
}