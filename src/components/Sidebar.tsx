import React from 'react'
import { Utensils, Book, Coffee, Calendar, Menu } from 'lucide-react'
import { SignInButton } from '@/components/SignInButton'
import { NavItem } from '@/components/NavItem'
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
            {navigation}
            <div className="p-4 border-t">
                <SignInButton/>
            </div>
        </aside>
    )
}