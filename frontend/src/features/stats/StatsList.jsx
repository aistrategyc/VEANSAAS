import { StatsItem } from './StatsItem'

export const StatsList = ({ stats }) => {
	return (
		<div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
			{stats.map(stat => (
				<StatsItem
					key={stat.id}
					name={stat.name}
					count={stat.count}
					Icon={stat.icon}
				/>
			))}
		</div>
	)
}
