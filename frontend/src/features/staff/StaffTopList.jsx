import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Edit, Eye, Star, UserCheck } from 'lucide-react'
import React from 'react'

export const StaffTopList = ({ staffList }) => {
	return (
		<Card className='bg-card border-border hover:border-primary/20 transition-all duration-300'>
			<CardHeader className='flex flex-row items-center justify-between'>
				<CardTitle className='text-card-foreground flex items-center gap-2'>
					<UserCheck className='h-5 w-5 text-primary' />
					Лучшие мастера
				</CardTitle>
				<Button
					size='sm'
					variant='ghost'
					className='text-primary hover:text-primary/80'
				>
					Все мастера
				</Button>
			</CardHeader>
			<CardContent>
				<div className='space-y-3'>
					{staffList.map((master, index) => (
						<div
							key={index}
							className='flex items-center justify-between p-3 rounded-lg hover:bg-muted/20 transition-all duration-200 group'
						>
							<div className='flex items-center gap-3'>
								<div
									className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
										master.position === 1
											? 'bg-yellow-500 text-black'
											: master.position === 2
											? 'bg-gray-400 text-white'
											: master.position === 3
											? 'bg-orange-500 text-white'
											: 'bg-muted text-muted-foreground'
									}`}
								>
									{master.position}
								</div>
								<div>
									<p className='font-medium text-foreground group-hover:text-primary transition-colors'>
										{master.name}
									</p>
									<div className='flex items-center gap-2'>
										<Star className='h-3 w-3 text-yellow-500 fill-current' />
										<span className='text-sm text-muted-foreground'>
											{master.rating}
										</span>
										<span className='text-sm text-muted-foreground'>
											• {master.bookings} записей
										</span>
									</div>
									<div className='text-xs text-muted-foreground mt-1'>
										<span>{master.specialty}</span>
										<span className='ml-2'>• Опыт: {master.experience}</span>
									</div>
								</div>
							</div>
							<div className='text-right flex items-center gap-2'>
								<div>
									<p className='font-medium text-foreground'>
										{master.revenue}
									</p>
								</div>
								<div className='flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
									<Button
										size='sm'
										variant='ghost'
										className='h-8 w-8 p-0 hover:bg-primary/10'
									>
										<Eye className='h-3 w-3' />
									</Button>
									<Button
										size='sm'
										variant='ghost'
										className='h-8 w-8 p-0 hover:bg-primary/10'
									>
										<Edit className='h-3 w-3' />
									</Button>
								</div>
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	)
}
