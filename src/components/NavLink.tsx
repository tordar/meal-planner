'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavLinkProps {
    href: string;
    children: React.ReactNode;
    className?: string;
}

export function NavLink({ href, children, className }: NavLinkProps) {
    const pathname = usePathname()
    const isActive = pathname === href

    return (
        <Link
            href={href}
            className={`${className} ${isActive ? 'bg-gray-200 text-gray-900' : ''}`}
        >
            {children}
        </Link>
    )
}