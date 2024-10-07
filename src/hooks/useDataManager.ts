import { useState, useEffect, useCallback } from 'react'

export function useDataManager<T extends { _id: string }>(apiEndpoint: string) {
    const [data, setData] = useState<T[]>([])
    const [filteredData, setFilteredData] = useState<T[]>([])
    const [newItem, setNewItem] = useState<Omit<T, '_id'>>({} as Omit<T, '_id'>)
    const [editingItem, setEditingItem] = useState<T | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (searchTerm) {
            const lowercasedSearch = searchTerm.toLowerCase()
            setFilteredData(data.filter(item =>
                Object.values(item).some(value =>
                    value.toString().toLowerCase().includes(lowercasedSearch)
                )
            ))
        } else {
            setFilteredData(data)
        }
    }, [searchTerm, data])

    const fetchData = useCallback(async () => {
        setIsLoading(true)
        try {
            const response = await fetch(apiEndpoint)
            if (!response.ok) {
                throw new Error('Failed to fetch data')
            }
            const responseData = await response.json()
            setData(responseData.data)
            setFilteredData(responseData.data)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred while fetching data')
        } finally {
            setIsLoading(false)
        }
    }, [apiEndpoint])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        if (editingItem) {
            setEditingItem(prev => {
                if (prev === null) return null
                return { ...prev, [name]: value } as T
            })
        } else {
            setNewItem(prev => ({ ...prev, [name]: value }))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        try {
            if (editingItem) {
                const response = await fetch(`${apiEndpoint}/${editingItem._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(editingItem)
                })

                if (!response.ok) {
                    throw new Error('Failed to update item')
                }
            } else {
                const response = await fetch(apiEndpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newItem)
                })

                if (!response.ok) {
                    throw new Error('Failed to create item')
                }
            }

            setNewItem({} as Omit<T, '_id'>)
            setEditingItem(null)
            await fetchData()
            setIsDialogOpen(false)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred while submitting data')
        }
    }

    const handleEdit = (item: T) => {
        setEditingItem(item)
        setIsDialogOpen(true)
    }

    const handleDelete = async (id: string) => {
        setError(null)
        try {
            const response = await fetch(`${apiEndpoint}/${id}`, {
                method: 'DELETE',
            })

            if (!response.ok) {
                throw new Error('Failed to delete item')
            }

            await fetchData()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred while deleting the item')
        }
    }

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
    }

    const handleImport = async (importedData: Record<string, string>[]) => {
        setIsLoading(true)
        setError(null)
        try {
            const response = await fetch(`${apiEndpoint}/bulk`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(importedData)
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to import data')
            }

            await fetchData()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred during import')
        } finally {
            setIsLoading(false)
        }
    }

    return {
        data: filteredData,
        newItem,
        editingItem,
        isLoading,
        isDialogOpen,
        searchTerm,
        error,
        setIsDialogOpen,
        handleInputChange,
        handleSubmit,
        handleEdit,
        handleDelete,
        handleSearch,
        handleImport
    }
}