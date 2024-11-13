import type { Metadata, Viewport } from "next";
import './globals.css'
import { Inter } from 'next/font/google'
import { NavLink } from '@/components/NavLink'
import { Utensils, Book, Coffee, Menu } from 'lucide-react'
import { Providers } from './providers'
import { SignInButton } from '@/components/SignInButton'
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: "Meal Planner",
    description: "Overview of meals",
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="h-full">
        <body className={`${inter.className} h-full`}>
        <Providers>
            <div className="flex h-full">
                {/* Mobile Header */}
                <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white shadow-md z-50 flex items-center justify-between px-4">
                    <span className="text-xl font-semibold">Meal Planner</span>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" aria-label="Open menu">
                                <Menu className="h-6 w-6"/>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-64 p-0">
                            <SheetHeader className="p-4 border-b">
                                <SheetTitle>Food Planner</SheetTitle>
                            </SheetHeader>
                            <nav className="flex-grow py-4">
                                <NavItem href="/" icon={<Utensils size={20}/>} label="Meals"/>
                                <NavItem href="/sides" icon={<Book size={20}/>} label="Sides"/>
                                <NavItem href="/ideas" icon={<Coffee size={20}/>} label="Ideas"/>
                            </nav>
                            <div className="p-4 border-t">
                                <SignInButton/>
                            </div>
                        </SheetContent>
                    </Sheet>
                </header>

                {/* Desktop Sidebar */}
                <aside className="hidden md:flex w-64 bg-gray-100 shadow-md flex-col">
                    {/* Logo */}
                    <div className="p-4 border-b">
                        <span className="text-xl font-semibold">Meal Planner</span>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-grow py-4">
                        <NavItem href="/" icon={<Utensils size={20}/>} label="Meals"/>
                        <NavItem href="/sides" icon={<Book size={20}/>} label="Sides"/>
                        <NavItem href="/ideas" icon={<Coffee size={20}/>} label="Ideas"/>
                    </nav>

                    {/* Sign In Button */}
                    <div className="p-4 border-t">
                        <SignInButton/>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 flex flex-col relative">
                    <div className="md:hidden h-16"/>
                    {/* Spacer for mobile header */}
                    <div className="flex-grow flex flex-col">
                        {children}
                    </div>
                </main>
            </div>
        </Providers>
        </body>
        </html>
    )
}

function NavItem({href, icon, label}: { href: string; icon: React.ReactNode; label: string }) {
    return (
        <NavLink href={href} className="flex items-center py-2 px-4 text-gray-700 hover:bg-gray-100">
            <span className="inline-flex items-center justify-center w-6 h-6 mr-3">
                {icon}
            </span>
            <span>{label}</span>
        </NavLink>
    )
}