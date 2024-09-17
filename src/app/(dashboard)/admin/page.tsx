import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"

const page = async () => {
  const session = await getServerSession(authOptions);
  
  if (session?.user) {
    return <h2> Welcome Back {session?.user.username}</h2> 
  }

  return (
    <div>Please Login</div>
  )
}

export default page