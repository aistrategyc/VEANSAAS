import { useUser } from '../../shared/hooks/useUser'

export const ProfileCard = () => {
	const { user, loading } = useUser()

	return (
		<div className='p-6 border-b border-gray-100'>
			<h2 className='text-xl font-bold text-gray-800'>
				{!loading ? user.first_name : 'user'}
			</h2>
			<p className='text-sm text-gray-500 mt-1'>Тату мастер</p>
		</div>
	)
}
