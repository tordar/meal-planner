'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavLinkProps {
    href: string
    children: React.ReactNode
}

export function NavLink({ href, children }: NavLinkProps) {
    const pathname = usePathname()
    const isActive = pathname === href

    return (
        <Link
            href={href}
            className={`block py-2 px-4 text-gray-700 hover:bg-gray-200 ${
                isActive ? 'bg-gray-200 font-semibold' : ''
            }`}
        >
            {children}
        </Link>
    )
}