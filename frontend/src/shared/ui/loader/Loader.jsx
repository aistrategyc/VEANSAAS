import React from 'react'

export const Loader = () => {
	return (
		<div className='flex justify-center items-center h-screen'>
			<Spinner animation='border' role='status'>
				<span className='visually-hidden'>Loading...</span>
			</Spinner>
		</div>
	)
}
