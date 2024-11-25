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

interface Meal {
  _id: string;
  name: string;
  description: string;
  notes: string;
  recipe: string;
  [key: string]: string | string[] | undefined;
}

const mealFields = [
  { name: 'name', label: 'Meal Name', type: 'text' as const, required: true },
  { name: 'description', label: 'Description', type: 'text' as const },
  { name: 'notes', label: 'Notes', type: 'textarea' as const },
  { name: 'recipe', label: 'Recipe', type: 'textarea' as const }
]

const mealColumns: Array<{key: keyof Meal; header: string; width: string; hideOnMobile: boolean}> = [
  { key: 'name', header: 'Name', width: 'auto', hideOnMobile: false },
  { key: 'description', header: 'Description', width: '25%', hideOnMobile: true },
  { key: 'notes', header: 'Notes', width: '25%', hideOnMobile: true },
  { key: 'recipe', header: 'Recipe', width: '25%', hideOnMobile: true }
]

export default function MealTracker() {
  const {
    data: meals,
    newItem: newMeal,
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
  } = useDataManager<Meal>('/api/meals')

  const { searchTerm } = useSearch()

  if (authStatus === "unauthenticated") {
    return (
        <div className="flex items-center justify-center h-full">
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
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-xl">Loading meals...</p>
          </div>
        </div>
    )
  }

  const filteredMeals = meals.filter(meal =>
      Object.values(meal).some(value =>
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
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <div className="flex space-x-4 text-sm text-gray-600">
              <span>Total Meals: {filteredMeals.length}</span>
            </div>
            <div className="flex flex-col md:flex-row gap-2 mt-2 md:mt-0">
              {hasWriteAccess && (
                  <>
                    <CSVImport onImport={handleImport} fields={mealFields.map(field => field.name)}/>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button>Add New Meal</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{editingItem ? 'Edit Meal' : 'Add New Meal'}</DialogTitle>
                        </DialogHeader>
                        <DataForm
                            fields={mealFields}
                            values={editingItem || newMeal}
                            onChange={handleInputChange}
                            onSubmit={handleSubmit}
                            submitLabel={editingItem ? 'Update Meal' : 'Add Meal'}
                        />
                      </DialogContent>
                    </Dialog>
                  </>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm flex flex-col flex-grow overflow-hidden">
            <div className="p-4 border-b">
              <h1 className="text-2xl font-bold">Meals</h1>
            </div>
            <div className="flex-grow overflow-auto">
              <DataTable
                  data={filteredMeals}
                  columns={mealColumns}
                  onEdit={handleEdit}
                  onDelete={(id) => handleDelete(id)}
              />
            </div>
          </div>
        </div>
      </div>
  )
}