import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Edit, Mail, Phone, User } from 'lucide-react'

export const ClientInfoCard = ({ clientData }) => {
	return (
		<div className='lg:col-span-1'>
			<Card className='crypto-card'>
				<CardHeader className='text-center pb-4'>
					<div className='flex justify-center mb-4'>
						<Avatar className='h-20 w-20'>
							<AvatarImage
								src={clientData.avatar || '/placeholder.svg'}
								alt={clientData.name}
							/>
							<AvatarFallback className='text-lg'>
								{clientData.name
									.split(' ')
									.map(n => n[0])
									.join('')}
							</AvatarFallback>
						</Avatar>
					</div>
					<CardTitle className='text-xl'>{clientData.name}</CardTitle>
					<div className='flex justify-center'>
						<Badge variant='secondary' className='bg-primary/20 text-primary'>
							{clientData.status}
						</Badge>
					</div>
				</CardHeader>
				<CardContent className='space-y-4'>
					<div className='space-y-3'>
						<div className='flex items-center gap-3 text-sm'>
							<Mail className='h-4 w-4 text-muted-foreground' />
							<span className='text-card-foreground'>{clientData.email}</span>
						</div>
						<div className='flex items-center gap-3 text-sm'>
							<Phone className='h-4 w-4 text-muted-foreground' />
							<span className='text-card-foreground'>{clientData.phone}</span>
						</div>
						<div className='flex items-center gap-3 text-sm'>
							<User className='h-4 w-4 text-muted-foreground' />
							<span className='text-card-foreground'>
								Клиент с{' '}
								{new Date(clientData.joinDate).toLocaleDateString('ru-RU')}
							</span>
						</div>
					</div>

					<Separator />

					<div className='grid grid-cols-2 gap-4 text-center'>
						<div>
							<div className='text-2xl font-bold text-primary'>
								{clientData.totalVisits}
							</div>
							<div className='text-xs text-muted-foreground'>Визитов</div>
						</div>
						<div>
							<div className='text-2xl font-bold text-secondary'>
								{clientData.totalSpent.toLocaleString('ru-RU')} $
							</div>
							<div className='text-xs text-muted-foreground'>Потрачено</div>
						</div>
					</div>

					<Separator />

					<div>
						<h4 className='font-semibold mb-2 text-card-foreground'>
							Предпочитаемые услуги
						</h4>
						<div className='flex flex-wrap gap-2'>
							{clientData.preferredServices.map((service, index) => (
								<Badge key={index} variant='outline' className='text-xs'>
									{service}
								</Badge>
							))}
						</div>
					</div>

					<Button className='w-full bg-transparent' variant='outline'>
						<Edit className='h-4 w-4 mr-2' />
						Редактировать профиль
					</Button>
				</CardContent>
			</Card>
		</div>
	)
}
