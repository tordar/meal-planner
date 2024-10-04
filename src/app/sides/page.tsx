'use client'

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DataTable } from "@/components/DataTable"
import { DataForm } from "@/components/DataForm"
import { SearchBar } from "@/components/SearchBar"
import { useDataManager } from "@/hooks/useDataManager"

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

const sideColumns = [
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
        handleInputChange,
        handleSubmit,
        handleEdit,
        handleDelete,
        handleSearch
    } = useDataManager<Sides>('/api/sides')

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Side Tracker</h1>

            <SearchBar value={searchTerm} onChange={handleSearch} />

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button className="mb-4">Add New Side</Button>
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

            {isLoading ? (
                <p>Loading sides...</p>
            ) : (
                <DataTable
                    data={sides}
                    columns={sideColumns}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}
        </div>
    )
}