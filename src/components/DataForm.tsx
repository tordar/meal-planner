import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface Field {
    name: string;
    label: string;
    type: 'text' | 'textarea';
    placeholder?: string;
    required?: boolean;
}

interface DataFormProps<T> {
    fields: Field[];
    values: T;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
    submitLabel: string;
}

export function DataForm<T>({ fields, values, onChange, onSubmit, submitLabel }: DataFormProps<T>) {
    return (
        <form onSubmit={onSubmit} className="space-y-4">
            {fields.map((field) => (
                <div key={field.name} className="space-y-2">
                    <Label htmlFor={field.name}>{field.label}</Label>
                    {field.type === 'textarea' ? (
                        <Textarea
                            id={field.name}
                            name={field.name}
                            value={values[field.name as keyof T] as string}
                            onChange={onChange}
                            placeholder={field.placeholder}
                            required={field.required}
                        />
                    ) : (
                        <Input
                            id={field.name}
                            name={field.name}
                            value={values[field.name as keyof T] as string}
                            onChange={onChange}
                            placeholder={field.placeholder}
                            required={field.required}
                        />
                    )}
                </div>
            ))}
            <Button type="submit">{submitLabel}</Button>
        </form>
    )
}