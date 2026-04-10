import { cn } from "./ui/utils"
import { Hexagon } from "lucide-react"

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  withHexagon?: boolean;
}

function Skeleton({
  className,
  withHexagon = false,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted/60 relative overflow-hidden flex items-center justify-center", className)}
      {...props}
    >
      {withHexagon && (
        <Hexagon
          className="absolute text-primary/10 w-8 h-8 md:w-12 md:h-12"
          strokeWidth={1}
          style={{ transform: "rotate(-90deg)" }} // Pointing up
        />
      )}
    </div>
  )
}
 
export { Skeleton }