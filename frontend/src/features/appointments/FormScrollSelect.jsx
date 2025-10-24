import { useState, useEffect, useRef, useCallback } from 'react'
import { useController } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import api from '@/shared/api/client'

const FormScrollSelect = ({
	name,
	control,
	title,
	placeholder = title,
	error,
	endpoint = '/customers',
	formatLabel = item =>
		item.first_name && item.last_name
			? `${item.first_name} ${item.last_name}`
			: item.phone_number || 'Без имени',
}) => {
	const {
		field: { value, onChange },
		fieldState: { error: fieldError },
	} = useController({ name, control })

	const [items, setItems] = useState([])
	const [offset, setOffset] = useState(0)
	const [hasMore, setHasMore] = useState(true)
	const [isLoading, setIsLoading] = useState(false)
	const [isOpen, setIsOpen] = useState(false)

	const listRef = useRef(null)

	/** 🔹 Получение клиентов */
	const fetchItems = useCallback(
		async (reset = false) => {
			if (isLoading || (!hasMore && !reset)) return
			setIsLoading(true)

			try {
				const limit = 10
				const { data } = await api.get(endpoint, {
					params: { limit, offset: reset ? 0 : offset },
				})

				const newItems = data.items || []

				setItems(prev => (reset ? newItems : [...prev, ...newItems]))
				setHasMore(data.pagination?.has_more ?? false)
				setOffset(prev => (reset ? limit : prev + limit))
			} catch (err) {
				console.error('Ошибка загрузки клиентов:', err)
			} finally {
				setIsLoading(false)
			}
		},
		[endpoint, offset, hasMore, isLoading]
	)
	useEffect(() => {
		if (isOpen && items.length === 0) {
			fetchItems(true)
		}
	}, [isOpen])
	const handleScroll = e => {
		const el = e.target
		const scrollBottom = el.scrollHeight - el.scrollTop - el.clientHeight
		if (scrollBottom < 20 && !isLoading && hasMore) {
			fetchItems()
		}
	}

	return (
		<div className='space-y-2'>
			<div className='flex items-center'>
				<Label>{title}</Label>
				<p className='text-red-500 text-sm h-5 ml-2'>
					{error || fieldError?.message}
				</p>
			</div>

			<Select
				value={value || ''}
				onValueChange={onChange}
				onOpenChange={setIsOpen}
			>
				<SelectTrigger className='w-full'>
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>

				<SelectContent
					ref={listRef}
					className='max-h-80 overflow-y-auto'
					onScrollCapture={handleScroll}
				>
					<SelectGroup>
						{items.map(item => (
							<SelectItem key={item.uuid} value={item.uuid}>
								{formatLabel(item)}
							</SelectItem>
						))}

						{isLoading && (
							<div className='flex justify-center py-2'>
								<Loader2 className='w-4 h-4 animate-spin text-muted-foreground' />
							</div>
						)}

						{!isLoading && !hasMore && items.length > 0 && (
							<div className='text-center text-sm text-gray-400 py-2'>
								Все клиенты загружены
							</div>
						)}
					</SelectGroup>
				</SelectContent>
			</Select>
		</div>
	)
}

export default FormScrollSelect
