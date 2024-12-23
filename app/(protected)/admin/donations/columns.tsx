// app/(protected)/admin/donations/columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Donation } from "@prisma/client";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<Donation>[] = [
  {
    accessorKey: "donorName",
    header: "اسم المتبرع",
    cell: ({ row }) => {
      const donation = row.original;
      return (
        <div className="font-medium">
          {donation.donor.anonymous ? "فاعل خير" : donation.donor.name}
        </div>
      );
    },
  },
  {
    accessorKey: "projectTitle",
    header: "الحملة",
    cell: ({ row }) => row.original.project.title,
  },
  {
    accessorKey: "amount",
    header: "المبلغ",
    cell: ({ row }) => {
      return new Intl.NumberFormat('ar-SA', {
        style: 'currency',
        currency: 'SAR',
        maximumFractionDigits: 0
      }).format(row.original.amount);
    },
  },
  {
    accessorKey: "status",
    header: "الحالة",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant={status === "completed" ? "success" : "secondary"}>
          {status === "completed" ? "مكتمل" : "معلق"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "تاريخ التبرع",
    cell: ({ row }) => {
      return format(new Date(row.original.createdAt), "dd MMMM yyyy", {
        locale: ar,
      });
    },
  },
];