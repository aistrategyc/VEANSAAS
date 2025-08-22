"use client"

import * as React from "react"
import { Calendar as BaseCalendar } from "react-date-range"
import "react-date-range/dist/styles.css"
import "react-date-range/dist/theme/default.css"

interface CalendarProps {
  mode?: "single" | "range"
  value?: Date | { from?: Date; to?: Date }
  onChange?: (value: Date | { from?: Date; to?: Date }) => void
  numberOfMonths?: number // ✅ добавлено
  className?: string
  disabled?: (date: Date) => boolean
}

export function Calendar({ mode = "single", value, onChange, numberOfMonths = 1, className, disabled }: CalendarProps) {
  const handleChange = (item: any) => {
    if (mode === "range") {
      const range = item.selection
      onChange?.({ from: range.startDate, to: range.endDate })
    } else {
      onChange?.(item)
    }
  }

  const getSelectedRange = () => {
    return {
      startDate: (value as any)?.from || new Date(),
      endDate: (value as any)?.to || (value as any)?.from || new Date(),
      key: "selection",
    }
  }

  return (
    <div className={`rounded-md border shadow-sm p-2 bg-white ${className ?? ""}`}>
      <BaseCalendar
        showDateDisplay={false}
        editableDateInputs={true}
        onChange={handleChange}
        moveRangeOnFirstSelection={false}
        months={numberOfMonths}
        direction="horizontal"
        rangeColors={["#3b82f6"]}
        minDate={new Date(2000, 0, 1)}
        maxDate={new Date()}
        disabledDates={
          disabled
            ? Array.from({ length: 365 * 20 }) // check up to 20 years back
                .map((_, i) => {
                  const d = new Date()
                  d.setDate(d.getDate() - i)
                  return disabled(d) ? d : undefined
                })
                .filter(Boolean)
            : undefined
        }
        {...(mode === "range"
          ? {
              ranges: [
                {
                  ...getSelectedRange(),
                  color: "#3b82f6",
                },
              ],
            }
          : {
              date: value instanceof Date ? value : new Date(),
            })}
      />
    </div>
  )
}