"use client"
import React from 'react'
import { signOut, useSession } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from './ui/button'
import Link from 'next/link'

const Navbar = () => {
    const { data: session } = useSession();
    const user: User = session?.user as User;
    
    if (!session) return null;
  return (
   <nav className='shadow-md p-6 md:p-6'>
     <div className='container max-auto flex flex-col md:flex-row justify-between items-center'>
        <a href='#' className='text-xl font-bold mb-4 md:mb-0'>Mystry Message</a>
       {
        session ? (
            <>
            <span className='mr-4'>Welcome {user?.username || user?.email}</span>
            <Button className='w-full md:w-auto' onClick={() => signOut()}>Logout</Button>
            </>
        ) : (
            <>
            <Link href={"/sign-in"}>Login</Link>
            </>
        )
       } 
        
    </div>
   </nav>
  )
}

export default Navbar