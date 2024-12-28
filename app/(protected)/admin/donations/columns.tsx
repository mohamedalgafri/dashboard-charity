// app/(protected)/admin/donations/columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { DonationWithRelations } from "@/types";

export const columns: ColumnDef<DonationWithRelations>[] = [
  {
    accessorKey: "donor.name",
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
    accessorKey: "project.title",
    header: "الحملة",
    cell: ({ row }) => row.original.project.title,
  },
  {
    accessorKey: "amount",
    header: "المبلغ",
    cell: ({ row }) => {
      return `$${row.original.amount}`;
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