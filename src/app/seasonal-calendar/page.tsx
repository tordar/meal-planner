'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DataTable } from "@/components/DataTable"
import { DataForm } from "@/components/DataForm"
import { SearchBar } from "@/components/SearchBar"
import { useDataManager } from "@/hooks/useDataManager"
import { CSVImport } from "@/components/CsvImport"
import { SignInButton } from '@/components/SignInButton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from 'lucide-react'

interface SeasonalIngredient {
    _id: string;
    name: string;
    seasons: ('spring' | 'summer' | 'autumn' | 'winter')[];
    description?: string;
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
        searchTerm,
        setIsDialogOpen,
        error,
        hasWriteAccess,
        authStatus,
        handleInputChange,
        handleSubmit,
        handleEdit,
        handleDelete,
        handleSearch,
        handleImport
    } = useDataManager<SeasonalIngredient>('/api/seasonal-ingredients')

    const [currentSeason, setCurrentSeason] = useState<'spring' | 'summer' | 'autumn' | 'winter'>('spring')

    if (authStatus === "unauthenticated") {
        return (
            <div className="flex items-center justify-center flex-grow">
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
            <div className="flex items-center justify-center flex-grow">
                <div className="text-center">
                    <p className="text-xl">Loading ingredients...</p>
                </div>
            </div>
        )
    }

    const seasonalIngredients = ingredients.filter(ingredient => ingredient.seasons.includes(currentSeason))

    return (
        <div className="h-full flex flex-col bg-gray-100">
            <div className="p-6 flex flex-col h-full">
                {error && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 mt-12 md:mt-0">
                    <SearchBar
                        value={searchTerm}
                        onChange={handleSearch}
                        placeholder="Search ingredients..."
                    />
                    <div className="flex space-x-4 text-sm text-gray-600 mt-4">
                        <span>Total Ingredients: {ingredients.length}</span>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm flex flex-col flex-grow overflow-hidden">
                    <div className="flex justify-between items-center p-4 border-b">
                        <h1 className="text-2xl font-bold">Seasonal Calendar</h1>

                        <div className="flex gap-2">
                            {hasWriteAccess && (
                                <CSVImport onImport={handleImport} fields={ingredientFields.map(field => field.name)}/>
                            )}
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    {hasWriteAccess && (
                                        <Button>Add New Ingredient</Button>
                                    )}
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
                        </div>
                    </div>

                    <Tabs
                        defaultValue="spring"
                        className="flex-grow flex flex-col"
                        onValueChange={(value) => setCurrentSeason(value as 'spring' | 'summer' | 'autumn' | 'winter')}
                    >
                        <TabsList className="flex justify-start p-2 bg-gray-100">
                            <TabsTrigger value="spring" className="flex-1">Spring</TabsTrigger>
                            <TabsTrigger value="summer" className="flex-1">Summer</TabsTrigger>
                            <TabsTrigger value="autumn" className="flex-1">Autumn</TabsTrigger>
                            <TabsTrigger value="winter" className="flex-1">Winter</TabsTrigger>
                        </TabsList>
                        <TabsContent value={currentSeason} className="flex-grow overflow-auto p-4">
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
    )
}