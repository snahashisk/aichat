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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
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
import { useRouter } from "next/navigation"


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
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
    },
    {
      title: "Help",
      url: "#",
      icon: MessageCircleQuestion,
    },
  ],
}
type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  sessionId: string;
};


export function AppSidebar({ sessionId, ...props }: AppSidebarProps ) {

   const [openDialog, setOpenDialog] = React.useState(false)

  const [user, setUser] = React.useState({
    email: "",
    userName: "",
    userId: "",
    avatar: ""
  })

    const navMain = [
    {
      title: "New Chat",
      icon: FilePlus,
      onClick: () => setOpenDialog(true),
    },
  ]

  const [chatSessions, setChatSessions] = React.useState<{ name: string; url: string }[]>([]);

  const router = useRouter()

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
    router.push("/login")
  }
}

const loadSession = async () => {
  try {
    const res = await axios.get("/api/users/chatsession");
    const sessions = res.data.sessions;
    const formattedSessions = sessions.reverse().map((session: any) => ({
      name: session.title,
      url: session._id
    }));

    setChatSessions(formattedSessions)
  } catch (error: any) {
    toast.error(error.message);
  }
}

React.useEffect(()=>{
  loadUser()
  loadSession();
},[])


const [title, setTitle] = React.useState("");

const submitTitle = async (e: React.FormEvent) => {
  try {
    e.preventDefault()
    const payload = {title: title}
    console.log("I am tryting")
    setOpenDialog(false)
    const res = await axios.post("/api/users/chatsession", payload)
    setOpenDialog(false)
    setTitle("")
    toast.success("New Session Created");
    loadSession();
    console.log(res)
  } catch (error: any) {
    toast.error(error.message)
  }
}


  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
        <NavMain items={navMain} />
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogContent className="sm:max-w-106.25">
        <form onSubmit={submitTitle}>
          <DialogHeader>
            <DialogTitle>New Chat Title</DialogTitle>
            <DialogDescription>
              Enter a title for your new chat sessions.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Input id="name-1" name="name"  value={title} onChange={(e)=>{setTitle(e.target.value)}} className="my-4"  />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={() => setOpenDialog(false)}>Cancel</Button>
            </DialogClose>
            <Button type="submit">Create Session</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
      </SidebarHeader>
      <SidebarContent>
        <NavFavorites favorites={chatSessions} chatSessionId={sessionId} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
