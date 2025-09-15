import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export const Header = ({ logout }) => {
    return (
        <header className="border-b bg-card">
            <div className="px-4 py-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Dashboard</h2>
                    <Button variant="ghost" size="sm" onClick={logout}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Đăng xuất
                    </Button>
                </div>
            </div>
        </header>
    );
};