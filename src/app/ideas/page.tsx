'use client'

import React from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DataTable } from "@/components/DataTable"
import { DataForm } from "@/components/DataForm"
import { SearchBar } from "@/components/SearchBar"
import { useDataManager } from "@/hooks/useDataManager"
import { CSVImport } from "@/components/CsvImport"
import { SignInButton } from '@/components/SignInButton'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from 'lucide-react'

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
    } = useDataManager<Idea>('/api/ideas')

    if (authStatus === "unauthenticated") {
        return (
            <div className="flex items-center justify-center flex-grow">
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
            <div className="flex items-center justify-center flex-grow">
                <div className="text-center">
                    <p className="text-xl">Loading ideas...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full w-full bg-gray-100">
            <div className="p-6 flex flex-col flex-grow">
                {error && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <SearchBar
                        value={searchTerm}
                        onChange={handleSearch}
                        placeholder="Search ideas..."
                        className="w-full md:w-auto mb-4 md:mb-0"
                    />
                    <div className="flex space-x-4 text-sm text-gray-600">
                        <span>Total Ideas: {ideas.length}</span>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm flex flex-col flex-grow">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border-b">
                        <h1 className="text-2xl font-bold mb-4 md:mb-0">Ideas</h1>

                        <div className="flex flex-col md:flex-row gap-2">
                            {hasWriteAccess && (
                                <>
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
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex-grow overflow-auto p-4">
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