"use client"

import * as React from "react"
import { Search, Bell, Settings, User, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu"
import { NotificationBell } from "./notification-bell"

interface TopBarProps {
  title?: string
  user?: {
    name: string
    email: string
    avatar?: string
  }
  onSearch?: (query: string) => void
  onMenuToggle?: () => void
  showSearch?: boolean
  showNotifications?: boolean
  notifications?: number
  className?: string
  children?: React.ReactNode
}

export function TopBar({
  title,
  user,
  onSearch,
  onMenuToggle,
  showSearch = true,
  showNotifications = true,
  notifications = 0,
  className,
  children
}: TopBarProps) {
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(searchQuery)
  }

  return (
    <header className={cn(
      "sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
      className
    )}>
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {onMenuToggle && (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => {
                onMenuToggle()
                setIsMobileMenuOpen(!isMobileMenuOpen)
              }}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          )}
          
          {title && (
            <h1 className="text-lg font-semibold text-foreground">
              {title}
            </h1>
          )}
        </div>

        {/* Center Section - Search */}
        {showSearch && (
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
            </form>
          </div>
        )}

        {/* Right Section */}
        <div className="flex items-center space-x-2">
          {children}
          
          {/* Mobile Search */}
          {showSearch && (
            <Button variant="ghost" size="icon" className="md:hidden">
              <Search className="h-5 w-5" />
            </Button>
          )}

          {/* Notifications */}
          {showNotifications && (
            <NotificationBell count={notifications} />
          )}

          {/* User Menu */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>
                      {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  )
}