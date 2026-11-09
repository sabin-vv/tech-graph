"use client"

import { useEffect, useId, useRef } from "react"
import type { ReactNode } from "react"
import { X } from "lucide-react"
import Button from "./Button"

type ModalSize = "sm" | "md" | "lg"

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: ReactNode
  footer?: ReactNode
  size?: ModalSize
  closeOnBackdrop?: boolean
  showCloseButton?: boolean
  className?: string
}

const sizeStyles: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
}

const Modal = ({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  closeOnBackdrop = true,
  showCloseButton = true,
  className = "",
}: ModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const descriptionId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()

    return () => {
      if (dialog.open) dialog.close()
    }
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onClick={(event) => {
        if (closeOnBackdrop && event.target === event.currentTarget) onClose()
      }}
      className={`bg-surface text-foreground m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] overflow-hidden rounded-xl border border-border p-0 shadow-2xl backdrop:bg-black/60 ${sizeStyles[size]} ${className}`}
    >
      <div className="flex max-h-[calc(100dvh-2rem)] flex-col">
        <header className="border-border flex items-start justify-between gap-4 border-b px-5 py-4">
          <div className="min-w-0">
            <h2 id={titleId} className="text-lg font-semibold">
              {title}
            </h2>
            {description && (
              <p
                id={descriptionId}
                className="text-text-secondary mt-1 text-sm"
              >
                {description}
              </p>
            )}
          </div>
          {showCloseButton && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              aria-label="Close dialog"
              onClick={onClose}
              className="shrink-0 px-2"
            >
              <X size={18} aria-hidden="true" />
            </Button>
          )}
        </header>

        <div className="min-h-0 overflow-y-auto p-5">{children}</div>

        {footer && (
          <footer className="border-border border-t px-5 py-4">{footer}</footer>
        )}
      </div>
    </dialog>
  )
}

export default Modal
