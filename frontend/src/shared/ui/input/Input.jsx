export const Input = props => {
	return (
		<div>
			<label className='block text-gray-500 divider-text'>{props.title}</label>
			<input
				className=' border shadow text-neutral-600 text-sm rounded-md block w-full p-2.5 mb-0'
				{...props}
			/>
			<p className='text-red-500 text-sm h-5'>{props.error}</p>
		</div>
	)
}
