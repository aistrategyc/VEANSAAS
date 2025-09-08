import React from 'react'
import { CalendarStats } from './CalendarStats'
import { CalendarMastersInfo } from './CalendarMastersInfo'
import { CalendarActions } from './CalendarActions'

export const CalendarSidebar = () => {
	return (
		<div className='space-y-6'>
			<CalendarStats />
			<CalendarMastersInfo />
			<CalendarActions />
		</div>
	)
}
