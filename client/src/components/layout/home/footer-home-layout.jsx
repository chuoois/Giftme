import { Gift, Phone, Mail, MapPin, Facebook, Instagram, MessageCircle } from "lucide-react"

export const GiftMeFooter = () => {
  return (
    <footer className="bg-white text-gray-800 relative border-t border-gray-200">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Gift className="w-6 h-6 text-pink-500" />
              <span className="text-xl font-bold text-gray-900">GiftMe</span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Nền tảng quà tặng hàng đầu Việt Nam, mang đến những món quà ý nghĩa cho mọi dịp đặc biệt.
            </p>
            <div className="flex items-center gap-3">
              <Facebook className="w-5 h-5 text-gray-500 cursor-pointer hover:text-pink-500 transition-colors" />
              <Instagram className="w-5 h-5 text-gray-500 cursor-pointer hover:text-pink-500 transition-colors" />
              <MessageCircle className="w-5 h-5 text-gray-500 cursor-pointer hover:text-pink-500 transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Liên kết nhanh</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-600 hover:text-pink-500 transition-colors">
                  Trang chủ
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-pink-500 transition-colors">
                  Combo quà tặng
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-pink-500 transition-colors">
                  Theo dịp
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-pink-500 transition-colors">
                  Tùy chỉnh
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-pink-500 transition-colors">
                  Tin tức
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Hỗ trợ khách hàng</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-600 hover:text-pink-500 transition-colors">
                  Chính sách đổi trả
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-pink-500 transition-colors">
                  Hướng dẫn đặt hàng
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-pink-500 transition-colors">
                  Câu hỏi thường gặp
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-pink-500 transition-colors">
                  Bảo mật thanh toán
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-pink-500 transition-colors">
                  Điều khoản sử dụng
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Thông tin liên hệ</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-pink-500" />
                <span className="text-gray-600">1900-GIFT (4438)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-pink-500" />
                <span className="text-gray-600">support@giftme.vn</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-pink-500 mt-0.5" />
                <span className="text-gray-600">
                  123 Đường ABC, Quận 1<br />
                  TP. Hồ Chí Minh, Việt Nam
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <p>&copy; 2024 GiftMe. Tất cả quyền được bảo lưu.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-pink-500 transition-colors">
                Chính sách bảo mật
              </a>
              <a href="#" className="hover:text-pink-500 transition-colors">
                Điều khoản dịch vụ
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
