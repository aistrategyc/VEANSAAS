import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	Award,
	Clock,
	Edit,
	Eye,
	Mail,
	Phone,
	Star,
	Trash2,
} from 'lucide-react'

export const StaffItem = ({
	name,
	role,
	phone,
	email,
	rating,
	experience,
	monthRevenue,
	todayAppointments,
	status,
	clientSatisfaction,
	workingHours,
	nextBreak,
	certificates = [],
	specializations = [],
}) => {
	return (
		<div className='flex items-center flex-wrap justify-between p-4 rounded-lg bg-muted/20 hover:bg-muted/30 transition-all duration-200 hover:shadow-md'>
			<div className='flex flex-wrap items-center gap-4'>
				<Avatar className='hover:scale-105 transition-transform'>
					<AvatarFallback>
						{name
							.split(' ')
							.map(n => n[0])
							.join('')}
					</AvatarFallback>
				</Avatar>
				<div>
					<p className='font-medium text-foreground'>{name}</p>
					<p className='text-sm text-muted-foreground'>{role}</p>
					<div className='flex flex-wrap items-center gap-4 text-xs text-muted-foreground mt-1'>
						<div className='flex items-center gap-1'>
							<Phone className='h-3 w-3' />
							{phone}
						</div>
						<div className='flex items-center gap-1'>
							<Mail className='h-3 w-3' />
							{email}
						</div>
					</div>
					<div className='mt-2 space-y-1'>
						<div className='flex items-center gap-1 text-xs text-muted-foreground'>
							<Clock className='h-3 w-3' />
							{workingHours} | Перерыв: {nextBreak}
						</div>
						<div className='flex items-center gap-1 text-xs text-muted-foreground'>
							<Award className='h-3 w-3' />
							{certificates.join(', ')}
						</div>
						<p className='text-xs text-muted-foreground'>
							Специализации: {specializations.join(', ')}
						</p>
					</div>
				</div>
			</div>
			<div className='flex flex-wrap items-center gap-6 max-md:mt-3 '>
				<div className='text-center'>
					<div className='flex items-center gap-1'>
						<Star className='h-3 w-3 text-yellow-500 fill-current' />
						<span className='font-medium text-foreground'>{rating}</span>
					</div>
					<p className='text-xs text-muted-foreground'>Рейтинг</p>
				</div>
				<div className='text-center'>
					<p className='font-medium text-foreground'>{experience}</p>
					<p className='text-xs text-muted-foreground'>Опыт</p>
				</div>
				<div className='text-center'>
					<p className='font-medium text-foreground'>{todayAppointments}</p>
					<p className='text-xs text-muted-foreground'>Записей сегодня</p>
				</div>
				<div className='text-center'>
					<p className='font-medium text-foreground'>{monthRevenue}</p>
					<p className='text-xs text-muted-foreground'>Выручка за месяц</p>
				</div>
				<div className='text-center'>
					<p className='font-medium text-foreground'>{clientSatisfaction}%</p>
					<p className='text-xs text-muted-foreground'>Удовлетворенность</p>
				</div>
				<Badge
					variant={
						status === 'active'
							? 'default'
							: status === 'vacation'
							? 'secondary'
							: 'outline'
					}
					className='hover:scale-105 transition-transform'
				>
					{status === 'active'
						? 'Активен'
						: status === 'vacation'
						? 'В отпуске'
						: 'Неактивен'}
				</Badge>
				<div className='flex items-center gap-1'>
					<Button
						size='sm'
						variant='ghost'
						className='hover:bg-primary/10 hover:text-primary transition-colors'
					>
						<Eye className='h-4 w-4' />
					</Button>
					<Button
						size='sm'
						variant='ghost'
						className='hover:bg-primary/10 hover:text-primary transition-colors'
					>
						<Edit className='h-4 w-4' />
					</Button>
					<Button
						size='sm'
						variant='ghost'
						className='hover:bg-destructive/10 hover:text-destructive transition-colors'
					>
						<Trash2 className='h-4 w-4' />
					</Button>
				</div>
			</div>
		</div>
	)
}
