import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }: any) {
      console.log("jwt", token, account, profile)
      if (account) {
        token.accessToken = account.access_token
        token.login = profile.login
      }
      return token
    },
    async session({ session, token }: any) {
      console.log("session", session, token)
      session.accessToken = token.accessToken
      session.user.login = token.login
      return session
    }
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
