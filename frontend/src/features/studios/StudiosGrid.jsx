import { StudioCard } from './StudioCard'

export const StudiosGrid = ({ studios, onEditStudio }) => {
	return (
		<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
			{studios?.items?.map(studio => (
				<StudioCard
					key={studio.uuid}
					studio={studio}
					onEdit={() => onEditStudio(studio)}
				/>
			))}
		</div>
	)
}
