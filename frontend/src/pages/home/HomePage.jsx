import { Navigate } from 'react-router'
import { isAuthenticated } from '../../shared/service/auth.service'

export const HomePage = () => {
	return <>{isAuthenticated() ? <div>Home</div> : <Navigate to='/login' />}</>
}
