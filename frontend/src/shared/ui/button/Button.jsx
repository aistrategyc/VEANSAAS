import React from 'react'

const styles = {
	primary:
		" w-full text-white bg-fuchsia-300 hover:bg-fuchsia-400 focus:ring-2 focus:outline-none focus:ring-fuchsia-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-4'",
	dark: 'w-full text-white bg-violet-500 hover:bg-violet-600 focus:ring-2',
}

export const Button = ({ type = 'primary', children }) => {
	return <button className={styles[type]}>{children}</button>
}
