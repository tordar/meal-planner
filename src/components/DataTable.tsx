'use client'

import React, { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, ChevronDown, ChevronUp } from 'lucide-react'
import { TextWithLinks } from './TextWithLinks'

interface Column<T> {
    key: keyof T;
    header: string;
    width: string;
    hideOnMobile: boolean;
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
    const [debugInfo, setDebugInfo] = useState<string>('');

    useEffect(() => {
        const updateDebugInfo = () => {
            setDebugInfo(`Window: ${window.innerWidth}x${window.innerHeight}, User Agent: ${navigator.userAgent}`);
        };
        updateDebugInfo();
        window.addEventListener('resize', updateDebugInfo);
        return () => window.removeEventListener('resize', updateDebugInfo);
    }, []);

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
        const content = item[column.key] as string;
        return column.key === 'recipe' ? <TextWithLinks text={content} /> : content;
    };

    return (
        <div className="relative">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            {columns.map((column) => (
                                <TableHead
                                    key={column.key as string}
                                    className={column.hideOnMobile ? 'hidden md:table-cell' : ''}
                                    style={{ width: column.width }}
                                >
                                    {column.header}
                                </TableHead>
                            ))}
                            <TableHead className="w-20 md:w-24">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.map((item) => (
                            <React.Fragment key={item._id}>
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableCell
                                            key={`${item._id}-${column.key as string}`}
                                            className={`${
                                                column.hideOnMobile ? 'hidden md:table-cell' : ''
                                            } ${column.key === 'name' ? 'pr-20' : ''}`}
                                        >
                                            <div className={column.key === 'name' ? 'font-medium' : ''}>
                                                {renderCellContent(item, column)}
                                            </div>
                                        </TableCell>
                                    ))}
                                    <TableCell className="w-20 md:w-24">
                                        <div className="flex items-center justify-end space-x-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => toggleRowExpansion(item._id)}
                                                className="md:hidden"
                                            >
                                                {expandedRows.has(item._id) ? (
                                                    <ChevronUp className="h-4 w-4" />
                                                ) : (
                                                    <ChevronDown className="h-4 w-4" />
                                                )}
                                            </Button>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
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
                                                        <strong>{column.header}:</strong> {renderCellContent(item, column)}
                                                    </div>
                                                ))}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <div className="fixed bottom-0 left-0 right-0 bg-white p-2 text-xs z-50">
                Debug: {debugInfo}
            </div>
        </div>
    )
}