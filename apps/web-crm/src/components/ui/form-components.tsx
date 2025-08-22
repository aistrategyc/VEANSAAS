"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

// Form Field Wrapper
interface FormFieldProps {
  label?: string
  description?: string
  error?: string
  required?: boolean
  children: React.ReactNode
  className?: string
}

export function FormField({
  label,
  description,
  error,
  required,
  children,
  className
}: FormFieldProps) {
  const id = React.useId()
  const descId = description ? `${id}-desc` : undefined
  const errId = error ? `${id}-err` : undefined
  
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label htmlFor={id} className={cn(required && "after:content-['*'] after:ml-0.5 after:text-red-500")}>
          {label}
        </Label>
      )}
      {description && (
        <p id={descId} className="text-sm text-muted-foreground">{description}</p>
      )}
      {React.isValidElement(children)
        ? React.cloneElement(children as React.ReactElement<any>, {
            id,
            'aria-invalid': !!error,
            'aria-describedby': [descId, errId].filter(Boolean).join(' ') || undefined,
          } as any)
        : children}
      {error && (
        <p id={errId} className="text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}

// Multi-step Form
interface FormStepProps {
  title: string
  description?: string
  children: React.ReactNode
}

export function FormStep({ title, description, children }: FormStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {children}
    </div>
  )
}

interface MultiStepFormProps {
  steps: FormStepProps[]
  currentStep: number
  onStepChange: (step: number) => void
  className?: string
}

export function MultiStepForm({
  steps,
  currentStep,
  onStepChange,
  className
}: MultiStepFormProps) {
  return (
    <div className={cn("space-y-8", className)}>
      {/* Step Indicator */}
      <div className="flex items-center justify-between">
        {steps.map((_, index) => (
          <React.Fragment key={index}>
            <div
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-medium transition-colors",
                index < currentStep
                  ? "bg-primary border-primary text-primary-foreground"
                  : index === currentStep
                  ? "border-primary text-primary"
                  : "border-muted text-muted-foreground"
              )}
            >
              {index + 1}
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-4",
                  index < currentStep ? "bg-primary" : "bg-muted"
                )}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Current Step Content */}
      <FormStep {...steps[currentStep]} />
    </div>
  )
}
