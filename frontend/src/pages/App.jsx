import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { increment, decrement } from '../shared/redux/slices/counterSlice'

export const App = () => {
	const dispatch = useDispatch()

	const count = useSelector(state => state.rootReducer.counter.value)
	console.log(count)

	return (
		<>
			<div>{count}</div>
			<button onClick={() => dispatch(increment())}>click</button>
			<button onClick={() => dispatch(decrement())}>minus</button>
		</>
	)
}
