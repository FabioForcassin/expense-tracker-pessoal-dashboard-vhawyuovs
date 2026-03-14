import { Layers } from 'lucide-react'
import { cn } from '@/lib/utils'

interface InstallmentBadgeProps {
  isInstallment?: boolean
  current?: number
  total?: number
  className?: string
}

export function InstallmentBadge({
  isInstallment,
  current,
  total,
  className,
}: InstallmentBadgeProps) {
  if (!isInstallment) return null

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground bg-muted border border-border/50 px-1.5 py-0.5 rounded whitespace-nowrap',
        className,
      )}
    >
      <Layers className="w-2.5 h-2.5 opacity-70" />
      {current && total ? `${current}/${total}` : 'Parcela'}
    </span>
  )
}
