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
    SidebarMenu,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Sheet, SheetContent } from "@/components/ui/sheet"

interface SidebarProps {
    isMobile?: boolean;
}

export function Sidebar({ isMobile = false }: SidebarProps) {
    const { searchTerm, setSearchTerm } = useSearch()
    const sidebarTitleId = "sidebar-title"
    const [mobileOpen, setMobileOpen] = React.useState(false)

    // Navigation menu - used in both mobile and desktop
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

    // Mobile sidebar - NO search functionality
    if (isMobile) {
        return (
            <>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    aria-label="Open menu"
                    onClick={() => setMobileOpen(true)}
                >
                    <Menu className="h-6 w-6"/>
                </Button>
                <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                    <SheetContent
                        className="w-[18rem] bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
                        side="left"
                    >
                        <div className="flex h-full w-full flex-col">
                            <div className="p-4 border-b">
                                <h2 id={sidebarTitleId} className="text-xl font-semibold">Meal Planner</h2>
                            </div>
                            <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-auto">
                                {navigation}
                            </div>
                            <div className="p-4 border-t">
                                <SignInButton />
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </>
        )
    }

    // Desktop sidebar - WITH search functionality
    return (
        <ShadcnSidebar className="hidden md:flex w-64 border-r shrink-0 h-full">
            <SidebarHeader className="p-4 border-b">
                <span className="text-xl font-semibold">Meal Planner</span>
            </SidebarHeader>
            <SidebarContent>
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
                {navigation}
            </SidebarContent>
            <SidebarFooter className="p-4 border-t">
                <SignInButton />
            </SidebarFooter>
        </ShadcnSidebar>
    )
}