"use client"

import * as React from "react"
import {
  Bell,
  ChevronDown,
  CreditCard,
  Home,
  Menu,
  Plus,
  Search,
  Settings,
  User,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

interface SiteHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  showBreadcrumb?: boolean
}

export function SiteHeader({
  className,
  title = "Dashboard",
  description,
  showBreadcrumb = false,
  ...props
}: SiteHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className
      )}
      {...props}
    >
      <div className="container flex h-14 items-center">
        <div className="flex items-center gap-4 mr-4">
          <SidebarTrigger variant="ghost" size="icon" />
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 font-semibold">
              <Home className="h-5 w-5" />
              <span>{title}</span>
            </div>
            {description && (
              <span className="text-sm text-muted-foreground hidden lg:inline">
                {description}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 px-2 md:gap-4 md:px-0">
          <Button
            variant="outline"
            className="mr-2 h-8 w-8 p-0 md:hidden"
            size="icon"
          >
            <Menu className="h-4 w-4" />
            <span className="sr-only">Toggle Menu</span>
          </Button>

          {/* Mobile Search */}
          <div className="relative w-full max-w-sm md:hidden">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="pl-8"
            />
          </div>

          {/* Desktop Search */}
          <div className="relative hidden md:flex">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]"
            />
          </div>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="relative"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center">
                  3
                </span>
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-96 overflow-y-auto">
                <DropdownMenuItem className="flex flex-col items-start">
                  <div className="flex items-center w-full justify-between">
                    <span className="font-medium">New user registration</span>
                    <Badge variant="secondary">New</Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    John Doe just created an account
                  </span>
                  <span className="text-xs text-muted-foreground">2 min ago</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start">
                  <div className="flex items-center w-full justify-between">
                    <span className="font-medium">Order completed</span>
                    <Badge variant="secondary">New</Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Order #12345 has been completed
                  </span>
                  <span className="text-xs text-muted-foreground">1 hour ago</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex flex-col items-start">
                  <div className="flex items-center w-full justify-between">
                    <span className="font-medium">System update</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    System will be updated tonight at 2 AM
                  </span>
                  <span className="text-xs text-muted-foreground">3 hours ago</span>
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <span className="text-center w-full text-sm text-muted-foreground">
                  View all notifications
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Create Button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-1 pl-1 pr-2"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:block">Create</span>
                <ChevronDown className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                New User
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard className="mr-2 h-4 w-4" />
                New Invoice
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                New Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}