import React, { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, ChevronDown, ChevronUp } from 'lucide-react'
import { TextWithLinks } from './TextWithLinks'

interface Column<T> {
    key: keyof T;
    header: string;
    width?: string; // Make width optional
    hideOnMobile?: boolean;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    onEdit: (item: T) => void;
    onDelete: (id: string) => void;
}

export function DataTable<T extends { _id: string }>({
                                                         data,
                                                         columns,
                                                         onEdit,
                                                         onDelete
                                                     }: DataTableProps<T>) {
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

    const toggleRowExpansion = (id: string) => {
        setExpandedRows(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const renderCellContent = (item: T, column: Column<T>) => {
        const content = item[column.key];
        if (column.key === 'recipe') {
            return <TextWithLinks text={content as string} />;
        }
        if (typeof content === 'string' && content.includes('\n')) {
            return <span className="whitespace-pre-wrap">{content}</span>;
        }
        return content as React.ReactNode;
    };

    // Calculate default widths based on content type
    const getColumnWidth = (column: Column<T>) => {
        if (column.width) return column.width;

        switch (column.key) {
            case 'name':
                return 'w-[25%]';
            case 'description':
            case 'recipe':
                return 'w-[30%]';
            case 'notes':
                return 'w-[15%]';
            default:
                return 'w-[200px]';
        }
    };

    return (
        <div className="w-full">
            <Table className="w-full table-fixed">
                <TableHeader>
                    <TableRow>
                        {columns.map((column) => (
                            <TableHead
                                key={column.key as string}
                                className={`${column.hideOnMobile ? 'hidden md:table-cell' : ''} ${getColumnWidth(column)}`}
                            >
                                {column.header}
                            </TableHead>
                        ))}
                        <TableHead className="w-[60px] md:w-[80px]">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data && data.length > 0 ? (
                        data.map((item) => (
                            <React.Fragment key={item._id}>
                                <TableRow className="group">
                                    {columns.map((column) => (
                                        <TableCell
                                            key={`${item._id}-${column.key as string}`}
                                            className={`${
                                                column.hideOnMobile ? 'hidden md:table-cell' : ''
                                            } ${getColumnWidth(column)}`}
                                        >
                                            <div className={`${
                                                column.key === 'name' ? 'font-medium' : ''
                                            } whitespace-normal break-words max-w-full`}>
                                                {renderCellContent(item, column)}
                                            </div>
                                        </TableCell>
                                    ))}
                                    <TableCell className="w-[60px] md:w-[80px]">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => toggleRowExpansion(item._id)}
                                                className="md:hidden h-8 w-8"
                                            >
                                                {expandedRows.has(item._id) ? (
                                                    <ChevronUp className="h-4 w-4" />
                                                ) : (
                                                    <ChevronDown className="h-4 w-4" />
                                                )}
                                            </Button>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                        <span className="sr-only">Open menu</span>
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
                                        </div>
                                    </TableCell>
                                </TableRow>
                                {expandedRows.has(item._id) && (
                                    <TableRow className="md:hidden">
                                        <TableCell colSpan={columns.length + 1}>
                                            <div className="py-2 space-y-2">
                                                {columns.filter(column => column.hideOnMobile).map((column) => (
                                                    <div key={column.key as string}>
                                                        <strong>{column.header}:</strong>{' '}
                                                        {renderCellContent(item, column)}
                                                    </div>
                                                ))}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </React.Fragment>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length + 1} className="text-center py-4">
                                No data available
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}