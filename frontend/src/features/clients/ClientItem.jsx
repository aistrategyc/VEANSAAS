import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Edit, Eye, Mail, Phone, Trash2 } from 'lucide-react'
export const ClientItem = ({
	name,
	phone,
	email,
	totalVisits = null,
	totalSpent = null,
	lastVisit = null,
	status,
	services,
	notes,
}) => {
	return (
		<div className='flex items-center justify-between flex-wrap p-4 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors'>
			<div className='flex items-center flex-wrap gap-4'>
				<Avatar>
					<AvatarFallback>
						{name
							.split(' ')
							.map(n => n[0])
							.join('')}
					</AvatarFallback>
				</Avatar>
				<div>
					<p className='font-medium text-foreground'>{name}</p>
					<div className='flex items-center gap-4 text-sm text-muted-foreground flex-wrap'>
						<div className='flex items-center gap-1'>
							<Phone className='h-3 w-3' />
							{phone}
						</div>
						<div className='flex items-center gap-1'>
							<Mail className='h-3 w-3' />
							{email}
						</div>
					</div>
					<div className='mt-1'>
						<p className='text-xs text-muted-foreground'>
							Услуги: {services.join(', ')}
						</p>
						{notes && (
							<p className='text-xs text-muted-foreground italic'>{notes}</p>
						)}
					</div>
				</div>
			</div>
			<div className='flex items-center gap-6 flex-wrap max-md:mt-3'>
				<div className='text-center'>
					<p className='font-medium text-foreground'>{totalVisits}</p>
					<p className='text-xs text-muted-foreground'>Визитов</p>
				</div>
				<div className='text-center'>
					<p className='font-medium text-foreground'>{totalSpent}</p>
					<p className='text-xs text-muted-foreground'>Потрачено</p>
				</div>
				<div className='text-center'>
					<p className='font-medium text-foreground'>{lastVisit}</p>
					<p className='text-xs text-muted-foreground'>Последний визит</p>
				</div>
				<Badge
					variant={
						status === 'vip'
							? 'default'
							: status === 'regular'
							? 'secondary'
							: status === 'new'
							? 'outline'
							: 'destructive'
					}
				>
					{status === 'vip'
						? 'VIP'
						: status === 'regular'
						? 'Постоянный'
						: status === 'new'
						? 'Новый'
						: 'Неактивный'}
				</Badge>
				<div className='flex items-center gap-1'>
					<Button size='sm' variant='ghost'>
						<Eye className='h-4 w-4' />
					</Button>
					<Button size='sm' variant='ghost'>
						<Edit className='h-4 w-4' />
					</Button>
					<Button size='sm' variant='ghost'>
						<Trash2 className='h-4 w-4' />
					</Button>
				</div>
			</div>
		</div>
	)
}
