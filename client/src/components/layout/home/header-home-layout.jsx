import { Search, Facebook, MessageCircle, Package, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Link } from "react-router-dom"

const TikTokIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 448 512"
    className={className}
    fill="currentColor"
  >
    <path d="M448,209.9c-16.6,7.3-34.4,12.2-53.2,14.4
      c19.1-11.5,33.7-29.7,40.6-51.5c-17.9,10.6-37.8,18.3-59,22.4
      c-16.9-18-41-29.3-67.7-29.3c-51.2,0-92.8,41.6-92.8,92.8
      c0,7.3,0.8,14.4,2.4,21.2c-77.1-3.9-145.5-40.8-191.3-96.9
      c-8,13.8-12.6,29.7-12.6,46.7c0,32.2,16.4,60.7,41.4,77.4
      c-15.2-0.5-29.6-4.7-42.1-11.7c0,0.4,0,0.8,0,1.2
      c0,45,32,82.5,74.5,91c-7.8,2.1-16.1,3.2-24.6,3.2
      c-6,0-11.9-0.6-17.6-1.6c11.9,37.1,46.4,64.2,87.3,65
      c-32,25.1-72.3,40.1-116,40.1c-7.5,0-14.9-0.4-22.2-1.3
      c41.4,26.5,90.6,41.9,143.5,41.9c172.2,0,266.4-142.6,266.4-266.4
      c0-4.1-0.1-8.1-0.3-12.1C421.4,244.6,436.4,228.4,448,209.9z"/>
  </svg>
);


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
                  <TikTokIcon className="w-4 h-4 text-black cursor-pointer hover:text-pink-500" />
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
