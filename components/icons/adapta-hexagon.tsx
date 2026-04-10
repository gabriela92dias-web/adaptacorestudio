import React from "react"
import { cn } from "../../components/ui/utils"

export function AdaptaHexagon({ className, ...props }: React.SVGProps<SVGSVGElement>) {
  // Path do "Fundo" extraído da SampleLogo da marca Adapta - Hexágono Original
  const FUNDO_PATH = "M263.76,74.72v130.91c0,3.33-1.77,6.41-4.65,8.09l-112.39,65.37c-2.91,1.69-6.5,1.69-9.41,0L24.97,213.73c-2.88-1.68-4.65-4.76-4.65-8.09V74.74c0-3.33,1.77-6.41,4.65-8.09L137.36,1.27c2.91-1.69,6.5-1.69,9.41,0l112.33,65.36c2.88,1.68,4.65,4.76,4.65,8.09Z";

  return (
    <svg
      viewBox="0 0 263.76 280.36"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-6 h-6", className)}
      {...props}
    >
      <path d={FUNDO_PATH} />
    </svg>
  );
}
