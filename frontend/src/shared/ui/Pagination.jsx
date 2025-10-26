import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export const Pagination = ({
	currentPage = 1,
	totalCount = 0,
	pageSize = 10,
	onPageChange,
}) => {
	const totalPages = Math.ceil(totalCount / pageSize)

	return (
		<div className='flex items-center justify-center space-x-2 m-3'>
			<Button
				variant='ghost'
				size='sm'
				onClick={() => onPageChange(currentPage - 1)}
				disabled={currentPage <= 1}
			>
				<ChevronLeft className='h-4 w-4' />
			</Button>
			<div className='text-sm text-muted-foreground mx-2'>
				{currentPage} / {totalPages}
			</div>
			<Button
				variant='ghost'
				size='sm'
				onClick={() => onPageChange(currentPage + 1)}
				disabled={currentPage >= totalPages}
			>
				<ChevronRight className='h-4 w-4' />
			</Button>
		</div>
	)
}
