"use client"

import * as React from "react"
import {
  BarChart3,
  Calendar,
  CreditCard,
  FileText,
  Home,
  Inbox,
  LifeBuoy,
  Package,
  Search,
  Settings,
  ShoppingCart,
  Users,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavMain } from "./nav-main"
import { NavSecondary } from "./nav-secondary"
import { NavUser } from "./nav-user"
import { NavDocuments } from "./nav-documents"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const data = {
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: Home,
        isActive: true,
      },
      {
        title: "Analytics",
        url: "/analytics",
        icon: BarChart3,
        items: [
          {
            title: "Overview",
            url: "/analytics/overview",
          },
          {
            title: "Reports",
            url: "/analytics/reports",
          },
        ],
      },
      {
        title: "Customers",
        url: "/customers",
        icon: Users,
        items: [
          {
            title: "All Customers",
            url: "/customers/all",
          },
          {
            title: "Segments",
            url: "/customers/segments",
          },
        ],
      },
      {
        title: "Products",
        url: "/products",
        icon: Package,
        items: [
          {
            title: "Inventory",
            url: "/products/inventory",
          },
          {
            title: "Categories",
            url: "/products/categories",
          },
        ],
      },
      {
        title: "Orders",
        url: "/orders",
        icon: ShoppingCart,
        items: [
          {
            title: "Recent Orders",
            url: "/orders/recent",
          },
          {
            title: "Order History",
            url: "/orders/history",
          },
        ],
      },
      {
        title: "Calendar",
        url: "/calendar",
        icon: Calendar,
      },
      {
        title: "Settings",
        url: "/settings",
        icon: Settings,
        items: [
          {
            title: "General",
            url: "/settings/general",
          },
          {
            title: "Team",
            url: "/settings/team",
          },
          {
            title: "Billing",
            url: "/settings/billing",
          },
          {
            title: "Limits",
            url: "/settings/limits",
          },
        ],
      },
    ],
    navSecondary: [
      {
        title: "Support",
        url: "#",
        icon: LifeBuoy,
      },
      {
        title: "Feedback",
        url: "#",
        icon: FileText,
      },
    ],
    documents: [
      {
        name: "Getting Started",
        url: "/docs/getting-started",
        icon: FileText,
      },
      {
        name: "API Reference",
        url: "/docs/api",
        icon: FileText,
      },
      {
        name: "Changelog",
        url: "/docs/changelog",
        icon: FileText,
      },
    ],
  }

  return (
    <Sidebar collapsible="icon" variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Package className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Acme Inc</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}