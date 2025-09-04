import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'
import { StaffItem } from './StaffItem'

export const StaffList = ({ staffs }) => {
	return (
		<Card className='bg-card border-border'>
			<CardHeader>
				<CardTitle className='text-card-foreground'>
					Список сотрудников
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='space-y-4'>
					{staffs.map(staff => (
						<StaffItem
							key={staff.id}
							id={staff.id}
							name={staff.name}
							phone={staff.phone}
							email={staff.email}
							rating={staff.rating}
							experience={staff.experience}
							monthRevenue={staff.monthRevenue}
							todayAppointments={staff.todayAppointments}
							status={staff.status}
							clientSatisfaction={staff.clientSatisfaction}
							workingHours={staff.workingHours}
							nextBreak={staff.nextBreak}
							certificates={staff.certificates}
							specializations={staff.specializations}
						/>
					))}
				</div>
			</CardContent>
		</Card>
	)
}
