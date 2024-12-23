
// app/dashboard/page.tsx
import { Building2, Users2, Wallet, LineChart } from "lucide-react";
import { constructMetadata } from "@/lib/utils";
import { DashboardHeader } from "@/components/dashboard/header";
import InfoCard from "@/components/dashboard/info-card";
import { getDashboardStats } from "@/lib/analytics";

export const metadata = constructMetadata({
  title: "لوحة التحكم - المنصة",
  description: "صفحة إدارة المنصة.",
});

export default async function AdminPage() {
  const stats = await getDashboardStats();

  return (
    <>
      <DashboardHeader heading="لوحة التحكم" text="" />
      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <InfoCard
            title="الحملات"
            value={stats.projectsCount}
            icon={Building2}
            description="إجمالي عدد الحملات"
          />
          <InfoCard
            title="المتبرعين"
            value={stats.donorsCount}
            icon={Users2}
            description="إجمالي عدد المتبرعين"
          />
          <InfoCard
            title="التبرعات"
            value={`${stats.totalDonations.toLocaleString()} $`}
            icon={Wallet}
            description="إجمالي مبالغ التبرعات"
          />
          <InfoCard
            title="التبرعات المكتملة"
            value={stats.completedDonationsCount}
            icon={LineChart}
            description="عدد التبرعات المكتملة"
          />
        </div>
      </div>
    </>
  );
}