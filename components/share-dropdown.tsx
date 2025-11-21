"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Share2, Twitter, Facebook, Linkedin, Mail, MessageSquare, Link as LinkIcon, Check } from "lucide-react"
import { getSocialShareLinks } from "@/lib/share-utils"
import { useState } from "react"
import { toast } from "@/components/ui/use-toast"

interface ShareDropdownProps {
  article: {
    title: string
    link: string
    source?: string
  }
  className?: string
}

export function ShareDropdown({ article, className = "" }: ShareDropdownProps) {
  const [copied, setCopied] = useState(false)
  const shareLinks = getSocialShareLinks(article)

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(article.link)
      setCopied(true)
      toast({
        title: "Link copied!",
        description: "Article link has been copied to your clipboard.",
      })
      
      // Reset the copied state after 2 seconds
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to copy link to clipboard.",
      })
    }
  }

  const shareItems = [
    {
      name: "Twitter",
      icon: <Twitter className="h-4 w-4 text-blue-400" />,
      action: () => window.open(shareLinks.twitter, '_blank', 'noopener,noreferrer')
    },
    {
      name: "Facebook",
      icon: <Facebook className="h-4 w-4 text-blue-600" />,
      action: () => window.open(shareLinks.facebook, '_blank', 'noopener,noreferrer')
    },
    {
      name: "LinkedIn",
      icon: <Linkedin className="h-4 w-4 text-blue-700" />,
      action: () => window.open(shareLinks.linkedin, '_blank', 'noopener,noreferrer')
    },
    {
      name: "WhatsApp",
      icon: <MessageSquare className="h-4 w-4 text-green-500" />,
      action: () => window.open(shareLinks.whatsapp, '_blank', 'noopener,noreferrer')
    },
    {
      name: "Email",
      icon: <Mail className="h-4 w-4 text-gray-600" />,
      action: () => window.open(shareLinks.email, '_blank', 'noopener,noreferrer')
    },
    {
      name: copied ? "Copied!" : "Copy Link",
      icon: copied ? <Check className="h-4 w-4 text-green-500" /> : <LinkIcon className="h-4 w-4" />,
      action: handleCopyLink
    }
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className={className}>
          <Share2 className="h-4 w-4" />
          <span className="sr-only">Share</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {shareItems.map((item) => (
          <DropdownMenuItem key={item.name} onClick={item.action} className="cursor-pointer">
            <div className="flex items-center w-full">
              <span className="mr-2">{item.icon}</span>
              <span>{item.name}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
