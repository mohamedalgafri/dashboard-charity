// app/(protected)/admin/contacts/page.tsx
import { db } from "@/lib/db";
import { DataTable } from "../pages/data-table";
import { columns } from "./columns";



export default async function ContactsPage() {
  const contacts = await db.contact.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">رسائل التواصل</h1>
      </div>

      <DataTable columns={columns} data={contacts} />
    </div>
  );
}