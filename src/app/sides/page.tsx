'use client'

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DataTable } from "@/components/DataTable"
import { DataForm } from "@/components/DataForm"
import { SearchBar } from "@/components/SearchBar"
import { useDataManager } from "@/hooks/useDataManager"
import {CSVImport} from "@/components/CsvImport";
import {SignInButton} from "@/components/SignInButton";
import React from "react";

interface Sides {
    _id: string;
    name: string;
    description: string;
    notes: string;
    recipe: string;
}

const sideFields = [
    { name: 'name', label: 'Side Name', type: 'text' as const, required: true },
    { name: 'description', label: 'Description', type: 'text' as const },
    { name: 'notes', label: 'Notes', type: 'textarea' as const },
    { name: 'recipe', label: 'Recipe', type: 'textarea' as const }
]

const sideColumns: Array<{key: keyof Sides; header: string; width: string; hideOnMobile: boolean}> = [
    { key: 'name', header: 'Name', width: 'auto', hideOnMobile: false },
    { key: 'description', header: 'Description', width: '25%', hideOnMobile: true},
    { key: 'notes', header: 'Notes', width: '25%', hideOnMobile: true },
    { key: 'recipe', header: 'Recipe', width: '25%', hideOnMobile: true }
]

export default function SideTracker() {

    const {
        data: sides,
        newItem: newSide,
        editingItem,
        isLoading,
        isDialogOpen,
        searchTerm,
        setIsDialogOpen,
        error,
        authStatus,
        hasWriteAccess,
        handleInputChange,
        handleSubmit,
        handleEdit,
        handleDelete,
        handleSearch,
        handleImport
    } = useDataManager<Sides>('/api/sides')

    if (authStatus === "unauthenticated") {
        return (
            <div className="flex items-center justify-center flex-grow">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Welcome to Food Planner</h1>
                    <p className="mb-4">Please sign in to access your meals.</p>
                    <SignInButton />
                </div>
            </div>
        )
    }
    if (isLoading) {
        return (
            <div className="flex items-center justify-center flex-grow">
                <div className="text-center">
                    <p className="text-xl">Loading meals...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center flex-grow">
                <div className="text-center">
                    <p className="text-xl text-red-500">Error: {error}</p>
                </div>
            </div>
        )
    }


    return (
        <div className="h-full flex flex-col bg-gray-100">
            <div className="p-6 flex flex-col h-full">
                <div
                    className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 mt-12 md:mt-0">
                    <SearchBar
                        value={searchTerm}
                        onChange={handleSearch}
                        placeholder="Search..."
                    />
                    <div className="flex space-x-4 text-sm text-gray-600 mt-4">
                        <span>Sides: {sides.length}</span>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm flex flex-col flex-grow overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b">
                        <h1 className="text-2xl font-bold">Sides</h1>

                            <div className="flex gap-2">
                                {hasWriteAccess && (
                                <CSVImport onImport={handleImport} fields={sideFields.map(field => field.name)}/>
                                )}
                                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                    <DialogTrigger asChild>
                                        {hasWriteAccess && (
                                            <Button>Add New Side</Button>
                                        )}
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>{editingItem ? 'Edit Side' : 'Add New Side'}</DialogTitle>
                                        </DialogHeader>
                                        <DataForm
                                            fields={sideFields}
                                            values={editingItem || newSide}
                                            onChange={handleInputChange}
                                            onSubmit={handleSubmit}
                                            submitLabel={editingItem ? 'Update Side' : 'Add Side'}
                                        />
                                    </DialogContent>
                                </Dialog>
                        </div>
                    </div>


                    <div className="flex-grow overflow-auto">
                        <DataTable
                            data={sides}
                            columns={sideColumns}
                            onEdit={handleEdit}
                            onDelete={(id) => handleDelete(id)}
                        />
                </div>
                </div>
            </div>
        </div>

    )
}