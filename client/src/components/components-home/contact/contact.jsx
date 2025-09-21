import React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    MessageCircle,
    Facebook,
    Phone,
    Mail,
    MapPin,
    Clock,
    Send,
    CheckCircle,
    Users,
    Award,
    Shield,
} from "lucide-react"

// TikTok Icon Component
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

export const Contact = () => {
    const handleContactClick = (platform) => {
        const links = {
            zalo: "https://zalo.me/0988156786",
            facebook: "https://www.facebook.com/share/1Ayd5AzgqG/?mibextid=wwXIfr",
            tiktok: "https://www.tiktok.com/@giftme.official?_t=ZS-8zskPxtohho&_r=1",
            phone: "tel:0988156786",
            email: "mailto:contact@giftme.vn",
        }

        if (platform === "phone" || platform === "email") {
            window.location.href = links[platform]
        } else {
            window.open(links[platform], "_blank", "noopener,noreferrer")
        }
    }

    return (
        <div className="min-h-screen bg-background">
            <main>
                {/* Hero Section with bg-pink-500 */}
                <section className="relative bg-pink-500 py-20">
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-pink-600 to-pink-700"></div>
                    <div className="container mx-auto px-4 relative z-10">
                        <div className="text-center space-y-8 text-white">
                            <div className="space-y-4">
                                <Badge className="bg-white text-pink-500 px-4 py-2 text-sm font-medium">✨ Liên Hệ Với Chúng Tôi</Badge>
                                <h1 className="text-5xl lg:text-6xl font-bold leading-tight text-balance">
                                    Hỗ Trợ Tư Vấn
                                    <span className="block">Miễn Phí 24/7</span>
                                </h1>
                                <p className="text-xl opacity-90 leading-relaxed text-pretty max-w-3xl mx-auto">
                                    Đội ngũ chuyên gia của GiftMe luôn sẵn sàng hỗ trợ bạn tạo ra những combo quà tặng ý nghĩa và độc đáo.
                                    Liên hệ ngay để được tư vấn miễn phí!
                                </p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 max-w-4xl mx-auto">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-white">24/7</div>
                                    <div className="text-sm text-white opacity-90">Hỗ trợ không ngừng</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-white">2-4h</div>
                                    <div className="text-sm text-white opacity-90">Giao hàng nội thành</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-white">58/58</div>
                                    <div className="text-sm text-white opacity-90">Tỉnh thành phủ sóng</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact Methods */}
                <section className="py-16 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Kênh Liên Hệ Chính Thức</h2>
                            <p className="text-lg text-gray-600">Chọn cách thức liên hệ phù hợp với bạn</p>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <Card
                                className="text-center p-6 border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
                                onClick={() => handleContactClick("zalo")}
                            >
                                <CardContent className="space-y-4">
                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto group-hover:bg-blue-200 transition-colors">
                                        <MessageCircle className="w-8 h-8 text-blue-500" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900">Chat Zalo</h3>
                                    <p className="text-gray-600">0988156786</p>
                                    <p className="text-sm text-gray-500">Phản hồi nhanh nhất</p>
                                </CardContent>
                            </Card>

                            <Card
                                className="text-center p-6 border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
                                onClick={() => handleContactClick("phone")}
                            >
                                <CardContent className="space-y-4">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto group-hover:bg-green-200 transition-colors">
                                        <Phone className="w-8 h-8 text-green-500" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900">Hotline</h3>
                                    <p className="text-gray-600">0988156786</p>
                                    <p className="text-sm text-gray-500">Tư vấn trực tiếp</p>
                                </CardContent>
                            </Card>

                            <Card
                                className="text-center p-6 border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
                                onClick={() => handleContactClick("facebook")}
                            >
                                <CardContent className="space-y-4">
                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto group-hover:bg-blue-200 transition-colors">
                                        <Facebook className="w-8 h-8 text-blue-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900">Facebook</h3>
                                    <p className="text-gray-600">@giftme.official</p>
                                    <p className="text-sm text-gray-500">Messenger hỗ trợ</p>
                                </CardContent>
                            </Card>

                            <Card
                                className="text-center p-6 border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
                                onClick={() => handleContactClick("tiktok")}
                            >
                                <CardContent className="space-y-4">
                                    <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto group-hover:bg-pink-200 transition-colors">
                                        <TikTokIcon className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900">TikTok</h3>
                                    <p className="text-gray-600">@giftme.official</p>
                                    <p className="text-sm text-gray-500">Xem sản phẩm mới</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-16 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Câu Hỏi Thường Gặp</h2>
                            <p className="text-lg text-gray-600">Những thắc mắc phổ biến về dịch vụ của chúng tôi</p>
                        </div>
                        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
                            {[
                                {
                                    question: "Thời gian giao hàng là bao lâu?",
                                    answer: "Nội thành TP.HCM và Hà Nội: 2-4 giờ. Các tỉnh thành khác: 1-3 ngày làm việc.",
                                },
                                {
                                    question: "Có thể tùy chỉnh combo quà tặng không?",
                                    answer: "Có, chúng tôi thiết kế combo theo yêu cầu riêng với mọi ngân sách và dịp đặc biệt.",
                                },
                                {
                                    question: "Chính sách đổi trả như thế nào?",
                                    answer: "Hoàn tiền 100% nếu không hài lòng trong vòng 24h sau khi nhận hàng.",
                                },
                                {
                                    question: "Có hỗ trợ giao hàng toàn quốc không?",
                                    answer:
                                        "Có, chúng tôi giao hàng đến 58 tỉnh thành trên toàn quốc với đội ngũ vận chuyển chuyên nghiệp.",
                                },
                                {
                                    question: "Làm sao để theo dõi đơn hàng?",
                                    answer: "Bạn sẽ nhận được mã tracking qua Zalo/SMS để theo dõi tình trạng đơn hàng real-time.",
                                },
                                {
                                    question: "Có tư vấn miễn phí không?",
                                    answer: "Có, đội ngũ tư vấn viên hỗ trợ 24/7 qua Zalo, Facebook, TikTok và hotline miễn phí.",
                                },
                            ].map((faq, index) => (
                                <Card key={index} className="p-6 border-0 shadow-md hover:shadow-lg transition-shadow bg-white">
                                    <CardContent className="space-y-3">
                                        <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                                        <p className="text-gray-600">{faq.answer}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section with bg-pink-500 */}
                <section className="py-20 bg-pink-500 text-white relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-pink-600"></div>
                    <div className="container mx-auto px-4 text-center relative z-10">
                        <div className="max-w-3xl mx-auto space-y-8">
                            <h2 className="text-4xl font-bold text-white">Sẵn Sàng Tạo Combo Quà Tặng Độc Đáo?</h2>
                            <p className="text-xl text-white opacity-90">
                                Đừng chần chừ! Liên hệ ngay để được tư vấn miễn phí và nhận ưu đãi đặc biệt cho đơn hàng đầu tiên.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
                                <Button
                                    size="lg"
                                    className="bg-white text-pink-600 hover:bg-gray-100 flex-1"
                                    onClick={() => handleContactClick("zalo")}
                                >
                                    <MessageCircle className="w-5 h-5 mr-2" />
                                    Chat Zalo Ngay
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="border-2 border-white text-white hover:bg-white hover:text-pink-600 flex-1 bg-transparent"
                                    onClick={() => handleContactClick("phone")}
                                >
                                    <Phone className="w-5 h-5 mr-2" />
                                    Gọi Hotline
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}