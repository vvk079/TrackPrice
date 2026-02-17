"use client"
import React from 'react'
import { Button } from './button'
import { Form, LogIn, LogOut } from 'lucide-react'
import { useState } from 'react'
import AuthModal from './AuthModel'
import { signOut } from '@/app/Action'
const AuthButton = ({ user }) => {


  const [showAuthModel, setShowAuthModel] = useState(false)

  if (user) {

    return (
      <form action={signOut}>
        <Button variant="ghost" size="sm" type="submit" className="gap-2">
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </form>
    );
  }
  return (
    <>
      <Button variant="default" size="sm"
        className="bg-pink-500 hover:bg-pink-600 gap-2"
        onClick={() => setShowAuthModel(true)}
      >
        <LogIn className="h-4 w-4" />

        Sign In</Button>


      <AuthModel
        open={showAuthModel}
        onClose={() => setShowAuthModel(false)}
      />
    </>
  )
}

export default AuthButton