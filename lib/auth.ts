//https://next-auth.js.org/getting-started/example
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "./db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  // Add your NextAuth.js configuration options here
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Username",
          type: "text",
          placeholder: "devesh@gmail.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // You can add your own logic here to validate the user credentials
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }
        try {
          await connectToDatabase();
          const user = await User.findOne({ email: credentials.email });
          if (!user) {
            throw new Error("No user found with the given email");
          }
          // verify the password here (using bcrypt), because passwords are hashed
          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isValid) {
            throw new Error("Invalid password");
          }
          return { id: user._id.toString(), email: user.email };
        } catch (error) {
          console.log("Auth error", error);
          throw new Error("Error logging in user: " + (error as Error).message);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; //if user has id, add it to the token
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string; //add the id from token to session user
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};
