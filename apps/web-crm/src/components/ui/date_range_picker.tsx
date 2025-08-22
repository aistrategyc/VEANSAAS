"use client"

import * as React from "react"
import {
  format,
  isEqual,
  isValid,
  startOfToday,
  subDays,
  subMonths,
  subYears,
  isAfter,
} from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"

export interface DateRange {
  from?: Date
  to?: Date
}

interface DateRangePickerProps {
  value: DateRange
  onChange: (value: DateRange) => void
}

const today = startOfToday()
const yesterday = subDays(today, 1)

const presets: { label: string; range: DateRange }[] = [
  { label: "Вчера", range: { from: yesterday, to: yesterday } },
  { label: "7 дней", range: { from: subDays(yesterday, 6), to: yesterday } },
  { label: "30 дней", range: { from: subDays(yesterday, 29), to: yesterday } },
  { label: "90 дней", range: { from: subDays(yesterday, 89), to: yesterday } },
  { label: "Месяц", range: { from: subMonths(yesterday, 1), to: yesterday } },
  { label: "Квартал", range: { from: subMonths(yesterday, 3), to: yesterday } },
  { label: "Год", range: { from: subYears(yesterday, 1), to: yesterday } },
]

function isSameRange(a?: DateRange, b?: DateRange) {
  return a?.from && a?.to && b?.from && b?.to
    ? isEqual(a.from, b.from) && isEqual(a.to, b.to)
    : false
}

export function DateRangePicker({ value, onChange }: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [tempRange, setTempRange] = React.useState<DateRange>(value)

  const label =
    value.from && value.to && isValid(value.from) && isValid(value.to)
      ? `${format(value.from, "dd.MM.yyyy")} – ${format(value.to, "dd.MM.yyyy")}`
      : "Выбрать период"

  const activePreset = presets.find((p) => isSameRange(p.range, value))

  const handleSelect = (range?: DateRange) => {
    if (range?.from && range?.to && isValid(range.from) && isValid(range.to)) {
      // Обрезаем выбор на будущее
      const toDate = isAfter(range.to, yesterday) ? yesterday : range.to
      const fromDate = isAfter(range.from, toDate) ? toDate : range.from

      const finalRange = { from: fromDate, to: toDate }
      setTempRange(finalRange)
      onChange(finalRange)
      setOpen(false)
    } else {
      setTempRange(range || {})
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[260px] justify-start text-left font-normal">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4 space-y-4" align="end">
        <div className="grid grid-cols-2 gap-2">
          {presets.map((preset) => (
            <Button
              key={preset.label}
              variant={activePreset?.label === preset.label ? "default" : "ghost"}
              className="justify-start"
              onClick={() => {
                onChange(preset.range)
                setTempRange(preset.range)
                setOpen(false)
              }}
            >
              {preset.label}
            </Button>
          ))}
        </div>
        <Calendar
          mode="range"
          value={tempRange}
          onChange={handleSelect as (value: Date | { from?: Date; to?: Date }) => void}
          numberOfMonths={2}
          className="rounded-md border"
          disabled={(date) => isAfter(date, yesterday)}
        />
      </PopoverContent>
    </Popover>
  )
}