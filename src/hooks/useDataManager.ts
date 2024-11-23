import { useState, useEffect, useCallback, useMemo } from 'react'
import { useSession } from 'next-auth/react'

type DataItem = {
    _id: string;
    [key: string]: unknown;
}

export function useDataManager<T extends DataItem>(apiEndpoint: string) {
    const [data, setData] = useState<T[]>([])
    const [newItem, setNewItem] = useState<Partial<T>>({})
    const [editingItem, setEditingItem] = useState<T | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const { data: session, status } = useSession()

    const fetchData = useCallback(async () => {
        try {
            const response = await fetch(apiEndpoint)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            const result = await response.json()
            if (Array.isArray(result)) {
                setData(result)
            } else {
                console.error('Received non-array data:', result)
                setError('Received invalid data format')
                setData([])
            }
        } catch (err) {
            console.error('Error fetching data:', err)
            setError('An error occurred while fetching data')
            setData([])
        } finally {
            setIsLoading(false)
        }
    }, [apiEndpoint])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const hasWriteAccess = status === "authenticated" && session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL

    const handleInputChange = (name: string, value: unknown) => {
        if (editingItem) {
            setEditingItem(prev => {
                if (prev === null) return null
                return { ...prev, [name]: value }
            })
        } else {
            setNewItem(prev => ({ ...prev, [name]: value }))
        }
    }

    const handleSubmit = async () => {
        try {
            const itemToSubmit = editingItem || newItem
            const method = editingItem ? 'PUT' : 'POST'
            const url = editingItem ? `${apiEndpoint}/${editingItem._id}` : apiEndpoint

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(itemToSubmit),
            })

            if (!response.ok) {
                throw new Error('Failed to submit data')
            }

            await fetchData()
            setIsDialogOpen(false)
            setNewItem({})
            setEditingItem(null)
        } catch (err) {
            console.error('Error submitting data:', err)
            setError('An error occurred while submitting data')
        }
    }

    const handleEdit = (item: T) => {
        setEditingItem(item)
        setIsDialogOpen(true)
    }

    const handleDelete = async (id: string) => {
        try {
            const response = await fetch(`${apiEndpoint}/${id}`, {
                method: 'DELETE',
            })

            if (!response.ok) {
                throw new Error('Failed to delete item')
            }

            await fetchData()
        } catch (err) {
            console.error('Error deleting item:', err)
            setError('An error occurred while deleting the item')
        }
    }

    const handleSearch = (term: string) => {
        setSearchTerm(term)
    }

    const handleImport = async (importedData: Partial<T>[]) => {
        try {
            const response = await fetch(apiEndpoint + '/import', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(importedData),
            })

            if (!response.ok) {
                throw new Error('Failed to import data')
            }

            await fetchData()
        } catch (err) {
            console.error('Error importing data:', err)
            setError('An error occurred while importing data')
        }
    }

    const filteredData = useMemo(() => {
        return data.filter((item) =>
            Object.values(item).some((value) =>
                String(value).toLowerCase().includes(searchTerm.toLowerCase())
            )
        )
    }, [data, searchTerm])

    return {
        data: filteredData,
        newItem,
        editingItem,
        isLoading,
        error,
        isDialogOpen,
        searchTerm,
        setIsDialogOpen,
        hasWriteAccess,
        authStatus: status,
        handleInputChange,
        handleSubmit,
        handleEdit,
        handleDelete,
        handleSearch,
        handleImport,
    }
}