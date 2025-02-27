import React, { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, ChevronDown, ChevronUp } from 'lucide-react'
import { TextWithLinks } from './TextWithLinks'
import { useSearch } from '@/contexts/SearchContext'

interface Column<T> {
    key: keyof T;
    header: string;
    width?: string;
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
    const { searchTerm } = useSearch();

    // Reset expanded rows when data changes (e.g., when navigating to a different route)
    // or when search term changes
    useEffect(() => {
        setExpandedRows(new Set());
    }, [data, searchTerm]);

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

    const getColumnWidth = (column: Column<T>) => {
        if (column.width) return column.width;
        return 'w-auto';
    };

    const getColumnStyle = (column: Column<T>) => {
        if (column.width) {
            // For percentage widths, we need to use style
            if (column.width.includes('%')) {
                return { width: column.width, minWidth: column.width, maxWidth: column.width };
            }
            // For fixed widths (px, rem, etc.), we can use Tailwind classes
            return {};
        }
        return {};
    };

    const nameColumn = columns.find(col => col.key === 'name');

    return (
        <div className="w-full">
            {/* Desktop Table - Hidden on Mobile */}
            <div className="hidden md:block">
                <Table className="table-fixed">
                    <TableHeader>
                        <TableRow>
                            {columns.map((column) => (
                                <TableHead
                                    key={column.key as string}
                                    className={`${getColumnWidth(column)} overflow-hidden`}
                                    style={getColumnStyle(column)}
                                >
                                    {column.header}
                                </TableHead>
                            ))}
                            <TableHead className="w-[80px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data && data.length > 0 ? (
                            data.map((item) => (
                                <TableRow key={item._id}>
                                    {columns.map((column) => (
                                        <TableCell
                                            key={`${item._id}-${column.key as string}`}
                                            className={`${getColumnWidth(column)} overflow-hidden`}
                                            style={getColumnStyle(column)}
                                        >
                                            <div className={`${column.key === 'name' ? 'font-medium' : ''} whitespace-normal break-words overflow-hidden`}>
                                                {renderCellContent(item, column)}
                                            </div>
                                        </TableCell>
                                    ))}
                                    <TableCell className="w-[80px]">
                                        <div className="flex items-center justify-end gap-1">
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

            {/* Mobile Table - Hidden on Desktop */}
            <div className="md:hidden">
                <Table className="table-fixed">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[80%]">
                                {nameColumn ? nameColumn.header : 'Name'}
                            </TableHead>
                            <TableHead className="w-[20%] text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data && data.length > 0 ? (
                            data.map((item) => (
                                <React.Fragment key={item._id}>
                                    <TableRow>
                                        <TableCell className="w-[80%]">
                                            <div className="font-medium whitespace-normal break-words overflow-hidden">
                                                {nameColumn ? renderCellContent(item, nameColumn) : item._id}
                                            </div>
                                        </TableCell>
                                        <TableCell className="w-[20%] text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => toggleRowExpansion(item._id)}
                                                    className="h-8 w-8"
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
                                        <TableRow>
                                            <TableCell colSpan={2}>
                                                <div className="py-4 space-y-4">
                                                    {columns.filter(column => column.hideOnMobile).map((column) => (
                                                        <div key={column.key as string}>
                                                            <div className="font-medium text-sm text-muted-foreground mb-1">
                                                                {column.header}
                                                            </div>
                                                            <div className="text-sm">
                                                                {renderCellContent(item, column)}
                                                            </div>
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
                                <TableCell colSpan={2} className="text-center py-4">
                                    No data available
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}