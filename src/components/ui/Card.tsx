import { type HTMLAttributes, forwardRef } from "react"
import { clsx } from "clsx"

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export const Card = forwardRef<HTMLDivElement, CardProps>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={clsx("bg-white rounded-xl border border-gray-200 shadow-md", className)} {...props}>
      {children}
    </div>
  )
})

Card.displayName = "Card"

export const CardHeader = forwardRef<HTMLDivElement, CardProps>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={clsx("p-6 border-b border-gray-200", className)} {...props}>
      {children}
    </div>
  )
})

CardHeader.displayName = "CardHeader"

export const CardContent = forwardRef<HTMLDivElement, CardProps>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={clsx("p-6", className)} {...props}>
      {children}
    </div>
  )
})

CardContent.displayName = "CardContent"
