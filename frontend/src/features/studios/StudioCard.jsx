import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
	Building2,
	Edit,
	Eye,
	MapPin,
	Phone,
	Trash2,
	Users,
} from 'lucide-react'
export const StudioCard = ({
	name,
	id,
	services,
	status,
	address,
	phone,
	manager,
	staff,
	rooms,
	todayRevenue,
	monthRevenue,
	occupancy,
}) => {
	return (
		<Card className='bg-card border-border hover:border-primary/20 transition-all duration-300 hover:scale-[1.02]'>
			<CardHeader>
				<div className='flex items-center justify-between'>
					<CardTitle className='text-card-foreground flex items-center gap-2'>
						<Building2 className='h-5 w-5 text-primary' />
						{name}
					</CardTitle>
					<Badge
						variant={status === 'active' ? 'default' : 'secondary'}
						className={
							status === 'maintenance' ? 'bg-yellow-500/20 text-yellow-500' : ''
						}
					>
						{status === 'active' ? 'Активна' : 'Обслуживание'}
					</Badge>
				</div>
			</CardHeader>
			<CardContent className='space-y-4'>
				<div className='grid grid-cols-2 gap-4'>
					<div className='space-y-2'>
						<div className='flex items-center gap-2 text-sm'>
							<MapPin className='h-4 w-4 text-muted-foreground' />
							<span className='text-muted-foreground'>{address}</span>
						</div>
						<div className='flex items-center gap-2 text-sm'>
							<Phone className='h-4 w-4 text-muted-foreground' />
							<span className='text-muted-foreground'>{phone}</span>
						</div>
						<div className='flex items-center gap-2 text-sm'>
							<Users className='h-4 w-4 text-muted-foreground' />
							<span className='text-muted-foreground'>Менеджер: {manager}</span>
						</div>
					</div>
					<div className='space-y-2'>
						<div className='text-center p-2 rounded-lg bg-muted/20'>
							<p className='text-lg font-bold text-foreground'>{staff}</p>
							<p className='text-xs text-muted-foreground'>Сотрудников</p>
						</div>
						<div className='text-center p-2 rounded-lg bg-muted/20'>
							<p className='text-lg font-bold text-foreground'>{rooms}</p>
							<p className='text-xs text-muted-foreground'>Кабинетов</p>
						</div>
					</div>
				</div>

				<div className='grid grid-cols-3 gap-4'>
					<div className='text-center'>
						<p className='font-medium text-foreground'>{todayRevenue}</p>
						<p className='text-xs text-muted-foreground'>Сегодня</p>
					</div>
					<div className='text-center'>
						<p className='font-medium text-foreground'>{monthRevenue}</p>
						<p className='text-xs text-muted-foreground'>За месяц</p>
					</div>
					<div className='text-center'>
						<p className='font-medium text-foreground'>{occupancy}%</p>
						<p className='text-xs text-muted-foreground'>Загрузка</p>
					</div>
				</div>

				<div className='space-y-2'>
					<p className='text-sm font-medium text-foreground'>Услуги:</p>
					<div className='flex flex-wrap gap-2'>
						{services.map((service, index) => (
							<Badge key={index} variant='outline' className='text-xs'>
								{service}
							</Badge>
						))}
					</div>
				</div>

				<div className='flex items-center gap-2 pt-2'>
					<Button size='sm' variant='ghost' className='hover:bg-primary/10'>
						<Eye className='h-4 w-4' />
					</Button>
					<Button size='sm' variant='ghost' className='hover:bg-primary/10'>
						<Edit className='h-4 w-4' />
					</Button>
					<Button size='sm' variant='ghost' className='hover:bg-destructive/10'>
						<Trash2 className='h-4 w-4' />
					</Button>
				</div>
			</CardContent>
		</Card>
	)
}
