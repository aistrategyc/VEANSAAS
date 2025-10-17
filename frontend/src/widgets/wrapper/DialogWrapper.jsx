import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"


export const DialogWrapper = ({ children, title, isOpen, onClose, className = ''}) => {
	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className={`max-w-md max-h-[90vh] overflow-y-auto ${className}`}>
				<DialogHeader>
					<DialogTitle>
						{title}
					</DialogTitle>
				</DialogHeader>
				{children}
			</DialogContent>
		</Dialog>
	)
}
