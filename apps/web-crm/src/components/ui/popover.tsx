// src/components/ui/popover.tsx
"use client";

import * as PopoverPrimitive from '@radix-ui/react-popover';
import { ReactNode } from 'react';

interface PopoverContentProps extends PopoverPrimitive.PopoverContentProps {
  children: ReactNode;
}

export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;

export function PopoverContent({ children, className, sideOffset = 4, ...props }: PopoverContentProps) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        sideOffset={sideOffset}
        className={`bg-white rounded-md p-4 shadow-lg ${className || ''}`}
        {...props}
      >
        {children}
        <PopoverPrimitive.Arrow className="fill-white" />
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  );
}
