import { Layers } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

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

  const label = current && total ? `Parcela ${current}/${total}` : 'Despesa Parcelada'

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={cn(
            'flex items-center justify-center shrink-0 w-5 h-5 rounded-full bg-blue-500/15 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 cursor-help',
            className,
          )}
        >
          <Layers className="w-3 h-3" />
        </div>
      </TooltipTrigger>
      <TooltipContent side="top" className="text-xs font-medium">
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  )
}
