import { Outlet } from "react-router-dom";
import { GiftMeHeader } from "../home/header-home-layout";
import { GiftMeFooter } from "../home/footer-home-layout";

export const HomeLayout = () => {
    return (
        <div>
            <GiftMeHeader />
            <Outlet />
            <GiftMeFooter />
        </div>
    );
};