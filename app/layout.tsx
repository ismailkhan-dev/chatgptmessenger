import SideBar from "@/components/SideBar";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Session, getServerSession } from "next-auth";
import { SessionProvider } from "@/components/SessionProvider";
import Login from "@/components/Login";
import ClientProvider from "@/components/ClientProvider";
import { authOptions } from "./api/auth/[...nextauth]/route";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "ChatGPT Messenger by Ismail Khan",
    description: "Generative AI Language Model",
    icons: {
        icon: "/public/favicon.ico",
    },
};

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    return (
        <html lang="en">
            <head />

            <body className={inter.className}>
                <SessionProvider session={session}>
                    {!session ? (
                        <Login />
                    ) : (
                        <div className="flex">
                            {/* Sidebar */}
                            <div className="bg-[#202123] max-w-xs h-screen overflow-y-auto md:min-w-[20rem]">
                                <SideBar />
                            </div>

                            {/* ClientProvider - Notification */}
                            <ClientProvider />

                            <div className="bg-[#343541] flex-1">
                                {children}
                            </div>
                        </div>
                    )}
                </SessionProvider>
            </body>
        </html>
    );
}
