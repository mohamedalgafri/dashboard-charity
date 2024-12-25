"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Contact } from "@prisma/client";


export const columns: ColumnDef<Contact>[] = [
  {
    accessorKey: "name",
    header: "الاسم",
    cell: ({ row }) => {
      return <div className="font-medium">{row.original.name}</div>;
    },
  },
  {
    accessorKey: "email",
    header: "البريد الإلكتروني",
  },
  {
    accessorKey: "phone",
    header: "رقم الهاتف",
  },
  {
    accessorKey: "subject",
    header: "الموضوع",
    cell: ({ row }) => {
      return (
        <div className="max-w-[200px] truncate font-medium">
          {row.original.subject}
        </div>
      );
    },
  },
  {
    accessorKey: "message",
    header: "الرسالة",
    cell: ({ row }) => {
      return (
        <div className="max-w-[300px] truncate text-muted-foreground">
          {row.original.message}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "تاريخ الإرسال",
    cell: ({ row }) => {
      return format(new Date(row.original.createdAt), "dd MMMM yyyy", {
        locale: ar,
      });
    },
  },
];