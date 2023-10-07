//any call to /api/auth would be handled by this file ryt here
import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth/next";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
