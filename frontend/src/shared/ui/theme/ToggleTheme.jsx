import { useTheme } from '@/app/contexts/ThemeContext'
import { Moon, Sun } from 'lucide-react'

export const ThemeToggle = () => {
	const { theme, toggleTheme } = useTheme()

	return (
		<button
			variant='ghost'
			size='sm'
			onClick={toggleTheme}
			className='relative p-2 rounded-lg hover:bg-accent transition-colors'
			aria-label='Toggle theme'
		>
			<Sun className='h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
			<Moon className='absolute top-2 left-2 h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
		</button>
	)
}
