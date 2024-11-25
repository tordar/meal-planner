'use client'

import React from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DataTable } from "@/components/DataTable"
import { DataForm } from "@/components/DataForm"
import { useDataManager } from "@/hooks/useDataManager"
import { CSVImport } from "@/components/CsvImport"
import { SignInButton } from '@/components/SignInButton'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from 'lucide-react'
import { useSearch } from '@/contexts/SearchContext'

interface Idea {
    _id: string;
    name: string;
    description: string;
    notes: string;
    recipe: string;
    [key: string]: string | string[] | undefined;
}

const ideaFields = [
    { name: 'name', label: 'Idea Name', type: 'text' as const, required: true },
    { name: 'description', label: 'Description', type: 'text' as const },
    { name: 'notes', label: 'Notes', type: 'textarea' as const },
    { name: 'recipe', label: 'Recipe', type: 'textarea' as const }
]

const ideaColumns: Array<{key: keyof Idea; header: string; width: string; hideOnMobile: boolean}> = [
    { key: 'name', header: 'Name', width: 'auto', hideOnMobile: false },
    { key: 'description', header: 'Description', width: '25%', hideOnMobile: true },
    { key: 'notes', header: 'Notes', width: '25%', hideOnMobile: true },
    { key: 'recipe', header: 'Recipe', width: '25%', hideOnMobile: true }
]

export default function IdeaTracker() {
    const {
        data: ideas,
        newItem: newIdea,
        editingItem,
        isLoading,
        isDialogOpen,
        setIsDialogOpen,
        error,
        authStatus,
        hasWriteAccess,
        handleInputChange,
        handleSubmit,
        handleEdit,
        handleDelete,
        handleImport
    } = useDataManager<Idea>('/api/ideas')

    const { searchTerm } = useSearch()

    if (authStatus === "unauthenticated") {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Welcome to Food Planner</h1>
                    <p className="mb-4">Please sign in to access your ideas.</p>
                    <SignInButton />
                </div>
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <p className="text-xl">Loading ideas...</p>
                </div>
            </div>
        )
    }

    const filteredIdeas = ideas.filter(idea =>
        Object.values(idea).some(value =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
    )

    return (
        <div className="flex flex-col h-full bg-gray-100">
            <div className="p-4 flex flex-col flex-grow overflow-hidden">
                {error && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}


                <div className="bg-white rounded-lg shadow-sm flex flex-col flex-grow overflow-hidden">
                    <div className="p-4 border-b">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-2xl font-bold">Ideas</h1>
                                <div className="text-sm text-gray-600 mt-1">
                                    <span>Total Ideas: {filteredIdeas.length}</span>
                                </div>
                            </div>
                                    {hasWriteAccess && (
                                        <div className="flex flex-col sm:flex-row gap-2 sm:mt-0">
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
                                            <CSVImport onImport={handleImport}
                                                       fields={ideaFields.map(field => field.name)}/>
                                        </div>
                                    )}
                        </div>
                    </div>
                    <div className="flex-grow overflow-auto">
                                <DataTable
                                    data={filteredIdeas}
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