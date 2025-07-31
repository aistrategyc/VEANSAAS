import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowUpDownIcon } from "@heroicons/react/24/outline"

interface Campaign {
  campaign_id: string
  platform: string
  spend: number | null
  clicks: number | null
  ctr: number | null
  cpc: number | null
  cpa: number | null
  conversions: number | null
}

interface AdsByCampaignTableProps {
  data: Campaign[]
  isLoading?: boolean
}

export function AdsByCampaignTable({ data, isLoading }: AdsByCampaignTableProps) {
  const [sortField, setSortField] = useState<keyof Campaign | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  const handleSort = (field: keyof Campaign) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedData = [...data].sort((a, b) => {
    if (!sortField) return 0
    const aValue = a[sortField] ?? 0
    const bValue = b[sortField] ?? 0
    if (aValue === bValue) return 0
    return sortDirection === "asc" ? (aValue < bValue ? -1 : 1) : aValue > bValue ? -1 : 1
  })

  return (
    <div className="overflow-x-auto">
      <Table aria-label="Таблиця кампаній">
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[150px] cursor-pointer" onClick={() => handleSort("campaign_id")}>
              Кампанія
              {sortField === "campaign_id" && <ArrowUpDownIcon className="inline h-4 w-4 ml-1" />}
            </TableHead>
            <TableHead className="min-w-[100px] cursor-pointer" onClick={() => handleSort("platform")}>
              Платформа
              {sortField === "platform" && <ArrowUpDownIcon className="inline h-4 w-4 ml-1" />}
            </TableHead>
            <TableHead className="text-right cursor-pointer" onClick={() => handleSort("spend")}>
              Витрати
              {sortField === "spend" && <ArrowUpDownIcon className="inline h-4 w-4 ml-1" />}
            </TableHead>
            <TableHead className="text-right cursor-pointer" onClick={() => handleSort("clicks")}>
              Кліки
              {sortField === "clicks" && <ArrowUpDownIcon className="inline h-4 w-4 ml-1" />}
            </TableHead>
            <TableHead className="text-right cursor-pointer" onClick={() => handleSort("ctr")}>
              CTR
              {sortField === "ctr" && <ArrowUpDownIcon className="inline h-4 w-4 ml-1" />}
            </TableHead>
            <TableHead className="text-right cursor-pointer" onClick={() => handleSort("cpc")}>
              CPC
              {sortField === "cpc" && <ArrowUpDownIcon className="inline h-4 w-4 ml-1" />}
            </TableHead>
            <TableHead className="text-right cursor-pointer" onClick={() => handleSort("cpa")}>
              CPA
              {sortField === "cpa" && <ArrowUpDownIcon className="inline h-4 w-4 ml-1" />}
            </TableHead>
            <TableHead className="text-right cursor-pointer" onClick={() => handleSort("conversions")}>
              Конверсії
              {sortField === "conversions" && <ArrowUpDownIcon className="inline h-4 w-4 ml-1" />}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            [...Array(3)].map((_, i) => (
              <TableRow key={i}>
                {[...Array(8)].map((_, j) => (
                  <TableCell key={j}>
                    <Skeleton className="h-8 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-muted-foreground">
                Немає даних для відображення
              </TableCell>
            </TableRow>
          ) : (
            sortedData.map((c, index) => (
              <TableRow key={`${c.campaign_id}-${c.platform}-${index}`}>
                <TableCell>{c.campaign_id}</TableCell>
                <TableCell>{c.platform}</TableCell>
                <TableCell className="text-right">
                  {c.spend != null ? c.spend.toLocaleString("uk-UA", { style: "currency", currency: "UAH" }) : "–"}
                </TableCell>
                <TableCell className="text-right">{c.clicks != null ? c.clicks.toLocaleString("uk-UA") : "–"}</TableCell>
                <TableCell className="text-right">{c.ctr != null ? (c.ctr * 100).toFixed(2) + "%" : "–"}</TableCell>
                <TableCell className="text-right">
                  {c.cpc != null ? c.cpc.toLocaleString("uk-UA", { style: "currency", currency: "UAH" }) : "–"}
                </TableCell>
                <TableCell className="text-right">
                  {c.cpa != null ? c.cpa.toLocaleString("uk-UA", { style: "currency", currency: "UAH" }) : "–"}
                </TableCell>
                <TableCell className="text-right">{c.conversions != null ? c.conversions.toLocaleString("uk-UA") : "–"}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}