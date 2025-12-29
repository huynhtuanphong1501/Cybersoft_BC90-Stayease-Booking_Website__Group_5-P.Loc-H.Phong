"use client";

import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchChatBot } from "./slice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faRobot, faXmark } from "@fortawesome/free-solid-svg-icons";

const BotChat = () => {
    const dispatch = useDispatch();
    const stateChatBot = useSelector((state: any) => state.botChatReducer);
    const { dataBotChat } = stateChatBot;

    const [showChatBot, setShowChatBot] = useState(false);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<{ from: string; text: string }[]>([]);

    const chatRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        dispatch(fetchChatBot());
    }, [dispatch]);

    useEffect(() => {
        if (!showChatBot) {
            setMessages([]);
            setMessage("");
            return;
        }

        if (messages.length > 0) return;

        setTimeout(() => {
            setMessages([{ from: "bot", text: "Hi 👋" }]);

            setTimeout(() => {
                setMessages((prev) => [
                    ...prev,
                    {
                        from: "bot",
                        text: "I’m your movie assistant. I can help you book tickets, check schedules, or movie info 🎬",
                    },
                ]);
            }, 1000);
        }, 1000);
    }, [showChatBot]);

    const getBotReply = (userMessage: string) => {
        const msg = userMessage.toLowerCase().trim();
        const intents = dataBotChat?.filter((item: any) => item.type === "chatbot_intent");

        for (const intent of intents || []) {
            if (intent.keywords.some((keyword: string) => msg.includes(keyword))) {
                return intent.reply;
            }
        }

        return "Sorry, I didn’t quite understand that. Could you rephrase? 🤔";
    };

    const sendMessage = () => {
        if (!message.trim()) return;

        const userText = message;
        setMessages((prev) => [...prev, { from: "user", text: userText }]);
        setMessage("");

        setTimeout(() => {
            setMessages((prev) => [...prev, { from: "bot", text: getBotReply(userText) }]);
            chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
        }, 800);
    };

    return (
        <>
            <button
                onClick={() => setShowChatBot(true)}
                className="
          fixed bottom-[30%] lg:bottom-[15%] right-[2.5%]
          w-12 h-12 lg:w-14 lg:h-14
          bg-red-500 text-white
          flex items-center justify-center
          rounded-xl
          shadow-lg shadow-red-500/40
          hover:bg-red-600 hover:scale-110
          transition-all duration-300
          cursor-pointer
          z-20
        "
            >
                <FontAwesomeIcon icon={faRobot} className="text-2xl" />
            </button>

            {showChatBot && (
                <div
                    className="
            fixed bottom-[40%] lg:bottom-[25%] right-[2.5%]
            w-[85%] sm:w-[60%] md:w-[40%]
            bg-[#111]
            rounded-2xl
            shadow-2xl
            overflow-hidden
            z-20
          "
                >
                    <div className="flex items-center justify-between px-4 py-3 bg-red-500 text-white">
                        <span className="font-semibold select-none">FeelDiamondCine Bot</span>
                        <button onClick={() => setShowChatBot(false)}>
                            <FontAwesomeIcon icon={faXmark} className="text-lg" />
                        </button>
                    </div>

                    <div
                        ref={chatRef}
                        className="h-64 overflow-y-auto px-3 py-3 space-y-3 text-sm bg-[#111]"
                    >
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`px-4 py-2 rounded-2xl max-w-[80%] leading-relaxed ${msg.from === "user" ? "bg-red-500 text-white" : "bg-[#2a2a2a] text-gray-100"
                                        }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 px-3 py-3 bg-[#1a1a1a]">
                        <input
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                            placeholder="Type your message..."
                            className="
                flex-1 px-4 py-2
                rounded-xl
                bg-[#222] text-white
                text-sm
                outline-none
              "
                        />
                        <button
                            onClick={sendMessage}
                            className="
                px-4 py-2
                bg-red-500 rounded-xl
                hover:bg-red-600
                transition
                cursor-pointer
              "
                        >
                            <FontAwesomeIcon icon={faPaperPlane} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default BotChat;
