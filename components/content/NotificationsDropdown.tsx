"use client";

import { useEffect, useState } from 'react';
import { Bell, CalendarClock, DollarSign, User } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { resetUnreadDonations, resetUnreadMessages } from "@/store/slices/notificationsSlice";
import { getUnreadDonations, markAllDonationsAsRead } from "@/actions/donation";
import Link from "next/link";

interface Donation {
    id: string;
    amount: number;
    message?: string | null;
    status: string;
    createdAt: Date;
    project: {
        title: string;
        slug: string;
    };
    donor: {
        name: string;
        anonymous: boolean;
    };
}

export function NotificationsButton() {
    const dispatch = useAppDispatch();
    const [recentDonations, setRecentDonations] = useState<Donation[]>([]);
    const { unreadDonations, unreadMessages } = useAppSelector(
        (state) => state.notifications
    );
    const totalUnread = unreadDonations + unreadMessages;

    const loadDonations = async () => {
        const donations = await getUnreadDonations();
        setRecentDonations(donations);
    };

    useEffect(() => {
        loadDonations();
    }, []);

    const handleMarkAllAsRead = async () => {
        try {
            const result = await markAllDonationsAsRead();
            if (result.success) {
                dispatch(resetUnreadDonations());
                dispatch(resetUnreadMessages());
                setRecentDonations([]);
            }
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    return (
        <DropdownMenu dir='rtl'>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative"
                >
                    <Bell className="size-5" />
                    {totalUnread > 0 && (
                        <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-destructive text-xs text-white">
                            {totalUnread}
                        </span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className=" w-[300px] md:w-[400px]" >
                <div className="flex items-center justify-between p-3 border-b">
                    <h2 className="text-sm font-semibold">الإشعارات</h2>
                    {totalUnread > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs hover:bg-muted"
                            onClick={handleMarkAllAsRead}
                        >
                            تعليم الكل كمقروء
                        </Button>
                    )}
                </div>
                <ScrollArea className="h-[400px]" dir='rtl'>
                    {recentDonations.map((donation) => (
                        <Link
                            key={donation.id}
                            href={`/admin/donations`}
                            className="block border-b hover:bg-muted transition-colors"
                        >
                            <div className="p-4">
                                <div className="flex items-start gap-3">
                                    <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
                                        <DollarSign className="size-4 text-blue-600 dark:text-blue-300" />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <p className="font-medium">
                                            تبرع جديد بقيمة {donation.amount.toLocaleString()} $
                                        </p>
                                        <div className="text-sm text-muted-foreground space-y-1">
                                            <div className="flex items-center gap-1">
                                                <User className="size-3.5" />
                                                <span>
                                                    {donation.donor.anonymous ? 'متبرع مجهول' : donation.donor.name}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <CalendarClock className="size-3.5" />
                                                <span>{new Date(donation.createdAt).toLocaleString('ar', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                    hour12: true
                                                })}</span>
                                            </div>
                                        </div>
                                        <p className="text-sm font-medium mt-1">
                                            الحملة: {donation.project.title}
                                        </p>
                                        {donation.message && (
                                            <p className="text-sm text-muted-foreground border-t pt-1 mt-1">
                                                {donation.message}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                    {unreadMessages > 0 && (
                        <Link href="/admin/contacts" className="block border-b hover:bg-muted">
                            <div className="flex items-center gap-3 p-4">
                                <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
                                    <Bell className="size-4 text-green-600 dark:text-green-300" />
                                </div>
                                <div>
                                    <p className="font-medium">رسائل جديدة</p>
                                    <p className="text-sm text-muted-foreground">
                                        لديك {unreadMessages} رسالة جديدة
                                    </p>
                                </div>
                            </div>
                        </Link>
                    )}
                    {totalUnread === 0 && recentDonations.length === 0 && (
                        <div className="flex flex-col items-center justify-center p-8 text-center text-sm text-muted-foreground">
                            <Bell className="size-8 mb-2 opacity-50" />
                            <p>لا توجد إشعارات جديدة</p>
                        </div>
                    )}
                </ScrollArea>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}