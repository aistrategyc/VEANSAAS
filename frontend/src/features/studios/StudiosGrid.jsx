import { Pagination } from '@/shared/ui/Pagination'
import { StudioCard } from './StudioCard'

export const StudiosGrid = ({
	studios,
	onEditStudio,
	currentPage = 1,
	pageSize = 10,
	totalCount = 20,
	onPageChange,
}) => {
	const totalPages = Math.ceil(totalCount / pageSize)
	return (
		<>
			<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
				{studios?.items?.map(studio => (
					<StudioCard
						key={studio.uuid}
						studio={studio}
						onEdit={() => onEditStudio(studio)}
					/>
				))}
			</div>
			{totalPages > 1 && (
				<Pagination
					currentPage={currentPage}
					totalCount={totalCount}
					pageSize={pageSize}
					onPageChange={onPageChange}
				/>
			)}
		</>
	)
}
