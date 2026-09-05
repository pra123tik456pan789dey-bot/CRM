import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "your-super-secret-key-123",
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|login|register|register-employee|forgot-password).*)"],
};

