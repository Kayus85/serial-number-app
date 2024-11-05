'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"

type Entry = {
  id: string;
  cost: number;
  date: string;
  processed: boolean;
}

export default function EntryManagement() {
  const [entries, setEntries] = useState<Entry[]>([])

  useEffect(() => {
    // Simulating data fetch from an external API
    const fetchData = async () => {
      const response = await fetch('https://api.example.com/entries')
      const data = await response.json()
      setEntries(data)
    }

    fetchData()
  }, [])

  const handleCheckboxChange = (id: string) => {
    setEntries(entries.map(entry => 
      entry.id === id ? { ...entry, processed: !entry.processed } : entry
    ))
  }

  const handleCostChange = (id: string, value: string) => {
    setEntries(entries.map(entry => 
      entry.id === id ? { ...entry, cost: parseFloat(value) || 0 } : entry
    ))
  }

  const handleDateChange = (id: string, value: string) => {
    setEntries(entries.map(entry => 
      entry.id === id ? { ...entry, date: value } : entry
    ))
  }

  const unprocessedEntries = entries.filter(entry => !entry.processed)
  const processedEntries = entries.filter(entry => entry.processed)

  const EntryTable = ({ entries }: { entries: Entry[] }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Cost ($)</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Processed</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {entries.map(entry => (
          <TableRow key={entry.id}>
            <TableCell>{entry.id}</TableCell>
            <TableCell>
              <Input 
                type="number" 
                value={entry.cost} 
                onChange={(e) => handleCostChange(entry.id, e.target.value)}
                className="w-24"
              />
            </TableCell>
            <TableCell>
              <Input 
                type="date" 
                value={entry.date} 
                onChange={(e) => handleDateChange(entry.id, e.target.value)}
              />
            </TableCell>
            <TableCell>
              <Checkbox 
                checked={entry.processed} 
                onCheckedChange={() => handleCheckboxChange(entry.id)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  return (
    <div className="container mx-auto p-4">
      <Tabs defaultValue="unprocessed">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="unprocessed">Unprocessed</TabsTrigger>
          <TabsTrigger value="processed">Processed</TabsTrigger>
        </TabsList>
        <TabsContent value="unprocessed">
          <h2 className="text-2xl font-bold mb-4">Unprocessed Entries</h2>
          <EntryTable entries={unprocessedEntries} />
        </TabsContent>
        <TabsContent value="processed">
          <h2 className="text-2xl font-bold mb-4">Processed Entries</h2>
          <EntryTable entries={processedEntries} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
