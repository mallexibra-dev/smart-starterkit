"use client"

import * as React from "react"
import { ReactNode } from "react"

import { AppSidebar } from "@/components/layout/app-sidebar"
import { SiteHeader } from "@/components/layout/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

interface ContainerLayoutProps {
  children: ReactNode
  title?: string
  sidebarVariant?: "sidebar" | "floating" | "inset"
  sidebarWidth?: string
  headerHeight?: string
  className?: string
}

export function ContainerLayout({
  children,
  title = "Documents",
  sidebarVariant = "inset",
  sidebarWidth = "calc(var(--spacing) * 72)",
  headerHeight = "calc(var(--spacing) * 12)",
  className,
}: ContainerLayoutProps) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": sidebarWidth,
          "--header-height": headerHeight,
        } as React.CSSProperties
      }
    >
      <AppSidebar variant={sidebarVariant} />
      <SidebarInset>
        <SiteHeader title={title} />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2 px-6">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}