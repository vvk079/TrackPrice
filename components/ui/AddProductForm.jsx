"use client"
import React, { useState } from 'react'
import { Input } from './input'
import { Button } from './button'
import { Loader2 } from "lucide-react"
import { addProduct } from '@/app/Action'
import { toast } from 'sonner'
import AuthModal from './AuthModel'
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
      <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
        <div className="flex flex-cols sm:flex-row gap-2">
          <Input placeholder='Enter Product URL'
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="h-12 text-base"
            required
            disabled={loading}
          />


          <Button className="bg-pink-500 hover:bg-pink-600 h-10 sm:h-12
      px-8"
            type="submit"
            disabled={loading}
            size="lg">
            {
              loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Track Price"
              )
            }
          </Button>
        </div>


      </form>
      {/*Auth Model*/}
      <AuthModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

    </>
  )
}

export default AddProductForm