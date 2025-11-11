export const HeaderWrapper = ({ children, title, desc = '' }) => {
	return (
		<div className='flex items-center justify-between'>
			<div>
				<h1 className='text-3xl text-foreground'>{title}</h1>
				<p className='text-muted-foreground'>{desc}</p>
			</div>
			<div className='flex items-center space-x-2'>{children}</div>
		</div>
	)
}
