// components/donations/donations-wrapper.tsx
"use client";

import { useEffect } from "react";
import { useSocket } from "@/hooks/useSocket";
import { DataTable } from "@/app/(protected)/admin/pages/data-table";
import { columns } from "@/app/(protected)/admin/donations/columns";


interface DonationsWrapperProps {
  donations: any[];
}

export function DonationsWrapper({ donations }: DonationsWrapperProps) {
  const socket = useSocket();

  useEffect(() => {
    if (socket) {
      // إعلام السيرفر بأن التبرعات تم قراءتها
      socket.emit('read-donations');
    }
  }, [socket]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">التبرعات</h1>
      </div>
      <DataTable columns={columns} data={donations} />
    </div>
  );
}