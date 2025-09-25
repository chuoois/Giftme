import { Search, Facebook, MessageCircle, Package, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Link } from "react-router-dom"

const TikTokIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={className}
    fill="none"
  >
    <defs>
      {/* Gradients cho hiệu ứng màu TikTok */}
      <linearGradient id="tiktok-red" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF0050" />
        <stop offset="100%" stopColor="#FF4458" />
      </linearGradient>
      <linearGradient id="tiktok-blue" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00F2EA" />
        <stop offset="100%" stopColor="#25F4EE" />
      </linearGradient>
    </defs>
    
    {/* Lớp đỏ (background) */}
    <g transform="translate(1, 1)">
      <path
        d="M19.321 5.562a5.122 5.122 0 01-3.077-1.028 5.077 5.077 0 01-1.892-2.687V1.5h-3.67v14.72a3.093 3.093 0 11-2.202-2.972V9.608a6.738 6.738 0 00-1.028-.078A6.844 6.844 0 00.608 16.374 6.844 6.844 0 007.452 23.218a6.844 6.844 0 006.844-6.844V8.486a8.653 8.653 0 005.025 1.607V6.422a5.122 5.122 0 01-.86-.86z"
        fill="url(#tiktok-red)"
      />
    </g>
    
    {/* Lớp xanh (middle) */}
    <g transform="translate(-1, -1)">
      <path
        d="M19.321 5.562a5.122 5.122 0 01-3.077-1.028 5.077 5.077 0 01-1.892-2.687V1.5h-3.67v14.72a3.093 3.093 0 11-2.202-2.972V9.608a6.738 6.738 0 00-1.028-.078A6.844 6.844 0 00.608 16.374 6.844 6.844 0 007.452 23.218a6.844 6.844 0 006.844-6.844V8.486a8.653 8.653 0 005.025 1.607V6.422a5.122 5.122 0 01-.86-.86z"
        fill="url(#tiktok-blue)"
      />
    </g>
    
    {/* Lớp đen (foreground) */}
    <path
      d="M19.321 5.562a5.122 5.122 0 01-3.077-1.028 5.077 5.077 0 01-1.892-2.687V1.5h-3.67v14.72a3.093 3.093 0 11-2.202-2.972V9.608a6.738 6.738 0 00-1.028-.078A6.844 6.844 0 00.608 16.374 6.844 6.844 0 007.452 23.218a6.844 6.844 0 006.844-6.844V8.486a8.653 8.653 0 005.025 1.607V6.422a5.122 5.122 0 01-.86-.86z"
      fill="#000000"
    />
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
                  className="transition-transform duration-200 hover:scale-110"
                >
                  <Facebook className="w-4 h-4 text-blue-600 cursor-pointer hover:text-blue-700" />
                </a>
                {/* TikTok - Improved */}
                <a
                  href="https://www.tiktok.com/@giftme.official"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-transform duration-200 hover:scale-110 hover:drop-shadow-lg"
                >
                  <TikTokIcon className="w-4 h-4 cursor-pointer hover:brightness-110" />
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
              {/* <Link to="/news" className="text-gray-700 hover:text-pink-500 font-medium transition-colors">
                Tin tức
              </Link> */}
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