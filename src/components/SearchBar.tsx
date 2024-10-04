import { Input } from "@/components/ui/input"

interface SearchBarProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
    return (
        <div className="mb-4">
            <Input
                type="text"
                placeholder="Search..."
                value={value}
                onChange={onChange}
            />
        </div>
    )
}