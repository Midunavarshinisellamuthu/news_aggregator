import { toast } from "@/components/ui/use-toast"

export const shareArticle = async (article: { title: string; link: string; source?: string }) => {
  const shareData = {
    title: article.title,
    text: article.title,
    url: article.link,
  }

  try {
    if (navigator.share) {
      await navigator.share(shareData)
    } else {
      // Fallback for browsers that don't support Web Share API
      await navigator.clipboard.writeText(article.link)
      toast({
        title: "Link copied to clipboard",
        description: "You can now paste the article link anywhere.",
      })
    }
  } catch (err) {
    console.error('Error sharing:', err)
  }
}

export const getSocialShareLinks = (article: { title: string; link: string }) => {
  const encodedTitle = encodeURIComponent(article.title)
  const encodedUrl = encodeURIComponent(article.link)
  
  return {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    email: `mailto:?subject=${encodedTitle}&body=Check%20this%20out:%20${encodedUrl}`,
  }
}
