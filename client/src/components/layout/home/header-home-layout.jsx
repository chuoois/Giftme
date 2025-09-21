import { Search, Facebook, MessageCircle, Package, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Link } from "react-router-dom"

export const GiftMeHeader = () => {
  return (
    <header className="w-full">
      {/* Top Bar */}
      <div className="bg-muted border-b">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-6">
              {/* Zalo thay cho Hotline */}
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-blue-500" />
                <a href="tel:0988156786" className="hover:text-pink-500">
                  Zalo: 0988156786
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                <span>Giao hàng 2-4h trong nội thành</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4" />
                <span>Miễn phí gói quà</span>
              </div>
              <div className="flex items-center gap-3">
                {/* Facebook */}
                <a
                  href="https://www.facebook.com/share/1Ayd5AzgqG/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Facebook className="w-4 h-4 text-blue-600 cursor-pointer hover:text-blue-700" />
                </a>

                {/* TikTok */}
                <a
                  href="https://www.tiktok.com/@giftme.official?_t=ZS-8zskPxtohho&_r=1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {/* Icon tạm, có thể thay bằng SVG TikTok custom */}
                  <MessageCircle className="w-4 h-4 text-black cursor-pointer hover:text-gray-700" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="bg-card border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center">
                  <Gift className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold text-pink-500">GiftMe</span>
              </Link>
            </div>

            {/* Navigation Menu */}
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-gray-700 hover:text-pink-500 font-medium transition-colors">
                Trang chủ
              </Link>
              <Link to="/combo" className="text-gray-700 hover:text-pink-500 font-medium transition-colors">
                Combo quà tặng
              </Link>
              <Link to="/news" className="text-gray-700 hover:text-pink-500 font-medium transition-colors">
                Tin tức
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-pink-500 font-medium transition-colors">
                Liên hệ
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
}
