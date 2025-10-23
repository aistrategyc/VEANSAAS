import { memo } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Trash2 } from 'lucide-react'
import { EmptyState } from '@/components/ui/empty-state'
import { ATTRIBUTE_TYPES } from './lib/constants'
import { Label } from '@/components/ui/label'
export const AttributeList = memo(({ fields, onRemove }) => {
	if (fields.length === 0) {
		return (
			<EmptyState
				title='Нет атрибутов'
				description='Добавьте атрибуты для отображения в таблице'
				icon={<Trash2 className='h-12 w-12 text-muted-foreground' />}
			/>
		)
	}

	return (
		<div className='space-y-2'>
			<Label className='text-sm'>Добавленные атрибуты:</Label>
			<div className='space-y-2'>
				{fields.map((field, index) => (
					<div
						key={field.id}
						className='flex items-center justify-between p-3 border rounded-lg'
					>
						<div className='flex items-center gap-3 flex-1 min-w-0'>
							<div className='flex-1 min-w-0'>
								<div className='flex items-center gap-2 mb-1'>
									<span className='font-medium text-sm truncate'>
										{field.name}
									</span>
									<Badge variant='outline' className='text-xs'>
										{ATTRIBUTE_TYPES[field.type]}
									</Badge>
									{field.is_required && (
										<Badge variant='destructive' className='text-xs'>
											Обязательный
										</Badge>
									)}
								</div>
								{field.description && (
									<p className='text-xs text-muted-foreground truncate'>
										{field.description}
									</p>
								)}
								{field.type === 'select' &&
									field.values &&
									field.values.length > 0 && (
										<p className='text-xs text-muted-foreground truncate'>
											Значения: {field.values.join(', ')}
										</p>
									)}
							</div>
						</div>
						<Button
							type='button'
							variant='ghost'
							size='sm'
							onClick={() => onRemove(index)}
							className='shrink-0 ml-2'
						>
							<Trash2 className='h-4 w-4' />
						</Button>
					</div>
				))}
			</div>
		</div>
	)
})

AttributeList.displayName = 'AttributeList'
