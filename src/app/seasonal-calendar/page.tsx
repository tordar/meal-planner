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
    { key: 'name', header: 'Name', width: 'auto', hideOnMobile: false },
    { key: 'description', header: 'Description', width: '60%', hideOnMobile: true },
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

    const [currentSeason, setCurrentSeason] = useState<'spring' | 'summer' | 'autumn' | 'winter'>('spring')

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
        <div className="min-h-full flex flex-col bg-gray-100">
            <div className="p-6 flex flex-col flex-grow">
                {error && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 mt-16 md:mt-0">
                   
                    <div className="flex space-x-4 text-sm text-gray-600">
                        <span>Total Ingredients: {ingredients.length}</span>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm flex flex-col flex-grow">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border-b">
                        <h1 className="text-2xl font-bold mb-4 md:mb-0">Seasonal Calendar</h1>

                        <div className="flex flex-col md:flex-row gap-2">
                            {hasWriteAccess && (
                                <>
                                    <CSVImport onImport={handleImport} fields={ingredientFields.map(field => field.name)}/>
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
                                </>
                            )}
                        </div>
                    </div>

                    <Tabs
                        defaultValue="spring"
                        className="w-full"
                        onValueChange={(value: string) => setCurrentSeason(value as 'spring' | 'summer' | 'autumn' | 'winter')}
                    >
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="spring">Spring</TabsTrigger>
                            <TabsTrigger value="summer">Summer</TabsTrigger>
                            <TabsTrigger value="autumn">Autumn</TabsTrigger>
                            <TabsTrigger value="winter">Winter</TabsTrigger>
                        </TabsList>
                        {['spring', 'summer', 'autumn', 'winter'].map((season) => (
                            <TabsContent key={season} value={season} className="flex-grow">
                                <DataTable
                                    data={seasonalIngredients}
                                    columns={ingredientColumns}
                                    onEdit={handleEdit}
                                    onDelete={(id) => handleDelete(id)}
                                />
                            </TabsContent>
                        ))}
                    </Tabs>
                </div>
            </div>
        </div>
    )
}