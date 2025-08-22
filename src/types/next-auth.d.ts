import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id?: string
      name?: string | null
      email?: string | null
      image?: string | null
      userName?: string
      userPhone?: string
      userDatas?: Date[]
      isNewUser?: boolean
    }
  }

  interface User {
    userName?: string
    userPhone?: string
    userDatas?: Date[]
    isNewUser?: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userName?: string
    userPhone?: string
    userDatas?: Date[]
    isNewUser?: boolean
  }
}
