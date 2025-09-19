import { Card, CardContent } from '@/components/ui/card'
import { Shield } from 'lucide-react'
import { cn } from '@/lib/utils'

export function NoAccessState({
	title = 'Доступ ограничен',
	description = 'У вас нет прав для просмотра этого раздела. Обратитесь к администратору.',
	className,
}) {
	return (
		<Card className={cn('border-muted', className)}>
			<CardContent className='flex flex-col items-center justify-center py-12 px-6 text-center'>
				<Shield className='h-12 w-12 text-muted-foreground mb-4' />
				<h3 className='text-lg font-semibold text-foreground mb-2'>{title}</h3>
				<p className='text-sm text-muted-foreground max-w-sm'>{description}</p>
			</CardContent>
		</Card>
	)
}
