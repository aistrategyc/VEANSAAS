import React from 'react'
import { AppointmentsItem } from './AppointmentsItem'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const AppointmentsList = ({ appointments }) => {
	return (
		<Card className='bg-card border-border'>
			<CardHeader>
				<CardTitle className='text-card-foreground'>Список записей</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='space-y-4'>
					{appointments.map(appointment => (
						<AppointmentsItem
							key={appointment.id}
							id={appointment.id}
							name={appointment.name}
							phone={appointment.phone}
							email={appointment.email}
							status={appointment.status}
							services={appointment.services}
							notes={appointment.notes}
							prepaid={appointment.prepaid}
							time={appointment.time}
							service={appointment.service}
							price={appointment.price}
							master={appointment.master}
							duration={appointment.duration}
							date={appointment.date}
							client={appointment.client}
						/>
					))}
				</div>
			</CardContent>
		</Card>
	)
}
