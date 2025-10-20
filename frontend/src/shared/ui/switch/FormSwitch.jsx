import { useController } from 'react-hook-form'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

const FormSwitch = ({
	name,
	control,
	title,
	rules = { required: 'Error' },
	error,
	className = '',
}) => {
	const {
		field,
		fieldState: { invalid, isTouched, isDirty },
	} = useController({
		name,
		control,
		rules,
	})

	return (
		<div className={`space-y-2 ${className}`}>
			<div className='flex items-center gap-3 p-3 border rounded-lg'>
				<Switch
					id={name}
					checked={field.value}
					onCheckedChange={field.onChange}
				/>
				<Label htmlFor={name} className='text-sm cursor-pointer'>
					{title}
				</Label>
			</div>
			{error && <p className='text-red-500 text-sm h-5 ml-2'>{error}</p>}
		</div>
	)
}
export default FormSwitch
