import { useState, useEffect } from 'react'

export function useDataManager<T extends { _id: string }>(apiEndpoint: string) {
    const [data, setData] = useState<T[]>([])
    const [filteredData, setFilteredData] = useState<T[]>([])
    const [newItem, setNewItem] = useState<Omit<T, '_id'>>({} as Omit<T, '_id'>)
    const [editingItem, setEditingItem] = useState<T | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        fetchData()
    }, [])

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

    const fetchData = async () => {
        setIsLoading(true)
        const response = await fetch(apiEndpoint)
        const responseData = await response.json()
        setData(responseData.data)
        setFilteredData(responseData.data)
        setIsLoading(false)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        if (editingItem) {
            setEditingItem(prev => ({ ...prev, [name]: value } as T))
        } else {
            setNewItem(prev => ({ ...prev, [name]: value } as Omit<T, '_id'>))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const method = editingItem ? 'PUT' : 'POST'
        const body = editingItem ? JSON.stringify(editingItem) : JSON.stringify(newItem)

        const response = await fetch(apiEndpoint, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body
        })

        if (response.ok) {
            setNewItem({} as Omit<T, '_id'>)
            setEditingItem(null)
            fetchData()
            setIsDialogOpen(false)
        }
    }

    const handleEdit = (item: T) => {
        setEditingItem(item)
        setIsDialogOpen(true)
    }

    const handleDelete = async (id: string) => {
        const response = await fetch(`${apiEndpoint}?id=${id}`, {
            method: 'DELETE',
        })

        if (response.ok) {
            fetchData()
        }
    }

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value)
    }

    return {
        data: filteredData,
        newItem,
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
    }
}