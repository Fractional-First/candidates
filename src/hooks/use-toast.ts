import { toast as sonnerToast } from "sonner"
import * as React from "react"

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  variant?: "default" | "destructive"
  duration?: number
}

const toastStore = {
  toasts: [] as ToasterToast[],
  listeners: new Set<() => void>(),
  addToast: (toast: ToasterToast) => {
    const { toasts } = toastStore
    const id = Math.random().toString(36).substring(2, 9)
    toastStore.toasts = [...toasts, { ...toast, id }].slice(0, TOAST_LIMIT)

    toastStore.listeners.forEach((listener) => listener())

    return id
  },
  removeToast: (id: string) => {
    const { toasts } = toastStore
    toastStore.toasts = toasts.filter((t) => t.id !== id)
    toastStore.listeners.forEach((listener) => listener())
  },
  updateToast: (id: string, toast: Partial<ToasterToast>) => {
    const { toasts } = toastStore
    toastStore.toasts = toasts.map((t) =>
      t.id === id ? { ...t, ...toast } : t
    )
    toastStore.listeners.forEach((listener) => listener())
  },
  useToast: () => {
    const [state, setState] = React.useState(toastStore.toasts)

    React.useEffect(() => {
      const listener = () => setState([...toastStore.toasts])
      toastStore.listeners.add(listener)
      return () => {
        toastStore.listeners.delete(listener)
      }
    }, [])

    return {
      toasts: state,
      toast: (data: Omit<ToasterToast, "id">) => {
        sonnerToast((data.title as string) || "", {
          description: data.description,
          duration: data.duration,
        })
        return toastStore.addToast({ ...data } as ToasterToast)
      },
    }
  },
}

export const useToast = toastStore.useToast

export type ToastProps = Omit<ToasterToast, "id">

export function toast(props: ToastProps) {
  // Use the Sonner toast directly for simpler integration
  const { title, description, ...rest } = props
  return sonnerToast((title as string) || "", {
    description: description,
    ...rest,
  })
}
