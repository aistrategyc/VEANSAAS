import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Edit, Eye } from 'lucide-react'

export const LoyaltyProgramItem = ({
	id,
	name,
	type,
	description,
	members,
	discount,
	activeMembers,
	totalRevenue,
	minSpend,
}) => {
	return (
		<Card className='bg-muted/20 border-border hover:border-primary/20 transition-all duration-300 hover:scale-[1.02]'>
			<CardHeader>
				<div className='flex items-center justify-between'>
					<CardTitle className='text-lg text-card-foreground'>{name}</CardTitle>
					<Badge variant='default'>{type}</Badge>
				</div>
				<p className='text-sm text-muted-foreground'>{description}</p>
			</CardHeader>
			<CardContent className='space-y-4'>
				<div className='grid grid-cols-2 gap-4'>
					<div className='text-center p-2 rounded-lg bg-background/50'>
						<p className='font-bold text-foreground'>{members}</p>
						<p className='text-xs text-muted-foreground'>Участников</p>
					</div>
					<div className='text-center p-2 rounded-lg bg-background/50'>
						<p className='font-bold text-foreground'>{discount}</p>
						<p className='text-xs text-muted-foreground'>Скидка</p>
					</div>
				</div>
				<div className='space-y-2'>
					<div className='flex justify-between'>
						<span className='text-sm text-muted-foreground'>Активные:</span>
						<span className='text-sm font-medium text-foreground'>
							{activeMembers}
						</span>
					</div>
					<div className='flex justify-between'>
						<span className='text-sm text-muted-foreground'>Выручка:</span>
						<span className='text-sm font-medium text-foreground'>
							{totalRevenue}
						</span>
					</div>
					<div className='flex justify-between'>
						<span className='text-sm text-muted-foreground'>Мин. сумма:</span>
						<span className='text-sm font-medium text-foreground'>
							{minSpend}
						</span>
					</div>
				</div>
				<div className='flex items-center gap-2 pt-2'>
					<Button size='sm' variant='ghost' className='hover:bg-primary/10'>
						<Eye className='h-4 w-4' />
					</Button>
					<Button size='sm' variant='ghost' className='hover:bg-primary/10'>
						<Edit className='h-4 w-4' />
					</Button>
				</div>
			</CardContent>
		</Card>
	)
}
