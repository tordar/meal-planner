'use client'

import React from 'react'
import { Utensils, Book, Coffee, Calendar, Menu, Search } from 'lucide-react'
import { SignInButton } from '@/components/SignInButton'
import { NavItem } from '@/components/NavItem'
import { Input } from "@/components/ui/input"
import { useSearch } from '@/contexts/SearchContext'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

interface SidebarProps {
    isMobile?: boolean;
}

export function Sidebar({ isMobile = false }: SidebarProps) {
    const { searchTerm, setSearchTerm } = useSearch()

    const searchBar = (
        <div className="px-4 py-2">
            <div className="relative">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                    type="search"
                    placeholder="Search..."
                    className="w-full pl-8 bg-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
        </div>
    )

    const navigation = (
        <nav className="flex-grow py-4">
            <NavItem href="/" icon={<Utensils size={20}/>} label="Meals"/>
            <NavItem href="/sides" icon={<Book size={20}/>} label="Sides"/>
            <NavItem href="/ideas" icon={<Coffee size={20}/>} label="Ideas"/>
            <NavItem href="/seasonal-calendar" icon={<Calendar size={20}/>} label="Seasonal Calendar"/>
        </nav>
    )

    if (isMobile) {
        return (
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="Open menu">
                        <Menu className="h-6 w-6"/>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0">
                    <SheetHeader className="p-4 border-b">
                        <SheetTitle>Meal Planner</SheetTitle>
                    </SheetHeader>
                    {searchBar}
                    {navigation}
                    <div className="p-4 border-t">
                        <SignInButton/>
                    </div>
                </SheetContent>
            </Sheet>
        )
    }

    return (
        <aside className="hidden md:flex w-64 bg-gray-100 shadow-md flex-col">
            <div className="p-4 border-b">
                <span className="text-xl font-semibold">Meal Planner</span>
            </div>
            {searchBar}
            {navigation}
            <div className="p-4 border-t">
                <SignInButton/>
            </div>
        </aside>
    )
}