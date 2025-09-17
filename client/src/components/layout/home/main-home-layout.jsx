import { Outlet } from "react-router-dom"
import { GiftMeHeader } from "../home/header-home-layout"
import { GiftMeFooter } from "../home/footer-home-layout"
import { Chatbot } from "@/bot/modern-chatbot"

export const HomeLayout = () => {
    return (
        <div className="relative min-h-screen flex flex-col bg-background">
            <GiftMeHeader />
            <main className="flex-grow p-4 md:p-6">
                <Outlet />
            </main>

            <Chatbot />

            <GiftMeFooter />
        </div>
    )
}
