// app/(protected)/admin/donations/page.tsx
'use client';

import { useEffect } from "react";
import { columns } from "./columns";
import { DataTable } from "../pages/data-table";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchDonations } from "@/store/slices/donationsSlice";
import { resetUnreadDonations } from "@/store/slices/notificationsSlice";

export default function DonationsPage() {
  const dispatch = useAppDispatch();
  const { items, isLoading, error } = useAppSelector((state) => state.donations);

  useEffect(() => {
    dispatch(fetchDonations());
    dispatch(resetUnreadDonations());
  }, [dispatch]);

  if (isLoading) return <div>جاري التحميل...</div>;
  if (error) return <div>حدث خطأ: {error}</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">التبرعات</h1>
      </div>
      <DataTable columns={columns} data={items} />
    </div>
  );
}