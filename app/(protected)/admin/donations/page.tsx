'use client';

import { useEffect } from "react";
import { columns } from "./columns";
import { DataTable } from "../pages/data-table";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchDonations } from "@/store/slices/donationsSlice";
import { resetUnreadDonations } from "@/store/slices/notificationsSlice";
import { markAllDonationsAsRead } from "@/actions/donation"; 
import TableLoading from "./loading";

export default function DonationsPage() {
  const dispatch = useAppDispatch();
  const { items, isLoading, error } = useAppSelector((state) => state.donations);

  useEffect(() => {
    // نقوم بتحميل البيانات فوراً
    dispatch(fetchDonations());

    // ثم نقوم بتعليم التبرعات كمقروءة في الخلفية
    const markAsRead = async () => {
      await markAllDonationsAsRead();
      dispatch(resetUnreadDonations());
    };
    markAsRead();
  }, [dispatch]);

  if (error) return <div>حدث خطأ: {error}</div>;
  if (isLoading || items.length === 0) return <TableLoading />;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">التبرعات</h1>
      </div>
      <DataTable columns={columns} data={items} />
    </div>
  );
}