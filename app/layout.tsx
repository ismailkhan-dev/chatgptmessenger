import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "ChatGPT Messenger by Ismail Khan",
    description: "Using Next.js and OpenAI API",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head />
            <body className={inter.className}>
                <div>
                    {/* Sidebar */}
                    {/* ClientProvider - Notification */}

                    <div className="bg-[#343541] flex-1"> {children}</div>
                </div>
            </body>
        </html>
    );
}
