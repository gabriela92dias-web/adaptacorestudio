import { ReactNode } from "react"
import { Hexagon } from "lucide-react"
import { cn } from "./utils"

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  description?: string
  action?: ReactNode
  className?: string
  withHexagon?: boolean
}

export function EmptyState({ 
  icon, 
  title, 
  description, 
  action, 
  className,
  withHexagon = true
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500", className)}>
      <div className="relative flex items-center justify-center w-24 h-24 mb-6">
        {withHexagon && (
          <Hexagon 
            className="absolute w-full h-full text-primary/10" 
            strokeWidth={1}
            style={{ transform: "rotate(-90deg)" }} // Pointing up
          />
        )}
        <div className="z-10 text-primary">
          {icon}
        </div>
      </div>
      
      <h3 className="text-xl font-semibold tracking-tight text-foreground mb-2">
        {title}
      </h3>
      
      {description && (
        <p className="text-muted-foreground text-sm max-w-sm mb-6">
          {description}
        </p>
      )}
      
      {action && (
        <div className="mt-2">
          {action}
        </div>
      )}
    </div>
  )
}
