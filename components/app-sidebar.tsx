"use client"

import * as React from "react"
import {
  IconBook,
  IconChartBar,
  IconDashboard,
  IconFileText,
  IconReport,
  IconBrandLinkedin,
  IconSchool,
} from "@tabler/icons-react"
import Link from "next/link"

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
      title: "Ana Sayfa",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Dersler",
      url: "/courses",
      icon: IconBook,
    },
    {
      title: "Notlar",
      url: "/grades",
      icon: IconFileText,
    },
    {
      title: "İstatistikler",
      url: "/statistics",
      icon: IconChartBar,
    },
    {
      title: "Raporlar",
      url: "/reports",
      icon: IconReport,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <div className="px-2 py-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group"
          >
            <div className="flex items-center justify-center rounded-md bg-primary text-primary-foreground size-10 shrink-0 group-hover:bg-primary/90 transition-colors">
              <IconSchool className="size-5" />
            </div>
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-base font-semibold leading-none">GPA</span>
              <span className="text-xs text-muted-foreground leading-none">Hesaplama Sistemi</span>
            </div>
          </Link>
        </div>
        <div className="h-px bg-sidebar-border mx-2" />
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
