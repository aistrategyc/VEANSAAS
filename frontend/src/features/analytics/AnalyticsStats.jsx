import React from 'react'
import { AnalyticsStatsItem } from './AnalyticsStatsItem'

export const AnalyticsStats = ({ kpis }) => {
	return (
		<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
			{kpis.map((kpi, index) => (
				<AnalyticsStatsItem
					key={index}
					id={index}
					change={kpi.change}
					description={kpi.description}
					title={kpi.title}
					trend={kpi.trend}
					value={kpi.value}
				/>
			))}
		</div>
	)
}
