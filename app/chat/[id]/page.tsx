"use client";
import { db } from "@/firebase/firebase";
import {
    ArrowDownCircleIcon,
    ArrowDownIcon,
    PaperAirplaneIcon,
    PlusCircleIcon,
} from "@heroicons/react/24/solid";
import {
    addDoc,
    collection,
    orderBy,
    query,
    serverTimestamp,
} from "firebase/firestore";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import toast from "react-hot-toast";
import ScrollableFeed from "react-scrollable-feed";
import ReactTextareaAutosize from "react-textarea-autosize";

type Props = {
    params: {
        id: string;
    };
};
function ChatPage({ params: { id } }: Props) {
    const { data: session } = useSession({
        required: true,
    });

    const [prompt, setPrompt] = useState("");
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    const [chatProcessing, setChatProcessing] = useState(false);
    const [chatResponded, setChatResponded] = useState(false);

    const scrollableRef = useRef<ScrollableFeed>(null);
    const [isAtBottom, setIsAtBottom] = useState(true);

    const messageRef = useRef<HTMLDivElement>(null);
    const loadingRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const [chatResponding, setChatResponding] = useState(false);
    const [scrollHeight, setScrollHeight] = useState(
        scrollRef.current?.scrollHeight
    );

    const [messages, loading] = useCollection(
        session &&
            query(
                collection(
                    db,
                    "users",
                    session?.user?.email!,
                    "chats",
                    id,
                    "messages"
                ),
                orderBy("createdAt", "asc")
            )
    );

    useEffect(() => {
        if (scrollableRef.current && isAtBottom) {
            scrollableRef.current.scrollToBottom();
        }

        setTimeout(() => {
            setMounted(true);
        }, 1000);
    }, [messages, isAtBottom, scrollHeight]);

    const model = "gpt-3.5-turbo";

    /**
     * Simulates a real-time typing effect for the bot's response,
     * appending one character at a time to the chat interface.
     * After completion, focus is shifted back to the textarea input.
     */

    const autoTypingBotResponse = (text: string) => {
        let index = 0;

        setChatResponding(true);

        setTimeout(() => {
            let interval = setInterval(() => {
                if (index < text.length) {
                    if (messageRef.current) {
                        messageRef.current.textContent += text.charAt(index);
                        setScrollHeight(scrollRef.current?.scrollHeight);
                    }
                    index++;
                } else {
                    clearInterval(interval);

                    setChatResponding(false);

                    setTimeout(() => {
                        textareaRef.current?.focus();
                    }, 10);
                }
            }, 9);
        }, 21);
    };

    // If the last message is from "Ismail" and chat responded, simulate the typing effect.

    if (
        chatResponded &&
        messages?.docs[messages?.docs.length - 1]?.data()?.sender === "Chat"
    ) {
        autoTypingBotResponse(
            messages?.docs[messages?.docs.length - 1]?.data()?.text.trimStart()
        );

        setChatResponded(false);
    }

    const sendMessage = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!prompt) return;

        const input = prompt.trim();

        if (input === "") return;

        setPrompt("");
        setChatProcessing(true);

        const message: Message = {
            text: input,
            createdAt: serverTimestamp(),
            user: {
                _id: session?.user?.email,
                name: session?.user?.name,
                avatar:
                    session?.user?.image ||
                    `https://ui-avatars.com/api/?name=${session?.user?.name}`,
            },
        };

        await addDoc(
            collection(
                db,
                "users",
                session?.user?.email!,
                "chats",
                id,
                "messages"
            ),
            message
        );

        //Toast Notification while processing...
        const notification = toast.loading("Chat is processing...");

        const chatContext = messages?.docs.map((message) => {
            return {
                role:
                    message.data().user.name === "Chat" ? "assistant" : "user",
                content: message.data().text.trim() as string,
            };
        }) as GPTMessage[];

        // remember last 10 messages
        const last10Messages = chatContext?.slice(-10);

        const outboundMessages = [
            ...(last10Messages as GPTMessage[]),
            { role: "user", content: input } as GPTMessage,
        ];

        await fetch("/api/prompt", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                prompt: input,
                outboundMessages,
                id,
                model,
                session,
            }),
        })
            .then((response) => {
                return response.json();
            })
            .then(() => {
                setChatProcessing(false);
                setChatResponded(true);

                // Toast notification when successful!
                toast.success("Chat has responded!", {
                    id: notification,
                });
            });
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();

            sendMessage(e as unknown as FormEvent<HTMLFormElement>);
        }
    };

    const updateIsAtBottomState = (result: boolean) => {
        setIsAtBottom(result);
    };

    const scrollToBottom = () => {
        scrollableRef.current?.scrollToBottom();

        if (chatResponding) {
            setIsAtBottom(true);
        }
    };

    const createChat = async () => {
        if (!messages?.empty) {
            const doc = await addDoc(
                collection(db, "users", session?.user?.email!, "chats"),
                {
                    // messages: [],
                    userId: session?.user?.email!,
                    createdAt: serverTimestamp(),
                }
            );

            router.push(`/chat/${doc.id}`);
        }
    };

    return (
        <div
            className="flex flex-col overflow-hidden"
            style={{ height: "100svh" }}
        >
            {/* <div className="sticky top-0 md:hidden bg-[#343541] h-11 border-b border-[#2C2D36] w-full shadow-sm">
                <div className="flex relative items-center text-gray-300 h-full">
                    <div className="w-[16rem] inset-y-0 m-auto">
                        <p className="relative text-center text-base truncate">
                            {mounted &&
                                (messages?.docs[
                                    messages?.docs.length - 1
                                ]?.data().text ||
                                    "New Chat")}

                            <span
                                className={`absolute inset-y-0 right-0 w-9 h-7 z-10 bg-gradient-to-l opacity-90 from-[#343541]`}
                            />
                        </p>
                    </div>

                    <button onClick={createChat} className="absolute right-5">
                        <PlusCircleIcon className="h-6 w-6" />
                    </button>
                </div>
            </div> */}

            {/* Chat */}

            <ScrollableFeed
            // ref={scrollableRef}
            // onScroll={(isAtBottom: boolean) =>
            //     updateIsAtBottomState(isAtBottom)
            // }
            // className={`flex-1 ${
            //     !isAtBottom && "scroll-smooth"
            // } scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-[#202123] scrollbar-thumb-rounded-lg`}
            >
                <div
                    id="scrollDiv"
                    ref={scrollRef}
                    className="overflow-y-auto overflow-x-hidden"
                >
                    {messages?.empty && (
                        <>
                            <p className="text-white dark:text-gray-300 text-lg md:text-xl text-center mt-10">
                                Type in a prompt below below to get started!
                            </p>
                            <ArrowDownCircleIcon className="text-white dark:text-gray-300 h-9 w-9 animate-bounce mx-auto mt-5" />
                        </>
                    )}

                    {loading && <div className="dot-spin m-auto mt-52"></div>}

                    {/* Message */}
                    {messages?.docs.map((message, i) => {
                        const isChat = message.data().user.name === "Chat";
                        const avatarSrc = isChat
                            ? "/chatgpt-logo.png"
                            : message.data().user.avatar;

                        return (
                            <div
                                key={i}
                                className={`flex ${
                                    isChat && "bg-[#434654]"
                                } text-white py-5 max-w-4xl mx-auto space-x-5 px-10`}
                            >
                                <div className="shrink-0 object-cover">
                                    <Image
                                        unoptimized
                                        src={avatarSrc}
                                        height={100}
                                        width={100}
                                        alt="avatar"
                                        className="h-8 w-8 rounded-sm m-2"
                                    />
                                </div>

                                <div className="max-w-2xl pt-2">
                                    <p
                                        ref={messageRef}
                                        className="text-base whitespace-pre-wrap"
                                    >
                                        {isChat &&
                                        i === messages?.docs.length - 1 &&
                                        chatResponding
                                            ? null
                                            : message.data().text.trimStart()}
                                    </p>
                                </div>
                            </div>
                        );
                    })}

                    {!isAtBottom && (
                        <div className="absolute bottom-32 right-5 lg:bottom-36 xl:right-24">
                            <button
                                type="button"
                                onClick={scrollToBottom}
                                disabled={isAtBottom}
                                className={`${
                                    isAtBottom && "hidden"
                                } inline-flex items-center p-2 rounded-full shadow-sm bg-gray-300 bg-opacity-70 active:bg-gray-500 dark:bg-gray-500 dark:bg-opacity-70 dark:active:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none`}
                            >
                                <ArrowDownIcon
                                    className="h-3 w-3"
                                    aria-hidden="true"
                                />
                            </button>
                        </div>
                    )}
                </div>
            </ScrollableFeed>

            {/* ChatPrompt */}
            <div className="bg-gray-300 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 rounded-lg text-sm mx-7 xl:mx-40 my-7 xl:my-10">
                <form
                    onSubmit={sendMessage}
                    className="flex items-center bg-white dark:bg-gray-700 shadow-lg rounded-lg space-x-5 p-3"
                >
                    <ReactTextareaAutosize
                        ref={textareaRef}
                        name="prompt"
                        autoComplete="off"
                        autoFocus
                        value={prompt}
                        rows={1}
                        maxRows={3}
                        onChange={(e) => setPrompt(e.target.value)}
                        disabled={!session || chatProcessing || chatResponding}
                        className="flex-1 bg-transparent text-base break-words focus:outline-none disabled:cursor-not-allowed disabled:text-gray-300 overflow-y-auto resize-none scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-rounded-lg"
                        placeholder="Send a message..."
                        onKeyDown={handleKeyDown}
                    />

                    <button
                        type="submit"
                        disabled={!session || !prompt || chatProcessing}
                        className={`bg-[#11A37F] ${
                            chatProcessing &&
                            "disabled:bg-[#11A37F] disabled:cursor-not-allowed"
                        } text-white ${
                            !chatProcessing &&
                            "active:bg-[#0C6952] disabled:bg-gray-300 disabled:active:bg-gray-300 dark:disabled:bg-gray-900/10 dark:disabled:active:bg-gray-900/10 disabled:cursor-not-allowed disabled:hover:opacity-100"
                        } self-end font-bold rounded px-3 py-2 h-7`}
                    >
                        {chatProcessing ? (
                            <span ref={loadingRef} className="loading"></span>
                        ) : (
                            <PaperAirplaneIcon className="h-3 w-3 -rotate-45" />
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ChatPage;
