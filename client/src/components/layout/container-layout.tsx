"use client"

import * as React from "react"
import { ReactNode } from "react"

import { SiteHeader } from "@/components/layout/site-header"

interface ContainerLayoutProps {
  children: ReactNode
  title?: string
  className?: string
}

export function ContainerLayout({
  children,
  title,
  className,
}: ContainerLayoutProps) {
  return (
    <div className={className}>
      <SiteHeader title={title} />
      <div className="container mx-auto px-4 py-6">
        {children}
      </div>
    </div>
  )
}