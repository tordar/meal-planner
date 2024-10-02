'use client'

import { useState } from 'react'
import { Button } from "./components/ui/button"
import { Input } from "./components/ui/input"
import { Textarea } from "./components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./components/ui/table"

interface Meal {
  id: number;
  name: string;
  description: string;
  notes: string;
  recipe: string;
}

export default function MealTracker() {
  const [meals, setMeals] = useState<Meal[]>([])
  const [newMeal, setNewMeal] = useState<Omit<Meal, 'id'>>({
    name: '',
    description: '',
    notes: '',
    recipe: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewMeal(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setMeals(prev => [...prev, { ...newMeal, id: Date.now() }])
    setNewMeal({ name: '', description: '', notes: '', recipe: '' })
  }

  return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Meal Tracker</h1>

        <form onSubmit={handleSubmit} className="mb-8 space-y-4">
          <Input
              type="text"
              name="name"
              value={newMeal.name}
              onChange={handleInputChange}
              placeholder="Meal Name"
              required
          />
          <Input
              type="text"
              name="description"
              value={newMeal.description}
              onChange={handleInputChange}
              placeholder="Description"
          />
          <Textarea
              name="notes"
              value={newMeal.notes}
              onChange={handleInputChange}
              placeholder="Notes"
          />
          <Textarea
              name="recipe"
              value={newMeal.recipe}
              onChange={handleInputChange}
              placeholder="Recipe"
          />
          <Button type="submit">Add Meal</Button>
        </form>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead>Recipe</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {meals.map((meal) => (
                <TableRow key={meal.id}>
                  <TableCell>{meal.name}</TableCell>
                  <TableCell>{meal.description}</TableCell>
                  <TableCell>{meal.notes}</TableCell>
                  <TableCell>{meal.recipe}</TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
  )
}