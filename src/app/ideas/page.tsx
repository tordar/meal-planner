'use client'

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DataTable } from "@/components/DataTable"
import { DataForm } from "@/components/DataForm"
import { SearchBar } from "@/components/SearchBar"
import { useDataManager } from "@/hooks/useDataManager"
import {CSVImport} from "@/components/CsvImport";

interface Idea {
    _id: string;
    name: string;
    description: string;
    notes: string;
    recipe: string;
}

const ideaFields = [
    { name: 'name', label: 'Idea Name', type: 'text' as const, required: true },
    { name: 'description', label: 'Description', type: 'text' as const },
    { name: 'notes', label: 'Notes', type: 'textarea' as const },
    { name: 'recipe', label: 'Recipe', type: 'textarea' as const }
]

const ideaColumns: Array<{key: keyof Idea; header: string; width: string}> = [
    { key: 'name', header: 'Name', width: '25%' },
    { key: 'description', header: 'Description', width: '25%' },
    { key: 'notes', header: 'Notes', width: '25%' },
    { key: 'recipe', header: 'Recipe', width: '25%' }
]

export default function IdeaTracker() {
    const {
        data: ideas,
        newItem: newIdea,
        editingItem,
        isLoading,
        isDialogOpen,
        searchTerm,
        setIsDialogOpen,
        error,
        authStatus,
        handleInputChange,
        handleSubmit,
        handleEdit,
        handleDelete,
        handleSearch,
        handleImport
    } = useDataManager<Idea>('/api/ideas')

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
                        <span>Ideas: {ideas.length}</span>
                    </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-sm flex flex-col flex-grow overflow-hidden">
                    <div className="flex justify-between items-center p-4 border-b">
                        <h1 className="text-2xl font-bold">Ideas Tracker</h1>
                        
                            <div className="flex gap-2">
                                <CSVImport onImport={handleImport} fields={ideaFields.map(field => field.name)}/>
                                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                    <DialogTrigger asChild>
                                        <Button>Add New Idea</Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>{editingItem ? 'Edit Idea' : 'Add New Idea'}</DialogTitle>
                                        </DialogHeader>
                                        <DataForm
                                            fields={ideaFields}
                                            values={editingItem || newIdea}
                                            onChange={handleInputChange}
                                            onSubmit={handleSubmit}
                                            submitLabel={editingItem ? 'Update Idea' : 'Add Idea'}
                                        />
                                    </DialogContent>
                                </Dialog>
                            </div>
                    </div>

                    <div className="flex-grow overflow-auto">
                        <DataTable
                            data={ideas}
                            columns={ideaColumns}
                            onEdit={handleEdit}
                            onDelete={(id) => handleDelete(id)}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}