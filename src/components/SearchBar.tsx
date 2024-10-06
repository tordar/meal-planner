import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface SearchBarProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = "Search..." }: SearchBarProps) {
    return (
        <div className="flex items-center justify-between w-full max-w-3xl bg-white rounded-full shadow-sm">
            <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                    type="text"
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    className="pl-10 pr-4 py-2 w-full rounded-full border-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
            </div>
        </div>
    )
}