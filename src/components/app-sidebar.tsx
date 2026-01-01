"use client"

import * as React from "react"
import {
  AudioWaveform,
  Blocks,
  Calendar,
  Command,
  FilePlus,
  MessageCircleQuestion,
  Settings2,
  Trash2,
} from "lucide-react"

import { NavFavorites } from "@/components/nav-favorites"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { TeamSwitcher } from "@/components/team-switcher"
import { NavUser } from "./nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  SidebarFooter
} from "@/components/ui/sidebar"
import { toast } from "sonner"
import axios from "axios"


// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: Command,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "New Chat",
      url: "#",
      icon: FilePlus,
    }
  ],
  navSecondary: [
    {
      title: "Calendar",
      url: "#",
      icon: Calendar,
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
    },
    {
      title: "Templates",
      url: "#",
      icon: Blocks,
    },
    {
      title: "Trash",
      url: "#",
      icon: Trash2,
    },
    {
      title: "Help",
      url: "#",
      icon: MessageCircleQuestion,
    },
  ],
  favorites: [
    {
      name: "Project Management",
      url: "#",
    },
    {
      name: "Family Recipe Collection",
      url: "#",
    },
    {
      name: "Fitness Tracker",
      url: "#",
    },
    {
      name: "Book Notes & Reading List",
      url: "#",
    },
    {
      name: "Sustainable Gardening",
      url: "#",
    },
    {
      name: "Language Learning",
      url: "#",
    },
    {
      name: "Home Renovation",
      url: "#",
    },
    {
      name: "Personal Finance",
      url: "#",
    },
    {
      name: "Movie & TV Show",
      url: "#",
    },
    {
      name: "Daily Habit Tracker",
      url: "#",
    },
  ],
}


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const [user, setUser] = React.useState({
    email: "",
    userName: "",
    userId: "",
    avatar: ""
  })
  const loadUser = async () => {
  try {
    const res = await axios.post("/api/users/profile");
      setUser({
        ...user,
        userName: res.data.data.username,
        email: res.data.data.email,
        userId: res.data.data._id
      });

  } catch (error: any) {
    toast.error(error.message);
  }
}

const loadSession = async () => {
  try {
    const res = await axios.get(`/api/users/chatsession?user=${user.userId}`);
    console.log(res.data);
  } catch (error: any) {
    toast.error(error.message);
  }
}

React.useEffect(()=>{
  loadUser()
},[])

React.useEffect(()=>{
  if (user.userId === "") return;  
  loadSession();
},[user])

  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
        <NavMain items={data.navMain} />
      </SidebarHeader>
      <SidebarContent>
        <NavFavorites favorites={data.favorites} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
