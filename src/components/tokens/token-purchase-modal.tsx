'use client'

import * as React from 'react'
import { useState } from 'react'
import { CreditCard, Coins } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/components/ui/use-toast'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase'

interface TokenPurchaseModalProps {
  children?: React.ReactNode
}

export function TokenPurchaseModal({ children }: TokenPurchaseModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const handlePurchase = async () => {
    try {
      setIsLoading(true)

      // Get the current session
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('You must be logged in to purchase tokens')
      }

      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          email: session.user.email,
          userId: session.user.id,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create checkout session')
      }

      const { url, error } = await response.json()

      if (error) {
        throw new Error(error)
      }

      if (!url) {
        throw new Error('No checkout URL received')
      }

      setIsOpen(false) // Close the modal before redirect
      window.location.href = url
    } catch (error) {
      console.error('Purchase error:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to process payment',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" className="gap-2">
            <Coins className="h-4 w-4" />
            Buy Tokens
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Purchase Tokens</DialogTitle>
          <DialogDescription>
            Choose a token package to continue using our AI services.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Free Tier</span>
                <Badge variant="secondary">Current</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">10,000 tokens</p>
              <p className="text-sm text-muted-foreground">Free tokens for new users</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Standard Package</span>
                <Badge>Best Value</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">50,000 tokens</p>
              <p className="text-sm text-muted-foreground">Perfect for regular users</p>
              <div className="mt-4">
                <p className="text-xl font-bold">$10.00</p>
                <p className="text-sm text-muted-foreground">One-time purchase</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full gap-2" onClick={handlePurchase} disabled={isLoading}>
                <CreditCard className="h-4 w-4" />
                {isLoading ? 'Processing...' : 'Purchase Now'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
