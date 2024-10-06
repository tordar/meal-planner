import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"

interface Column<T> {
    key: keyof T;
    header: string;
    width: string;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    onEdit: (item: T) => void;
    onDelete: (id: string) => void;
}

export function DataTable<T extends { _id: string }>({ data, columns, onEdit, onDelete }: DataTableProps<T>) {
    return (
        <div className="overflow-auto max-h-[calc(100vh-16rem)]">
            <Table>
                <TableHeader>
                    <TableRow>
                        {columns.map((column) => (
                            <TableHead key={column.key as string} style={{ width: column.width }}>
                                {column.header}
                            </TableHead>
                        ))}
                        <TableHead style={{ width: '70px' }}></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((item) => (
                        <TableRow key={item._id}>
                            {columns.map((column) => (
                                <TableCell
                                    key={`${item._id}-${column.key as string}`}
                                    style={{ maxWidth: column.width }}
                                    className="whitespace-normal break-words"
                                >
                                    {item[column.key] as React.ReactNode}
                                </TableCell>
                            ))}
                            <TableCell style={{ width: '70px' }}>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <span className="sr-only">Open menu</span>
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => onEdit(item)}>
                                            Edit
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => onDelete(item._id)}>
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}