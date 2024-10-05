'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import Papa from 'papaparse'

interface CSVImportProps {
    onImport: (data: any[]) => void;
    fields: string[];
}

export function CSVImport({ onImport, fields }: CSVImportProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [file, setFile] = useState<File | null>(null)
    const [error, setError] = useState<string | null>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0])
            setError(null)
        }
    }

    const handleImport = () => {
        if (file) {
            Papa.parse(file, {
                complete: (results) => {
                    console.log('Parsed results:', results);

                    if (results.errors.length > 0) {
                        setError(`Error parsing CSV: ${results.errors[0].message}`)
                        return
                    }

                    if (!Array.isArray(results.data) || results.data.length === 0) {
                        setError('The CSV file appears to be empty or invalid.')
                        return
                    }

                    const headers = Object.keys(results.data[0]).map(header => header.toLowerCase().trim());
                    console.log('Detected headers:', headers);
                    console.log('Expected fields:', fields);

                    const missingFields = fields.filter(field => !headers.includes(field.toLowerCase()));
                    if (missingFields.length > 0) {
                        setError(`Missing required fields: ${missingFields.join(', ')}`)
                        return
                    }

                    const data = results.data
                        .filter((row: any) => Object.values(row).some((value) => value !== ''))
                        .map((row: any) => {
                            const newRow: any = {};
                            fields.forEach(field => {
                                const matchingHeader = Object.keys(row).find(header =>
                                    header.toLowerCase().trim() === field.toLowerCase()
                                );
                                if (matchingHeader) {
                                    newRow[field] = row[matchingHeader];
                                } else {
                                    newRow[field] = '';
                                }
                            });
                            return newRow;
                        });

                    console.log('Processed data:', data);

                    onImport(data)
                    setIsOpen(false)
                    setFile(null)
                },
                header: true,
                skipEmptyLines: true,
            })
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Import CSV</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Import CSV</DialogTitle>
                    <DialogDescription>
                        Upload a CSV file to import data. The CSV should have the following columns: {fields.join(', ')}
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="csv-file" className="text-right">
                            CSV File
                        </Label>
                        <Input
                            id="csv-file"
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            className="col-span-3"
                        />
                    </div>
                    {error && (
                        <p className="text-sm text-red-500">{error}</p>
                    )}
                </div>
                <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setIsOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleImport} disabled={!file}>
                        Import
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}