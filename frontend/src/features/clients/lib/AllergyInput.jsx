import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { useState } from 'react'
import { Label } from 'recharts'

const AllergyInput = ({ allergies, onAdd, onRemove }) => {
	const [newAllergy, setNewAllergy] = useState('')

	const handleAdd = () => {
		if (newAllergy.trim()) {
			onAdd(newAllergy)
			setNewAllergy('')
		}
	}

	return (
		<div className='space-y-2'>
			<Label>Аллергии</Label>
			<div className='flex space-x-2'>
				<input
					value={newAllergy}
					onChange={e => setNewAllergy(e.target.value)}
					placeholder='Добавить аллергию'
					className='flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
				/>
				<Button type='button' onClick={handleAdd} variant='outline'>
					Добавить
				</Button>
			</div>
			{allergies.length > 0 && (
				<div className='flex flex-wrap gap-2 mt-2'>
					{allergies.map(allergy => (
						<Badge
							key={allergy}
							variant='destructive'
							className='flex items-center gap-1'
						>
							{allergy}
							<X
								className='h-3 w-3 cursor-pointer'
								onClick={() => onRemove(allergy)}
							/>
						</Badge>
					))}
				</div>
			)}
		</div>
	)
}
export default AllergyInput
