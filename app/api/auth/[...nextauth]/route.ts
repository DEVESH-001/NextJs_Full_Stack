//https://next-auth.js.org/configuration/initialization#route-handlers-app
import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
