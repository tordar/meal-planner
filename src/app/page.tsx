'use client'

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DataTable } from "@/components/DataTable"
import { DataForm } from "@/components/DataForm"
import { SearchBar } from "@/components/SearchBar"
import { useDataManager } from "@/hooks/useDataManager"

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
  { name: 'recipe', label: 'Recipe', type: 'textarea' as const },
  { name: 'time', label: 'Time', type: 'text' as const },
]

const mealColumns = [
  { key: 'name', header: 'Name' },
  { key: 'description', header: 'Description' },
  { key: 'notes', header: 'Notes' },
  { key: 'recipe', header: 'Recipe' },
  { key: 'time', header: 'Time' },
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
    handleInputChange,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleSearch
  } = useDataManager<Meal>('/api/meals')

  return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Meal Tracker</h1>

        <SearchBar value={searchTerm} onChange={handleSearch} />

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="mb-4">Add New Meal</Button>
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

        {isLoading ? (
            <p>Loading meals...</p>
        ) : (
            <DataTable
                data={meals}
                columns={mealColumns}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        )}
      </div>
  )
}