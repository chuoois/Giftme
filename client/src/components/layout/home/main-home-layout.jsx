import { Outlet } from "react-router-dom"
import { GiftMeHeader } from "../home/header-home-layout"
import { GiftMeFooter } from "../home/footer-home-layout"
import { Chatbot } from "@/bot/modern-chatbot"

export const HomeLayout = () => {
    return (
        <div>
            <GiftMeHeader />
            <Outlet />
            <Chatbot />
            <GiftMeFooter />
        </div>
    )
}
