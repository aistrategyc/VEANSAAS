import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { changeValue } from '../shared/redux/slices/counterSlice'

export const App = () => {
	const dispatch = useDispatch()

	const count = useSelector(state => state.counter.value)
	console.log(count)

	return (
		<>
			<div>App</div>
			<button onClick={() => dispatch(changeValue())}>click</button>
		</>
	)
}
