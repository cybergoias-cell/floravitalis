import { Loader2 } from 'lucide-react'

const LoadingSpinner = ({ size = 'default', text = 'Carregando...' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    default: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <Loader2 className={`animate-spin text-primary ${sizeClasses[size]}`} />
      {text && (
        <p className="mt-2 text-sm text-muted-foreground">{text}</p>
      )}
    </div>
  )
}

export default LoadingSpinner
