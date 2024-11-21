import React from 'react'
import { Input } from "@/components/ui/input"

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export function SearchBar({ value, onChange, placeholder, className }: SearchBarProps) {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    return (
        <Input
            type="text"
            placeholder={placeholder || "Search..."}
            value={value}
            onChange={handleInputChange}
            className={className}
        />
    );
}