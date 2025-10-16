import { useState, useCallback } from 'react'

const useToast = () => {
  const [toasts, setToasts] = useState([])

  const toast = useCallback(({ title, description, variant = 'default', duration = 5000 }) => {
    const id = Math.random().toString(36).substr(2, 9)
    
    const newToast = {
      id,
      title,
      description,
      variant,
      duration
    }

    setToasts(prev => [...prev, newToast])

    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id))
      }, duration)
    }

    return {
      id,
      dismiss: () => setToasts(prev => prev.filter(t => t.id !== id))
    }
  }, [])

  const dismiss = useCallback((toastId) => {
    setToasts(prev => prev.filter(t => t.id !== toastId))
  }, [])

  return {
    toast,
    dismiss,
    toasts
  }
}

export { useToast }
