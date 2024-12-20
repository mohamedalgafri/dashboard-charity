import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Project } from "@prisma/client";
import Image from "next/image";

interface ProjectTableProps {
    data: Project[]
}

export default function ProjectTable({ data }: ProjectTableProps) {
    return (
        <Card className="xl:col-span-2">

            <CardHeader className="flex flex-row items-center">
                <div className="grid gap-2">
                    <CardTitle>Projects</CardTitle>
                </div>
                <Button size="sm" className="ml-auto  shrink-0 gap-1 px-4 rtl:ml-0 rtl:mr-auto">
                    <Link href="/dashboard/projects/add-project" className="flex items-center gap-2">
                        <span>Add Project</span>
                        <ArrowUpRight className="hidden size-4 sm:block" />
                    </Link>
                </Button>
            </CardHeader>
            <CardContent>
                <Table className="rtl:text-start">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-start">#ID</TableHead>
                            <TableHead className="text-start">Image</TableHead>
                            <TableHead className="text-start">Titlt</TableHead>
                            <TableHead className="text-start">Desctrption</TableHead>
                            <TableHead className="text-start">Visable</TableHead>
                            <TableHead className="text-start">Created At</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>

                        {
                            data.map((item,index) => (
                                <TableRow key={item.id}>
                                    <TableCell className="">{index+1}</TableCell>
                                    <TableCell className="">
                                        <Image 
                                            src={item.image as string}
                                            alt={item.title}
                                            width={40}
                                            height={40}
                                        />
                                    </TableCell>
                                    <TableCell className="">{item.title}</TableCell>
                                    <TableCell className="">{item.description}</TableCell>                               
                                    <TableCell className="">
                                        {
                                            item.visble ? "visable" : "not vosable"
                                        }
                                    </TableCell>
                                    <TableCell className="">{new Date(item.createdAt).toDateString()}</TableCell>
                                </TableRow>
                            ))
                        }

                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
