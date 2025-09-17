import { Outlet } from "react-router-dom";
import { GiftMeHeader } from "../home/header-home-layout";
import { GiftMeFooter } from "../home/footer-home-layout";
import config from "@/bot/config";
import MessageParser from "@/bot/MessageParser";
import ActionProvider from "@/bot/ActionProvider";
import Chatbot from "react-chatbot-kit";
import "react-chatbot-kit/build/main.css";

export const HomeLayout = () => {
  return (
    <div className="relative min-h-screen flex flex-col">
      <GiftMeHeader />

      {/* Nội dung chính */}
      <div className="flex-1">
        <Outlet />
      </div>

      <GiftMeFooter />

      {/* Chatbot */}
      <div className="fixed bottom-4 right-4 z-50 w-80">
        <Chatbot
          config={config}
          messageParser={MessageParser}
          actionProvider={ActionProvider}
        />
      </div>
    </div>
  );
};
