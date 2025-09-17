import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function EmptyState({ title, description, action, icon, className }) {
	return (
		<Card className={cn('border-dashed', className)}>
			<CardContent className='flex flex-col items-center justify-center py-12 px-6 text-center'>
				{icon && <div className='mb-4 text-muted-foreground'>{icon}</div>}
				<h3 className='text-lg font-semibold text-foreground mb-2'>{title}</h3>
				<p className='text-sm text-muted-foreground mb-6 max-w-sm'>
					{description}
				</p>
				{action && (
					<Button onClick={action.onClick} className='mt-2'>
						{action.label}
					</Button>
				)}
			</CardContent>
		</Card>
	)
}
