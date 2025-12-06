"use client"

import * as React from "react"
import {
  IconBook,
  IconChartBar,
  IconDashboard,
  IconFileText,
  IconInnerShadowTop,
  IconReport,
  IconBrandLinkedin,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Dersler",
      url: "#",
      icon: IconBook,
    },
    {
      title: "Notlar",
      url: "#",
      icon: IconFileText,
    },
    {
      title: "İstatistikler",
      url: "#",
      icon: IconChartBar,
    },
    {
      title: "Raporlar",
      url: "#",
      icon: IconReport,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/dashboard">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">GPA</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <div className="px-3 py-3 border-t border-sidebar-border">
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <span>Developed by</span>
            <a
              href="https://www.linkedin.com/in/dogancanyildiz"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-medium text-sidebar-foreground hover:text-primary transition-colors duration-200"
            >
              <IconBrandLinkedin className="h-3.5 w-3.5" />
              <span>Doğan Can YILDIZ</span>
            </a>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
