'use client'

import * as React from 'react'
import { Settings } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SidebarMenuButton } from '@/components/ui/sidebar'
import { GeneralSettings } from './general-settings'
import { APIKeySettings } from './api-key-settings'

export function SettingsDialog() {
  const [open, setOpen] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState('general')

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <SidebarMenuButton onClick={() => setOpen(true)} className="w-full justify-start">
        <Settings className="h-4 w-4" />
        <span>Settings</span>
      </SidebarMenuButton>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Manage your application settings and preferences.</DialogDescription>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          </TabsList>
          <TabsContent value="general" className="mt-4">
            <GeneralSettings />
          </TabsContent>
          <TabsContent value="api-keys" className="mt-4">
            <APIKeySettings />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
