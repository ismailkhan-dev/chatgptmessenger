"use client";

import NewChat from "./NewChat";
import { useSession, signOut } from "next-auth/react";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/firebase";
import ChatBox from "./ChatBox";
import ModelSelection from "./ModelSelection";
import Image from "next/image";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid";

function SideBar() {
    const { data: session } = useSession();

    const [chats, loading, error] = useCollection(
        session &&
            query(
                collection(db, "users", session?.user?.email!, "chats"),
                orderBy("createdAt", "asc")
            )
    );

    return (
        <div className="p-2 flex flex-col h-screen">
            <div className="flex-1">
                {/* NewChat */}
                <NewChat />

                <div className="hidden sm:inline">
                    <ModelSelection defaultValue="text-davinci-003" />
                </div>

                {/* Map through the ChatRows */}
                {chats?.docs.map((chat) => (
                    <ChatBox key={chat.id} id={chat.id} />
                ))}
            </div>

            {/* Login/Logout */}
            {session && (
                <div
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex items-center space-x-2 rounded-lg txt-sm text-gray-300 cursor-pointer hover:bg-gray-700/70 transition-all duration-300 ease-out px-3 py-3 justify-between"
                >
                    <div className="flex space-x-2 items-center justify-center">
                        <ArrowRightOnRectangleIcon className="h-4 w-4 text-gray-500" />
                        <p className="text-gray-300">Log out</p>
                    </div>

                    <Image
                        src={session.user?.image!}
                        height={100}
                        width={100}
                        alt="User profile picture"
                        className="h-5 w-5 rounded-full"
                        unoptimized
                        priority
                    />
                </div>
            )}
        </div>
    );
}

export default SideBar;
