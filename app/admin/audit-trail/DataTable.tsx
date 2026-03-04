"use client"

import { useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Ellipsis } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function DataTable({ data }: {
  data: {
    timestamp: string;
    operation: string;
    document: string;
    actor: string;
    ipAddress: string;
    details: string;
  }[]
}) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredData: {
    timestamp: string;
    operation: string;
    document: string;
    actor: string;
    ipAddress: string;
    details: string;
  }[] = [
      {
        timestamp: "2026-02-21 09:15:32",
        operation: "Location changed",
        document: "Community Engagement - Maria Santos",
        actor: "Alhea Sarona (Admin)",
        ipAddress: "192.168.1.45",
        details: "Document moved from Archive Room A to Archive Room B"
      }
    ]

  //
  // const filteredData = useMemo(() => {
  //   const today = new Date()
  //
  //   return data.filter((d) => {
  //     const q = search.toLowerCase()
  //     const searchMatch =
  //       d.subject.toLowerCase().includes(q) ||
  //       d.documentType.toLowerCase().includes(q) ||
  //       d.location.toLowerCase().includes(q)
  //
  //     const exp = new Date(d.expirationDate)
  //     const isExpired = exp < today
  //
  //     const computedStatus = isExpired ? "expired" : d.status.toLowerCase()
  //
  //     const statusMatch =
  //       statusFilter === "all" || computedStatus === statusFilter
  //
  //     return searchMatch && statusMatch
  //   })
  // }, [data, search, statusFilter])
  return (
    <>
      <Card className="mb-4">
        <CardContent>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <Input
              placeholder="Search subject, document type, location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="md:max-w-sm"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-45">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All operations</SelectItem>
                <SelectItem value="modified">Document modified</SelectItem>
                <SelectItem value="borrowed">Document borrowed</SelectItem>
                <SelectItem value="restored">Document restored</SelectItem>
                <SelectItem value="updated">Document updated</SelectItem>
                <SelectItem value="backup">Backup created</SelectItem>
                <SelectItem value="statusChanged">Status changed</SelectItem>
                <SelectItem value="locationChanged">Location changed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      <Card className="mb-4">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Operation</TableHead>
                <TableHead>Document</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((d, i) => (
                <TableRow key={i}>
                  <TableCell>{d.timestamp}</TableCell>
                  <TableCell>{d.operation}</TableCell>
                  <TableCell>{d.document}</TableCell>
                  <TableCell>{d.actor}</TableCell>
                  <TableCell>{d.ipAddress}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  )
}

