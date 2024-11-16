'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { User } from '@supabase/supabase-js'
import {
  BadgeCheck,
  Bell,
  BookOpen,
  Command,
  CreditCard,
  History,
  LifeBuoy,
  LogOut,
  PenTool,
  Sparkles,
  FileEdit,
  Coins,
} from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { supabase } from '@/lib/supabase'
import { toast } from '@/components/ui/use-toast'
import { SettingsDialog } from '@/components/settings/settings-dialog'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import { LoadingBoundary } from '@/components/loading-boundary'
import { TokenPurchaseModal } from '@/components/tokens/token-purchase-modal'

interface AppLayoutProps {
  children: React.ReactNode
  breadcrumb: {
    title: string
    href?: string
  }
}

const data = {
  navMain: [
    {
      title: 'Prompt Editor',
      url: '/',
      icon: PenTool,
    },
    {
      title: 'Blog Generator',
      url: '/blog',
      icon: FileEdit,
    },
    {
      title: 'History',
      url: '/history',
      icon: History,
    },
  ],
  navSecondary: [
    { title: 'Documentation', url: '#', icon: BookOpen },
    { title: 'Support', url: '#', icon: LifeBuoy },
  ],
}

export function AppLayout({ children, breadcrumb }: AppLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [tokens, setTokens] = useState<number | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data } = await supabase
          .from('user_settings')
          .select('tokens')
          .eq('user_id', user.id)
          .single()

        setTokens(data?.tokens ?? 10000)
      }
    }
    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (!session?.user) {
        router.push('/auth')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true)
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      router.push('/auth')
      await new Promise((resolve) => setTimeout(resolve, 100))
    } catch (error) {
      console.error('Sign out error:', error)
      toast({
        title: 'Error signing out',
        description: error instanceof Error ? error.message : 'Failed to sign out',
        variant: 'destructive',
      })
    } finally {
      setIsSigningOut(false)
    }
  }

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase()
  }

  if (!user) {
    return null
  }

  return (
    <SidebarProvider>
      <div className="grid min-h-screen w-full md:grid-cols-[var(--sidebar-width)_1fr] md:peer-data-[state=collapsed]:grid-cols-[var(--sidebar-width-icon)_1fr]">
        <Sidebar variant="inset" className="h-screen">
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" asChild>
                  <Link href="/" prefetch={true}>
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                      <Command className="size-4" />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">Composer Kit</span>
                      <span className="truncate text-xs">Next.js Boilerplate</span>
                    </div>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
              <SidebarMenu>
                {data.navMain.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      data-active={pathname === item.url}
                    >
                      <Link href={item.url} prefetch={true}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                <SidebarMenuItem>
                  <SettingsDialog />
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
            <SidebarGroup className="mt-auto">
              <SidebarGroupContent>
                <SidebarMenu>
                  {data.navSecondary.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild size="sm">
                        <Link href={item.url} prefetch={true}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton
                      size="lg"
                      className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    >
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.email} />
                        <AvatarFallback className="rounded-lg">
                          {user?.email ? getInitials(user.email) : '??'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {user?.user_metadata?.full_name || user?.email}
                        </span>
                        <span className="truncate text-xs">{user?.email}</span>
                      </div>
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                    side="bottom"
                    align="end"
                    sideOffset={4}
                  >
                    <DropdownMenuLabel className="p-0 font-normal">
                      <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <Avatar className="h-8 w-8 rounded-lg">
                          <AvatarImage src={user?.user_metadata?.avatar_url} alt={user?.email} />
                          <AvatarFallback className="rounded-lg">
                            {user?.email ? getInitials(user.email) : '??'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-semibold">
                            {user?.user_metadata?.full_name || user?.email}
                          </span>
                          <span className="truncate text-xs">{user?.email}</span>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        <Coins className="mr-2 h-4 w-4" />
                        <span className="flex-1">Available Tokens</span>
                        <span className="font-mono">{tokens?.toLocaleString() ?? '...'}</span>
                      </DropdownMenuItem>
                      <TokenPurchaseModal>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <Sparkles className="mr-2 h-4 w-4" />
                          <span>Buy More Tokens</span>
                        </DropdownMenuItem>
                      </TokenPurchaseModal>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        <BadgeCheck className="mr-2 h-4 w-4" />
                        <span>Account</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <CreditCard className="mr-2 h-4 w-4" />
                        <span>Billing</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Bell className="mr-2 h-4 w-4" />
                        <span>Notifications</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} disabled={isSigningOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>{isSigningOut ? 'Signing out...' : 'Sign out'}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <div className="flex min-h-screen flex-col">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {breadcrumb?.href ? (
                    <BreadcrumbLink href={breadcrumb.href}>{breadcrumb.title}</BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{breadcrumb?.title || 'Dashboard'}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="ml-auto flex items-center gap-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Coins className="h-4 w-4" />
                <span className="font-mono">{tokens?.toLocaleString() ?? '...'}</span>
              </div>
              <ThemeToggle />
            </div>
          </header>
          <LoadingBoundary>
            <div className="flex-1 overflow-auto">{children}</div>
          </LoadingBoundary>
        </div>
      </div>
    </SidebarProvider>
  )
}
