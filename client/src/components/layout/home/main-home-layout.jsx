import { useState } from "react";
import { Outlet } from "react-router-dom";
import { GiftMeHeader } from "../home/header-home-layout";
import { GiftMeFooter } from "../home/footer-home-layout";
import config from "@/bot/config";
import MessageParser from "@/bot/MessageParser";
import ActionProvider from "@/bot/ActionProvider";
import Chatbot from "react-chatbot-kit";
import "react-chatbot-kit/build/main.css";

export const HomeLayout = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative min-h-screen flex flex-col">
      <GiftMeHeader />

      {/* Nội dung chính */}
      <div className="flex-1">
        <Outlet />
      </div>

      <GiftMeFooter />

      {/* Chatbot toggle */}
      <div className="fixed bottom-4 right-4 z-50">
        {isOpen ? (
          <div className="w-80 shadow-lg">
            <Chatbot
              config={config}
              messageParser={MessageParser}
              actionProvider={ActionProvider}
            />
            {/* nút đóng */}
            <button
              onClick={() => setIsOpen(false)}
              className="bg-red-500 text-white w-full py-1 rounded-b-lg"
            >
              Thu gọn
            </button>
          </div>
        ) : (
          /* nút mở */
          <button
            onClick={() => setIsOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg"
          >
            💬 Chat
          </button>
        )}
      </div>
    </div>
  );
};
