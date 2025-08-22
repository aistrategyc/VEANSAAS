"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const Accordion = AccordionPrimitive.Root

const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b", className)}
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName

// Advanced Accordion with icons and badges
interface AccordionSection {
  id: string
  title: string
  icon?: React.ReactNode
  badge?: string | number
  content: React.ReactNode
  disabled?: boolean
}

// Discriminated union to match Radix types strictly
interface BaseAdvancedAccordionProps {
  sections: AccordionSection[]
  className?: string
}

interface SingleAccordionProps extends BaseAdvancedAccordionProps {
  type?: "single"
  defaultValue?: string
}

interface MultipleAccordionProps extends BaseAdvancedAccordionProps {
  type: "multiple"
  defaultValue?: string[]
}

export type AdvancedAccordionProps = SingleAccordionProps | MultipleAccordionProps

export function AdvancedAccordion(props: AdvancedAccordionProps) {
  const { sections, className } = props

  if (props.type === "multiple") {
    // Multiple: defaultValue must be string[] | undefined
    return (
      <Accordion type="multiple" defaultValue={props.defaultValue} className={cn("w-full", className)}>
        {sections.map((section) => (
          <AccordionItem key={section.id} value={section.id} disabled={section.disabled}>
            <AccordionTrigger className="text-left">
              <div className="flex items-center space-x-3">
                {section.icon && <div className="text-muted-foreground">{section.icon}</div>}
                <span>{section.title}</span>
                {section.badge && (
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                    {section.badge}
                  </span>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent>{section.content}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    )
  }

  // Single (default): defaultValue must be string | undefined
  return (
    <Accordion type="single" defaultValue={props.defaultValue} className={cn("w-full", className)}>
      {sections.map((section) => (
        <AccordionItem key={section.id} value={section.id} disabled={section.disabled}>
          <AccordionTrigger className="text-left">
            <div className="flex items-center space-x-3">
              {section.icon && <div className="text-muted-foreground">{section.icon}</div>}
              <span>{section.title}</span>
              {section.badge && (
                <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                  {section.badge}
                </span>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent>{section.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}

export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
}