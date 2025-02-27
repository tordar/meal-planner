'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from "@/lib/utils"
import { useSidebar } from '@/components/ui/sidebar'

interface NavItemProps {
    href: string;
    icon: React.ReactNode;
    label: string;
    className?: string;
}

export function NavItem({ href, icon, label, className = '' }: NavItemProps) {
    const pathname = usePathname()
    const isActive = pathname === href
    const { isMobile, setOpenMobile } = useSidebar()

    const handleClick = () => {
        // Close the mobile sidebar when a navigation link is clicked
        if (isMobile) {
            setOpenMobile(false)
        }
    }

    return (
        <Link
            href={href}
            onClick={handleClick}
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
                className
            )}
        >
      <span className="inline-flex items-center justify-center w-5 h-5">
        {icon}
      </span>
            <span>{label}</span>
        </Link>
    )
}