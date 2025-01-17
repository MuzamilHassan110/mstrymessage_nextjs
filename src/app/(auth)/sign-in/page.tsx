"use client"
import { useSession, signIn, signOut } from "next-auth/react"

export default function Component() {
  const { data: session } = useSession()
  if (session) {
    return (
      <>
        Signed in as {console.log(session.user.email)} <br />
        <button className="px-4 py-2 bg-pink-600 font-semibold rounded-md" onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  return (
    <>
      Not signed in <br />
      <button className="px-4 py-2 bg-pink-600 font-semibold rounded-md hover:bg-green-500 hover:text-teal-100" onClick={() => signIn()}>Sign in</button>
    </>
  )
}