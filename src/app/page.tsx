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

interface Meal {
  _id: string;
  name: string;
  description: string;
  notes: string;
  recipe: string;
  time: string;
}

const mealFields = [
  { name: 'name', label: 'Meal Name', type: 'text' as const, required: true },
  { name: 'description', label: 'Description', type: 'text' as const },
  { name: 'notes', label: 'Notes', type: 'textarea' as const },
  { name: 'recipe', label: 'Recipe', type: 'textarea' as const}
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
  } = useDataManager<Meal>('/api/meals')

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
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 mt-12 md:mt-0">
            <SearchBar
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search meals..."
            />
            <div className="flex space-x-4 text-sm text-gray-600 mt-4">
              <span>Total Meals: {meals.length}</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm flex flex-col flex-grow overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b">
              <h1 className="text-2xl font-bold">Meals</h1>

              <div className="flex gap-2">
                {hasWriteAccess && (
                    <CSVImport onImport={handleImport} fields={mealFields.map(field => field.name)}/>
                )}
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    {hasWriteAccess && (
                        <Button>Add New Meal</Button>
                    )}
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
              </div>
            </div>

            <div className="flex-grow overflow-auto">
              <DataTable
                  data={meals}
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