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
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from "@/lib/utils"

interface SidebarProps {
    isMobile?: boolean;
}

// Custom NavItem for mobile sidebar with close functionality
function MobileNavItem({ 
    href, 
    icon, 
    label, 
    onNavigate 
}: { 
    href: string; 
    icon: React.ReactNode; 
    label: string; 
    onNavigate: () => void 
}) {
    const pathname = usePathname()
    const isActive = pathname === href

    return (
        <Link
            href={href}
            onClick={onNavigate}
            className={cn(
                "flex items-center h-10 w-full gap-3 px-4 text-sm font-medium transition-all",
                "hover:bg-white/50",
                isActive ? [
                    "bg-white text-gray-900",
                    "shadow-[0_2px_4px_rgba(0,0,0,0.02),0_1px_2px_rgba(0,0,0,0.03)]",
                    "rounded-md",
                ] : [
                    "text-gray-600",
                ],
            )}
        >
            <span className="inline-flex items-center justify-center w-5 h-5">
                {icon}
            </span>
            <span>{label}</span>
        </Link>
    )
}

export function Sidebar({ isMobile = false }: SidebarProps) {
    const { searchTerm, setSearchTerm } = useSearch()
    const sidebarTitleId = "sidebar-title"
    const [mobileOpen, setMobileOpen] = React.useState(false)

    // Close sidebar when navigating
    const handleNavigate = React.useCallback(() => {
        setMobileOpen(false)
    }, [])

    // Navigation for desktop sidebar
    const desktopNavigation = (
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

    // Navigation for mobile sidebar with close functionality
    const mobileNavigation = (
        <div className="flex flex-col gap-1 px-2 py-2">
            <MobileNavItem 
                href="/" 
                icon={<Utensils size={20}/>} 
                label="Meals" 
                onNavigate={handleNavigate}
            />
            <MobileNavItem 
                href="/sides" 
                icon={<Book size={20}/>} 
                label="Sides" 
                onNavigate={handleNavigate}
            />
            <MobileNavItem 
                href="/ideas" 
                icon={<Coffee size={20}/>} 
                label="Ideas" 
                onNavigate={handleNavigate}
            />
            <MobileNavItem 
                href="/seasonal-calendar" 
                icon={<Calendar size={20}/>} 
                label="Seasonal Calendar" 
                onNavigate={handleNavigate}
            />
        </div>
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
                                {mobileNavigation}
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
                {desktopNavigation}
            </SidebarContent>
            <SidebarFooter className="p-4 border-t">
                <SignInButton />
            </SidebarFooter>
        </ShadcnSidebar>
    )
}