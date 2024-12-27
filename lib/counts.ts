// lib/counts.ts
import { db } from "@/lib/db";

export async function getUnreadCounts() {
  const unreadDonations = await db.donation.count({
    where: { isRead: false }
  });
  
  const unreadMessages = await db.contact.count({
    where: { isRead: false }
  });
  
  return { unreadDonations, unreadMessages };
}