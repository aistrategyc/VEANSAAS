import React from 'react'
import { StudioCard } from './StudioCard'

export const StudiosGrid = ({ studios }) => {
	return (
		<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
			{studios.map(studio => (
				<StudioCard
					key={studio.id}
					id={studio.id}
					address={studio.address}
					manager={studio.manager}
					monthRevenue={studio.monthRevenue}
					name={studio.name}
					occupancy={studio.occupancy}
					phone={studio.phone}
					rooms={studio.rooms}
					services={studio.services}
					staff={studio.staff}
					status={studio.status}
					todayRevenue={studio.todayRevenue}
				/>
			))}
		</div>
	)
}
