import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Field {
    name: string;
    label: string;
    type: 'text' | 'textarea' | 'checkbox' | 'select' | 'multiselect';
    options?: { value: string; label: string }[];
    required?: boolean;
}

interface DataFormProps {
    fields: Field[];
    values: Record<string, string | boolean | string[] | undefined>;
    onChange: (name: string, value: string | boolean | string[]) => void;
    onSubmit: () => void;
    submitLabel: string;
}

export function DataForm({ fields, values, onChange, onSubmit, submitLabel }: DataFormProps) {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit();
    };

    const handleTextareaChange = (name: string, value: string) => {
        // Preserve newlines by replacing them with '\n'
        const preservedValue = value.replace(/\r\n/g, '\n');
        onChange(name, preservedValue);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map((field) => (
                <div key={field.name} className="space-y-2">
                    <label htmlFor={field.name} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {field.label}
                    </label>
                    {field.type === 'text' && (
                        <Input
                            type="text"
                            id={field.name}
                            name={field.name}
                            value={values[field.name] as string || ''}
                            onChange={(e) => onChange(field.name, e.target.value)}
                            required={field.required}
                        />
                    )}
                    {field.type === 'textarea' && (
                        <Textarea
                            id={field.name}
                            name={field.name}
                            value={values[field.name] as string || ''}
                            onChange={(e) => handleTextareaChange(field.name, e.target.value)}
                            required={field.required}
                        />
                    )}
                    {field.type === 'checkbox' && (
                        <Checkbox
                            id={field.name}
                            name={field.name}
                            checked={values[field.name] as boolean || false}
                            onCheckedChange={(checked) => onChange(field.name, checked)}
                        />
                    )}
                    {field.type === 'select' && field.options && (
                        <Select
                            value={values[field.name] as string}
                            onValueChange={(value) => onChange(field.name, value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select an option" />
                            </SelectTrigger>
                            <SelectContent>
                                {field.options.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                    {field.type === 'multiselect' && field.options && (
                        <div className="space-y-2">
                            {field.options.map((option) => (
                                <div key={option.value} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`${field.name}-${option.value}`}
                                        checked={(values[field.name] as string[] || []).includes(option.value)}
                                        onCheckedChange={(checked) => {
                                            const currentValues = values[field.name] as string[] || [];
                                            const newValues = checked
                                                ? [...currentValues, option.value]
                                                : currentValues.filter((v) => v !== option.value);
                                            onChange(field.name, newValues);
                                        }}
                                    />
                                    <label htmlFor={`${field.name}-${option.value}`}>{option.label}</label>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
            <Button type="submit">{submitLabel}</Button>
        </form>
    )
}