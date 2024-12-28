'use client'

import React from 'react'
import { Utensils, Book, Coffee, Calendar, Search, Menu } from 'lucide-react'
import { SignInButton } from '@/components/SignInButton'
import { NavItem } from '@/components/NavItem'
import { Input } from "@/components/ui/input"
import { useSearch } from '@/contexts/SearchContext'
import { Button } from "@/components/ui/button"
import {
    Sidebar as ShadcnSidebar,
    SidebarContent,
    SidebarHeader,
    SidebarFooter,
    SidebarTrigger,
    SidebarMenu,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

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
        <SidebarMenu>
            <SidebarMenuItem>
                <NavItem href="/" icon={<Utensils size={20}/>} label="Meals"/>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <NavItem href="/sides" icon={<Book size={20}/>} label="Sides"/>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <NavItem href="/ideas" icon={<Coffee size={20}/>} label="Ideas"/>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <NavItem href="/seasonal-calendar" icon={<Calendar size={20}/>} label="Seasonal Calendar"/>
            </SidebarMenuItem>
        </SidebarMenu>
    )

    const sidebarContent = (
        <>
            <SidebarHeader className="p-4 border-b">
                <span className="text-xl font-semibold">Meal Planner</span>
            </SidebarHeader>
            <SidebarContent>
                {searchBar}
                {navigation}
            </SidebarContent>
            <SidebarFooter className="p-4 border-t">
                <SignInButton />
            </SidebarFooter>
        </>
    )

    if (isMobile) {
        return (
            <>
                <SidebarTrigger>
                    <Button variant="ghost" size="icon" aria-label="Open menu">
                        <Menu className="h-6 w-6"/>
                    </Button>
                </SidebarTrigger>
                <ShadcnSidebar className="w-64">
                    {sidebarContent}
                </ShadcnSidebar>
            </>
        )
    }

    return (
        <ShadcnSidebar className="hidden md:flex w-64 border-r shrink-0 h-full">
            {sidebarContent}
        </ShadcnSidebar>
    )
}