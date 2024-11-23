import type { Metadata, Viewport } from "next";
import './globals.css'
import { Inter } from 'next/font/google'
import { Sidebar } from '@/components/Sidebar'
import { Providers } from './providers'

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
        <body className={`${inter.className} h-full flex`}>
        <Providers>
            <div className="flex h-full w-full">
                {/* Mobile Header */}
                <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white shadow-md z-50 flex items-center justify-between px-4">
                    <span className="text-xl font-semibold">Meal Planner</span>
                    <Sidebar isMobile />
                </header>

                {/* Desktop Sidebar */}
                <Sidebar />

                {/* Main Content */}
                <main className="flex-1 overflow-hidden flex flex-col">
                    <div className="md:hidden h-16"/> {/* Spacer for mobile header */}
                    <div className="flex-1 overflow-y-auto">
                        {children}
                    </div>
                </main>
            </div>
        </Providers>
        </body>
        </html>
    )
}