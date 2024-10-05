'use client'

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DataTable } from "@/components/DataTable"
import { DataForm } from "@/components/DataForm"
import { SearchBar } from "@/components/SearchBar"
import { useDataManager } from "@/hooks/useDataManager"
import {CSVImport} from "@/components/CsvImport";

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

const mealColumns: Array<{key: keyof Meal; header: string; width: string}> = [
  { key: 'name', header: 'Name', width: '20%' },
  { key: 'description', header: 'Description', width: '25%' },
  { key: 'notes', header: 'Notes', width: '20%' },
  { key: 'recipe', header: 'Recipe', width: '25%' },
  { key: 'time', header: 'Time', width: '10%' },
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
    handleSearch,
    handleImport
  } = useDataManager<Meal>('/api/meals')

  return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Meal Tracker</h1>

        <div className="flex justify-between items-center mb-4">
          <div className="w-2/3">
            <SearchBar value={searchTerm} onChange={handleSearch}/>
          </div>
          <div className="flex gap-2">
          <CSVImport onImport={handleImport} fields={mealFields.map(field => field.name)} />
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button >Add New Meal</Button>
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

        {isLoading ? (
            <p>Loading meals...</p>
        ) : (
            <DataTable
                data={meals}
                columns={mealColumns}
                onEdit={handleEdit}
                onDelete={(id) => handleDelete(id)}
            />
        )}
      </div>
  )
}