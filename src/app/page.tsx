import React from 'react'
import { getServerSession } from "next-auth/next"
import { authOptions } from './api/auth/[...nextauth]/options'
const page = async() => {
  const session = await getServerSession(authOptions)
  return <pre>{JSON.stringify(session, null, 2)}</pre>
}

export default page