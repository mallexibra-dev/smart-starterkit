"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Eye, Edit, Trash, Plus, Search, Filter, RefreshCw, Share2 } from "lucide-react"

export function ButtonShowcase() {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-lg font-medium mb-3">Button Variants</h4>
        <div className="flex flex-wrap gap-2">
          <Button variant="default">Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button variant="destructive">Destructive</Button>
        </div>
      </div>

      <div>
        <h4 className="text-lg font-medium mb-3">Button Sizes</h4>
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
        </div>
      </div>

      <div>
        <h4 className="text-lg font-medium mb-3">Button with Icons</h4>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add New
          </Button>
          <Button>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      <div>
        <h4 className="text-lg font-medium mb-3">Action Buttons</h4>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            View
          </Button>
          <Button variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button variant="destructive" size="sm">
            <Trash className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div>
        <h4 className="text-lg font-medium mb-3">Disabled State</h4>
        <div className="flex flex-wrap gap-2">
          <Button disabled>Default</Button>
          <Button variant="outline" disabled>Outline</Button>
          <Button variant="ghost" disabled>Ghost</Button>
          <Button size="sm" disabled>Small</Button>
        </div>
      </div>

      <div>
        <h4 className="text-lg font-medium mb-3">Buttons with Badge</h4>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="relative">
            Notifications
            <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center bg-red-500 text-white text-xs rounded-full">
              3
            </Badge>
          </Button>
          <Button variant="outline">
            Messages
            <Badge variant="secondary" className="ml-2">5</Badge>
          </Button>
          <Button>
            Cart
            <Badge className="ml-2 bg-blue-500">12</Badge>
          </Button>
        </div>
      </div>
    </div>
  )
}