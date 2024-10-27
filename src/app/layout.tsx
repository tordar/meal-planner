import type { Metadata } from "next";
import './globals.css'
import { Inter } from 'next/font/google'
import { NavLink } from '@/components/NavLink'
import { Utensils, Book, Coffee, User } from 'lucide-react'
import { Providers } from './providers'
import { SignInButton } from '@/components/SignInButton'

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
        <body className={`${inter.className} h-full`}>
        <Providers>
            <div className="flex h-full">
                {/* Sidebar */}
                <div className="w-64 bg-gray-100 shadow-md flex flex-col">
                    {/* Logo */}
                    <div className="p-4 border-b">
                        <span className="text-xl font-semibold">Food Planner</span>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-grow py-4">
                        <NavItem href="/" icon={<Utensils size={20} />} label="Meals" />
                        <NavItem href="/sides" icon={<Book size={20} />} label="Sides" />
                        <NavItem href="/ideas" icon={<Coffee size={20} />} label="Ideas" />
                    </nav>

                    {/* Sign In Button */}
                    <div className="p-4 border-t">
                        <SignInButton />
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-hidden">
                    {children}
                </div>
            </div>
        </Providers>
        </body>
        </html>
    )
}

function NavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
    return (
        <NavLink href={href} className="flex items-center py-2 px-4 text-gray-700 hover:bg-gray-100">
            <span className="inline-flex items-center justify-center w-6 h-6 mr-3">
                {icon}
            </span>
            <span>{label}</span>
        </NavLink>
    )
}