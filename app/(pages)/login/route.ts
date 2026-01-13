import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),

        FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID!,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
        }),
    ],

    callbacks: {
        async signIn({ user, account }) {

            if (account?.provider === "google" || account?.provider === "facebook") {
                await fetch("http://localhost:8080/auth/social-login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        email: user.email,
                        name: user.name,
                        avatar: user.image,
                        provider: account.provider,
                    }),
                });
            }

            return true;
        },
    }
});

export { handler as GET, handler as POST };
