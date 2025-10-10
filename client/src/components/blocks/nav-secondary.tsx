"use client"

import * as React from "react"
import { ChevronUp, FileText, LifeBuoy } from "lucide-react"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

interface NavSecondaryProps {
  items: {
    title: string
    url: string
    icon: React.ComponentType<{ className?: string }>
  }[]
  className?: string
}

export function NavSecondary({ items, className }: NavSecondaryProps) {
  return (
    <SidebarMenu className={className}>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild size="sm">
            <a href={item.url}>
              <item.icon />
              <span>{item.title}</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}