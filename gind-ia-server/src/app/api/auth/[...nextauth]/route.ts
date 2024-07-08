import NextAuth from "next-auth"
import KeycloakProvider from "next-auth/providers/keycloak";

const handler = NextAuth({
  secret: "KAZvWlw9HWbY6y8N1EE/iacgH8Z0zND2nIcaplJQW2s=",
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_ID||"",
      clientSecret: process.env.KEYCLOAK_SECRET||"",
      issuer: process.env.KEYCLOAK_ISSUER,
    })
  ]
})

console.log("===========================================")
console.log(process.env.KEYCLOAK_ISSUER)

export { handler as GET, handler as POST }

