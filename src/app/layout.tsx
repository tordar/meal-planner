import type { Metadata } from "next";
import './globals.css'
import { Inter } from 'next/font/google'
import { NavLink } from '@/components/NavLink'
import { Home, Utensils, Book, Coffee, FileText, User, Layout as LayoutIcon, FileQuestion } from 'lucide-react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: "Food Planner",
    description: "Plan your meals and track your food",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="h-full">
        <body className={`${inter.className} flex h-full`}>
        <div className="flex h-screen bg-gray-100 ">
            {/* Sidebar */}
            <div className="w-64 flex flex-col">
                {/* Logo */}
                <div className="p-4 flex items-center">
                    <span className="text-xl font-semibold">Food Planner</span>
                </div>

                {/* Navigation */}
                <nav className="flex-grow py-4">
                    <NavItem href="/" icon={<Utensils size={20} />} label="Meals" />
                    <NavItem href="/sides" icon={<Book size={20} />} label="Sides" />
                    <NavItem href="/ideas" icon={<Coffee size={20} />} label="Ideas" />
                </nav>

                {/* Resources Section */}
                <div className="mt-auto p-4 border-t border-gray-700">
                    <NavItem href="/docs" icon={<FileQuestion size={20} />} label="Documentation" />
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Page Content */}
                <main className="flex-1 overflow-auto bg-gray-100 p-6">
                    <div className="rounded-lg shadow-sm p-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
        </body>
        </html>
    )
}

function NavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    return (
        <NavLink href={href} className="flex items-center py-2 px-4 text-gray-300 hover:bg-gray-800">
            <span className="inline-flex items-center justify-center w-6 h-6 mr-3">
                {icon}
            </span>
            <span>{label}</span>
        </NavLink>
    )
}