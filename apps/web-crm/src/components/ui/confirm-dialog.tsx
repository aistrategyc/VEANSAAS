"use client"

import * as React from "react"
import { AlertTriangle, Info, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
} from "./modal"

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void | Promise<void>
  title: string
  description: string
  confirmText?: string
  cancelText?: string
  variant?: "default" | "destructive" | "warning" | "info"
  loading?: boolean
  showIcon?: boolean
}

const variantConfig = {
  default: {
    icon: CheckCircle,
    iconColor: "text-blue-500",
    confirmVariant: "default" as const
  },
  destructive: {
    icon: XCircle,
    iconColor: "text-red-500",
    confirmVariant: "destructive" as const
  },
  warning: {
    icon: AlertTriangle,
    iconColor: "text-yellow-500",
    confirmVariant: "default" as const
  },
  info: {
    icon: Info,
    iconColor: "text-blue-500",
    confirmVariant: "default" as const
  }
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  loading = false,
  showIcon = true
}: ConfirmDialogProps) {
  const [isConfirming, setIsConfirming] = React.useState(false)
  const config = variantConfig[variant]
  const Icon = config.icon

  const handleConfirm = async () => {
    try {
      setIsConfirming(true)
      await onConfirm()
      onClose()
    } catch (error) {
      console.error("Confirmation action failed:", error)
    } finally {
      setIsConfirming(false)
    }
  }

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent size="sm">
        <ModalHeader>
          <div className="flex items-center space-x-3">
            {showIcon && (
              <div className={`flex-shrink-0 ${config.iconColor}`}>
                <Icon className="h-6 w-6" />
              </div>
            )}
            <div>
              <ModalTitle>{title}</ModalTitle>
              <ModalDescription className="mt-2">
                {description}
              </ModalDescription>
            </div>
          </div>
        </ModalHeader>
        <ModalFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isConfirming || loading}
          >
            {cancelText}
          </Button>
          <Button
            variant={config.confirmVariant}
            onClick={handleConfirm}
            disabled={isConfirming || loading}
          >
            {isConfirming || loading ? "Loading..." : confirmText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

// Preset Confirm Dialogs
interface DeleteConfirmProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void | Promise<void>
  itemName?: string
  loading?: boolean
}

export function DeleteConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  itemName = "this item",
  loading = false
}: DeleteConfirmProps) {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete Item"
      description={`Are you sure you want to delete ${itemName}? This action cannot be undone.`}
      confirmText="Delete"
      cancelText="Cancel"
      variant="destructive"
      loading={loading}
    />
  )
}

export function LogoutConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  loading = false
}: Omit<DeleteConfirmProps, "itemName">) {
  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Sign Out"
      description="Are you sure you want to sign out of your account?"
      confirmText="Sign Out"
      cancelText="Cancel"
      variant="warning"
      loading={loading}
    />
  )
}
