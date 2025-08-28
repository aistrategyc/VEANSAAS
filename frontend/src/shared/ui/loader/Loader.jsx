import React from 'react'

export const Loader = () => {
	return (
		<div className='fixed inset-0 flex justify-center items-center bg-white bg-opacity-90 z-50'>
			<div className='flex flex-col items-center gap-3'>
				<div className='w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin'></div>
				<span className='text-gray-700 font-medium'>Loading...</span>
			</div>
		</div>
	)
}
