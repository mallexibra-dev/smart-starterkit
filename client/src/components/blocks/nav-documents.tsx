"use client"

import * as React from "react"
import { ChevronRight, FileText, MoreHorizontal, Plus } from "lucide-react"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

interface NavDocumentsProps {
  items: {
    name: string
    url: string
    icon: React.ComponentType<{ className?: string }>
  }[]
  className?: string
}

export function NavDocuments({ items, className }: NavDocumentsProps) {
  return (
    <SidebarGroup className={className}>
      <SidebarGroupLabel>Documents</SidebarGroupLabel>
      <SidebarMenu>
        <Collapsible defaultOpen>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Add new document">
              <a href="#">
                <Plus />
                <span>New Document</span>
              </a>
            </SidebarMenuButton>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton
                size="sm"
                className="data-[state=open]:sidebar-menu-accent-background data-[state=open]:sidebar-menu-accent-text"
              >
                <ChevronRight className="transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                <span>Recent</span>
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {items.map((item) => (
                  <SidebarMenuSubItem key={item.name}>
                    <SidebarMenuSubButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.name}</span>
                      </a>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>

        <Collapsible>
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton
                size="sm"
                className="data-[state=open]:sidebar-menu-accent-background data-[state=open]:sidebar-menu-accent-text"
              >
                <ChevronRight className="transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                <span>Shared</span>
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild>
                    <a href="#">
                      <FileText />
                      <span>Project Overview</span>
                    </a>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild>
                    <a href="#">
                      <FileText />
                      <span>Marketing Strategy</span>
                    </a>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton asChild>
                    <a href="#">
                      <FileText />
                      <span>Technical Documentation</span>
                    </a>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>

        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <a href="#">
              <FileText />
              <span>Archive</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  )
}