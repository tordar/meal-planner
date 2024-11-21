import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export interface Field {
    name: string;
    label: string;
    type: 'text' | 'textarea' | 'checkbox' | 'select' | 'multiselect';
    options?: { value: string; label: string }[];
    required?: boolean;
}

interface DataFormProps {
    fields: Field[];
    values: Record<string, string | string[] | boolean>;
    onChange: (name: string, value: string | string[] | boolean) => void;
    onSubmit: () => void;
    submitLabel: string;
}

export function DataForm({ fields, values, onChange, onSubmit, submitLabel }: DataFormProps) {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit();
    };

    const renderField = (field: Field) => {
        switch (field.type) {
            case 'text':
                return (
                    <Input
                        id={field.name}
                        name={field.name}
                        value={values[field.name] as string || ''}
                        onChange={(e) => onChange(field.name, e.target.value)}
                        required={field.required}
                    />
                );
            case 'textarea':
                return (
                    <Textarea
                        id={field.name}
                        name={field.name}
                        value={values[field.name] as string || ''}
                        onChange={(e) => onChange(field.name, e.target.value)}
                        required={field.required}
                    />
                );
            case 'checkbox':
                return (
                    <Checkbox
                        id={field.name}
                        name={field.name}
                        checked={!!values[field.name]}
                        onCheckedChange={(checked) => onChange(field.name, checked)}
                    />
                );
            case 'select':
            case 'multiselect':
                return (
                    <Select
                        value={values[field.name] as string}
                        onValueChange={(value) => onChange(field.name, value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                        <SelectContent>
                            {field.options?.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                );
            default:
                return null;
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map((field) => (
                <div key={field.name} className="space-y-2">
                    <label htmlFor={field.name} className="text-sm font-medium">
                        {field.label}
                    </label>
                    {renderField(field)}
                </div>
            ))}
            <Button type="submit" className="w-full">
                {submitLabel}
            </Button>
        </form>
    );
}