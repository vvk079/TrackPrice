"use client"
import React, { useState } from 'react'
import { Input } from './input'
import { Button } from './button'
import { Loader2 } from "lucide-react"
import { addProduct } from '@/app/Action'
import { toast } from 'sonner'
import AuthModal from './AuthModal'
const AddProductForm = ({ user }) => {

  const [url, setUrl] = useState("")
  const [loading, setloading] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      setShowAuthModal(true)
      return
    }
    setloading(true)

    const formData = new FormData()
    formData.append("url", url)

    const result = await addProduct(formData)

    if (result.error) {
      toast.error(result.error)

    } else {
      toast.success(result.message || "product tracked successfully")
      setUrl("")

    }
    setloading(false)


  }

  return (
    <>
      <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto group">
        <div className="flex flex-col sm:flex-row gap-4 p-2 bg-secondary/50 backdrop-blur-sm border border-border rounded-2xl shadow-2xl shadow-primary/5 focus-within:border-primary/50 transition-all duration-300">
          <Input
            placeholder='Paste product URL here...'
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="h-14 bg-transparent border-none text-lg focus-visible:ring-0 placeholder:text-muted-foreground/50"
            required
            disabled={loading}
          />

          <Button
            className="bg-primary hover:bg-primary/90 text-primary-foreground h-14 px-10 rounded-xl font-bold transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-95"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Searching...
              </>
            ) : (
              "Track Price"
            )}
          </Button>
        </div>
      </form>
      {/*Auth Model*/}
      <AuthModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
      />

    </>
  )
}

export default AddProductForm