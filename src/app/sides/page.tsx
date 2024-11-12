'use client'

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DataTable } from "@/components/DataTable"
import { DataForm } from "@/components/DataForm"
import { SearchBar } from "@/components/SearchBar"
import { useDataManager } from "@/hooks/useDataManager"
import {CSVImport} from "@/components/CsvImport";

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

const sideColumns: Array<{key: keyof Sides; header: string; width: string}> = [
    { key: 'name', header: 'Name', width: '25%' },
    { key: 'description', header: 'Description', width: '25%' },
    { key: 'notes', header: 'Notes', width: '25%' },
    { key: 'recipe', header: 'Recipe', width: '25%' }
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


    if (authStatus === "loading") {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <p className="text-xl">Loading...</p>
                </div>
            </div>
        )
    }

    if (authStatus === "unauthenticated") {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Welcome to Food Planner</h1>
                    <p>Please sign in to access your meals.</p>
                </div>
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <p className="text-xl">Loading meals...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <p className="text-xl text-red-500">Error: {error}</p>
                </div>
            </div>
        )
    }


    return (
        <div className="h-full flex flex-col bg-gray-100">
            <div className="p-6 flex flex-col h-full">
                <div className="flex justify-between items-center mb-6">
                    <SearchBar
                        value={searchTerm}
                        onChange={handleSearch}
                        placeholder="Search..."
                    />
                    <div className="flex space-x-4 text-sm text-gray-600">
                        <span>Sides: {sides.length}</span>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm flex flex-col flex-grow overflow-hidden">
                    <div className="flex justify-between items-center p-4 border-b">
                        <h1 className="text-2xl font-bold">Side Tracker</h1>

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