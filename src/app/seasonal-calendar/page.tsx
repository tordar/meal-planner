'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DataTable } from "@/components/DataTable"
import { DataForm } from "@/components/DataForm"
import { useDataManager } from "@/hooks/useDataManager"
import { CSVImport } from "@/components/CsvImport"
import { SignInButton } from '@/components/SignInButton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from 'lucide-react'
import { useSearch } from '@/contexts/SearchContext'

interface SeasonalIngredient {
    _id: string;
    name: string;
    seasons: ('spring' | 'summer' | 'autumn' | 'winter')[];
    description?: string;
    [key: string]: string | string[] | undefined;
}

const ingredientFields = [
    { name: 'name', label: 'Ingredient Name', type: 'text' as const, required: true },
    {
        name: 'seasons',
        label: 'Seasons',
        type: 'multiselect' as const,
        options: [
            { value: 'spring', label: 'Spring' },
            { value: 'summer', label: 'Summer' },
            { value: 'autumn', label: 'Autumn' },
            { value: 'winter', label: 'Winter' }
        ],
        required: true
    },
    { name: 'description', label: 'Description', type: 'textarea' as const },
]

const ingredientColumns: Array<{key: keyof SeasonalIngredient; header: string; width: string; hideOnMobile: boolean}> = [
    { key: 'name', header: 'Name', width: '30%', hideOnMobile: false },
    { key: 'description', header: 'Description', width: '70%', hideOnMobile: true },
]

export default function SeasonalCalendar() {
    const {
        data: ingredients,
        newItem: newIngredient,
        editingItem,
        isLoading,
        isDialogOpen,
        setIsDialogOpen,
        error,
        hasWriteAccess,
        authStatus,
        handleInputChange,
        handleSubmit,
        handleEdit,
        handleDelete,
        handleImport
    } = useDataManager<SeasonalIngredient>('/api/seasonal-ingredients')

    const { searchTerm } = useSearch()

    const [currentSeason, setCurrentSeason] = useState<'spring' | 'summer' | 'autumn' | 'winter'>('spring')

    if (authStatus === "unauthenticated") {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Welcome to Food Planner</h1>
                    <p className="mb-4">Please sign in to access the seasonal calendar.</p>
                    <SignInButton />
                </div>
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <p className="text-xl">Loading ingredients...</p>
                </div>
            </div>
        )
    }

    const seasonalIngredients = ingredients.filter(ingredient =>
        ingredient.seasons.includes(currentSeason) &&
        (searchTerm === '' ||
            Object.values(ingredient).some(value =>
                String(value).toLowerCase().includes(searchTerm.toLowerCase())
            ))
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
                                <h1 className="text-2xl font-bold">Seasonal Calendar</h1>
                                <div className="text-sm text-gray-600 mt-1">
                                    Total Ingredients: {seasonalIngredients.length}
                                </div>
                            </div>
                            {hasWriteAccess && (
                                <div className="flex flex-col sm:flex-row gap-2 sm:mt-0">
                                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                        <DialogTrigger asChild>
                                            <Button>Add New Ingredient</Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>{editingItem ? 'Edit Ingredient' : 'Add New Ingredient'}</DialogTitle>
                                            </DialogHeader>
                                            <DataForm
                                                fields={ingredientFields}
                                                values={editingItem || newIngredient}
                                                onChange={handleInputChange}
                                                onSubmit={handleSubmit}
                                                submitLabel={editingItem ? 'Update Ingredient' : 'Add Ingredient'}
                                            />
                                        </DialogContent>
                                    </Dialog>
                                    <CSVImport onImport={handleImport}
                                               fields={ingredientFields.map(field => field.name)}/>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex-grow overflow-auto">
                        <Tabs defaultValue="spring" className="flex flex-col flex-grow"
                              onValueChange={(value) => setCurrentSeason(value as 'spring' | 'summer' | 'autumn' | 'winter')}>
                            <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="spring">Spring</TabsTrigger>
                                <TabsTrigger value="summer">Summer</TabsTrigger>
                                <TabsTrigger value="autumn">Autumn</TabsTrigger>
                                <TabsTrigger value="winter">Winter</TabsTrigger>
                            </TabsList>
                            <TabsContent value={currentSeason}>
                                <DataTable
                                    data={seasonalIngredients}
                                    columns={ingredientColumns}
                                    onEdit={handleEdit}
                                    onDelete={(id) => handleDelete(id)}
                                />
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    )
}