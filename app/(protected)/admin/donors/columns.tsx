// app/(protected)/admin/donors/columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Donor } from "@prisma/client";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

export const columns: ColumnDef<Donor>[] = [
  {
    accessorKey: "name",
    header: "اسم المتبرع",
    cell: ({ row }) => {
      const donor = row.original;
      return (
        <div className="font-medium">
          {donor.anonymous ? "متبرع مجهول" : donor.name}
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: "البريد الإلكتروني",
    cell: ({ row }) => row.original.email || "-",
  },
  {
    accessorKey: "phone",
    header: "رقم الهاتف",
    cell: ({ row }) => row.original.phone || "-",
  },
  {
    accessorKey: "totalDonations",
    header: "عدد التبرعات",
    cell: ({ row }) => {
      return row.original._count.donations;
    },
  },
  {
    accessorKey: "createdAt",
    header: "تاريخ التسجيل",
    cell: ({ row }) => {
      return format(new Date(row.original.createdAt), "dd MMMM yyyy", {
        locale: ar,
      });
    },
  },
];