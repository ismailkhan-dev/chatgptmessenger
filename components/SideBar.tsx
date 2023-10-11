"use client";

import React from "react";
import NewChat from "./NewChat";
import { useSession, signOut } from "next-auth/react";
import { useCollection } from "react-firebase-hooks/firestore";
import { collection, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/firebase";
import ChatBox from "./ChatBox";

function SideBar() {
    const { data: session } = useSession();

    const [chats, loading, error] = useCollection(
        session &&
            query(
                collection(db, "users", session?.user?.email!, "chats"),
                orderBy("createdAt", "asc")
            )
    );

    console.log(chats);

    return (
        <div className="p-2 flex flex-col h-screen ">
            <div className="flex-1">
                {/* NewChat */}
                <NewChat />
                <div>{/* Model Selection */}</div>
                {/* Map through the ChatRows */}
                {chats?.docs.map((chat) => (
                    <ChatBox key={chat.id} id={chat.id} />
                ))}
            </div>

            {session && (
                <img
                    onClick={() => signOut()}
                    src={session.user?.image!}
                    alt="User profile picture"
                    className="h-12 w-12 rounded-full cursor-pointer mx-auto mb-2 hover:opacity-50"
                />
            )}
        </div>
    );
}

export default SideBar;
