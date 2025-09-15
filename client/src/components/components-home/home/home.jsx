import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Gift,
  MessageCircle,
  Facebook,
  Instagram,
  Phone,
  ArrowRight,
  Clock,
  Award,
  Shield,
  Truck,
  Users,
  CheckCircle,
  MapPin,
} from "lucide-react";
import { comboService } from "@/services/combo.services";
import { contentService } from "@/services/content.services";

export const Home = () => {
  const [products, setProducts] = useState([]);
  const [enabledContent, setEnabledContent] = useState(null);
  const [loadingContent, setLoadingContent] = useState(true);

  const fetchHotCombos = async () => {
    try {
      const data = await comboService.getHotCombos();
      setProducts(data.data);
    } catch (error) {
      console.error("Error fetching hot combos:", error);
    }
  };

  const fetchEnabledContent = async () => {
    try {
      setLoadingContent(true);
      const data = await contentService.getEnabledContent();
      setEnabledContent(data);
    } catch (error) {
      console.error("Error fetching enabled content:", error);
    } finally {
      setLoadingContent(false);
    }
  };

  useEffect(() => {
    fetchHotCombos();
    fetchEnabledContent();
  }, []);

  const handleContactClick = (platform) => {
    const links = {
      zalo: "https://zalo.me/0901234567",
      facebook: "https://facebook.com/giftme.vietnam",
      instagram: "https://instagram.com/giftme.vietnam",
      phone: "tel:19006438",
    };

    if (platform === "phone") {
      window.location.href = links[platform];
    } else {
      window.open(links[platform], "_blank", "noopener,noreferrer");
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-background">
      <main>
        <section className="relative bg-gradient-to-br from-pink-50 via-white to-gray-50 py-20">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                {loadingContent ? (
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
                    <span className="ml-2 text-gray-600">Đang tải nội dung...</span>
                  </div>
                ) : enabledContent ? (
                  <div className="space-y-4">
                    {enabledContent.tags?.length > 0 && (
                      <Badge className="bg-pink-500 text-white px-4 py-2 text-sm font-medium">
                        {enabledContent.tags[0]}
                      </Badge>
                    )}
                    <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight text-balance">
                      {enabledContent.title.split(" ").map((word, index, arr) => (
                        <span key={index} className={index >= arr.length - 2 ? "text-pink-500" : ""}>
                          {word}{index < arr.length - 1 ? " " : ""}
                        </span>
                      ))}
                    </h1>
                    <p className="text-xl text-gray-600 leading-relaxed text-pretty">
                      {enabledContent.description}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Badge className="bg-pink-500 text-white px-4 py-2 text-sm font-medium">
                      ✨ Combo Quà Tặng Độc Đáo
                    </Badge>
                    <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight text-balance">
                      Quà Tặng Việt Nam
                      <span className="text-pink-500 block">Ý Nghĩa & Tinh Tế</span>
                    </h1>
                    <p className="text-xl text-gray-600 leading-relaxed text-pretty">
                      Thiết kế combo quà tặng theo yêu cầu với tinh thần văn hóa Việt Nam. Giao hàng nhanh 2-4h trong nội
                      thành, phủ sóng toàn quốc 58 tỉnh thành.
                    </p>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 text-lg"
                    onClick={() => handleContactClick("zalo")}
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Tư Vấn Miễn Phí 24/7
                  </Button>
                  <Link to="/combo">
                    <Button
                      variant="outline"
                      size="lg"
                      className="px-8 py-4 text-lg border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white bg-transparent w-full"
                    >
                      Xem Bộ Sưu Tập
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </div>
                <div className="grid grid-cols-3 gap-6 pt-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-pink-500">2000+</div>
                    <div className="text-sm text-gray-600">Khách hàng hài lòng</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-pink-500">58/58</div>
                    <div className="text-sm text-gray-600">Tỉnh thành phủ sóng</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-pink-500">24/7</div>
                    <div className="text-sm text-gray-600">Hỗ trợ tư vấn</div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="relative z-10">
                  <img
                    src={enabledContent?.img}
                    alt={enabledContent?.title}
                    className="w-full h-96 object-cover rounded-2xl shadow-2xl"
                    onError={(e) => {
                      e.target.src = "/placeholder.svg";
                    }}
                  />
                </div>
                <div className="absolute -top-4 -right-4 w-full h-full bg-pink-100 rounded-2xl -z-10"></div>
                <div className="absolute -bottom-4 -left-4 w-full h-full bg-gray-100 rounded-2xl -z-20"></div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-8 bg-white border-b">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="flex items-center justify-center gap-3">
                <Shield className="w-6 h-6 text-green-500" />
                <span className="text-sm font-medium text-gray-700">Đảm bảo chất lượng</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <Truck className="w-6 h-6 text-blue-500" />
                <span className="text-sm font-medium text-gray-700">Giao hàng toàn quốc</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <Users className="w-6 h-6 text-purple-500" />
                <span className="text-sm font-medium text-gray-700">Hỗ trợ 24/7</span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <CheckCircle className="w-6 h-6 text-pink-500" />
                <span className="text-sm font-medium text-gray-700">Hoàn tiền 100%</span>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Danh Mục Quà Tặng</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">Đa dạng các loại quà tặng cho mọi dịp đặc biệt</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-center">
              {[
                { name: "Valentine", image: "https://res.cloudinary.com/dqh0zio2c/image/upload/v1757609619/valentine-gift-box-luxury_lqgmxi.jpg", count: "50+ sản phẩm" },
                { name: "Sinh Nhật", image: "https://res.cloudinary.com/dqh0zio2c/image/upload/v1757609621/birthday-gift-combo-special_z9yc1z.jpg", count: "80+ sản phẩm" },
                { name: "Tết Nguyên Đán", image: "https://res.cloudinary.com/dqh0zio2c/image/upload/v1757609619/traditional-tet-gift-set_vwtddt.jpg", count: "30+ sản phẩm" },
                { name: "Kỷ Niệm", image: "https://res.cloudinary.com/dqh0zio2c/image/upload/v1757609619/wedding-anniversary-gift_quh9qb.jpg", count: "40+ sản phẩm" },
                { name: "Tốt Nghiệp", image: "https://res.cloudinary.com/dqh0zio2c/image/upload/v1757609620/graduation-gift-box_chngyo.jpg", count: "25+ sản phẩm" },
                { name: "Ngày Của Mẹ", image: "https://res.cloudinary.com/dqh0zio2c/image/upload/v1757609620/mother-day-gift-set_g2hkc7.jpg", count: "35+ sản phẩm" },
              ].map((category, index) => (
                <Link key={index} to="/combo">
                  <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 overflow-hidden">
                    <CardContent className="p-0">
                      <div className="relative">
                        <img
                          src={category.image || "/placeholder.svg"}
                          alt={category.name}
                          className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
                      </div>
                      <div className="p-3 text-center">
                        <h3 className="font-semibold text-gray-900 text-sm">{category.name}</h3>
                        <p className="text-xs text-gray-600 mt-1">{category.count}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link to="/combo">
                <Button className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3">
                  <Gift className="w-5 h-5 mr-2" />
                  Xem Tất Cả Combo Quà Tặng
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Combo Quà Tặng Bán Chạy</h2>
              <p className="text-lg text-gray-600">Những bộ sưu tập được yêu thích nhất</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <Link key={product._id} to={`/combo/${product._id}#${product.name.replace(/\s+/g, '-').toLowerCase()}`}>
                  <Card className="group hover:shadow-xl transition-all duration-300 border-0 overflow-hidden bg-white">
                    <CardContent className="p-0">
                      <div className="relative overflow-hidden">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <Badge
                          className={`absolute top-3 left-3 text-xs font-bold border-0 ${
                            product.badge === "HOT"
                              ? "bg-red-500 text-white"
                              : product.badge === "SALE"
                              ? "bg-pink-500 text-white"
                              : product.badge === "NEW"
                              ? "bg-green-500 text-white"
                              : "bg-purple-500 text-white"
                          }`}
                        >
                          {product.badge}
                        </Badge>
                        <Badge className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-bold border-0">
                          -{product.discount}%
                        </Badge>
                      </div>
                      <div className="p-4 space-y-3">
                        <div className="space-y-2">
                          <div className="flex gap-2 flex-wrap">
                            <Badge variant="outline" className="text-xs">
                              {product.category}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {product.occasion}
                            </Badge>
                          </div>
                          <h3 className="font-semibold text-card-foreground line-clamp-2 h-12 leading-6">
                            {product.name}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-pink-500">{formatPrice(product.price)}</span>
                          <span className="text-sm text-gray-500 line-through">{formatPrice(product.originalPrice)}</span>
                        </div>
                        <div className="space-y-2">
                          <Button
                            className="w-full bg-pink-500 hover:bg-pink-600 text-white"
                            onClick={(e) => {
                              e.preventDefault();
                              handleContactClick("zalo");
                            }}
                          >
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Liên Hệ Đặt Hàng
                          </Button>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 text-xs bg-transparent"
                              onClick={(e) => {
                                e.preventDefault();
                                handleContactClick("facebook");
                              }}
                            >
                              <Facebook className="w-3 h-3 mr-1" />
                              Facebook
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 text-xs bg-transparent"
                              onClick={(e) => {
                                e.preventDefault();
                                handleContactClick("instagram");
                              }}
                            >
                              <Instagram className="w-3 h-3 mr-1" />
                              Instagram
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Tại Sao Chọn GiftMe?</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Chúng tôi mang đến trải nghiệm quà tặng hoàn hảo với dịch vụ chuyên nghiệp
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center p-8 border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
                <CardContent className="space-y-4">
                  <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto">
                    <Gift className="w-8 h-8 text-pink-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Thiết Kế Theo Yêu Cầu</h3>
                  <p className="text-gray-600">Tùy chỉnh combo quà tặng theo ý tưởng và ngân sách của bạn</p>
                </CardContent>
              </Card>
              <Card className="text-center p-8 border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
                <CardContent className="space-y-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <Clock className="w-8 h-8 text-blue-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Giao Hàng Nhanh</h3>
                  <p className="text-gray-600">Giao hàng trong 2-4h nội thành, toàn quốc 58 tỉnh thành</p>
                </CardContent>
              </Card>
              <Card className="text-center p-8 border-0 shadow-lg hover:shadow-xl transition-shadow bg-white">
                <CardContent className="space-y-4">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <Award className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Chất Lượng Cao Cấp</h3>
                  <p className="text-gray-600">Sản phẩm chính hãng, đóng gói tinh tế với phong cách Việt Nam</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Phủ Sóng Giao Hàng Toàn Quốc</h2>
              <p className="text-lg text-gray-600">Giao hàng nhanh chóng đến 58 tỉnh thành Việt Nam</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { city: "TP. Hồ Chí Minh", time: "4-6 ngày", icon: "🏙️" },
                { city: "Hà Nội", time: "1-2 ngày", icon: "🏛️" },
                { city: "Đà Nẵng", time: "4-6 ngày", icon: "🌊" },
                { city: "Các tỉnh khác", time: "4-7 ngày", icon: "🚚" },
              ].map((location, index) => (
                <Card
                  key={index}
                  className="text-center p-6 border-0 shadow-md hover:shadow-lg transition-shadow bg-white"
                >
                  <CardContent className="space-y-3">
                    <div className="text-3xl">{location.icon}</div>
                    <h3 className="font-semibold text-gray-900">{location.city}</h3>
                    <p className="text-pink-500 font-medium">{location.time}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Khách Hàng Nói Gì?</h2>
              <p className="text-lg text-gray-600">Những phản hồi chân thực từ khách hàng</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Chị Minh Anh",
                  role: "Khách hàng thân thiết - TP.HCM",
                  content:
                    "Combo quà Valentine rất đẹp và ý nghĩa. Người yêu mình rất thích! Giao hàng đúng giờ, đóng gói cẩn thận.",
                },
                {
                  name: "Anh Tuấn Việt",
                  role: "Doanh nhân - Hà Nội",
                  content:
                    "Dịch vụ chuyên nghiệp, tư vấn nhiệt tình. Đã đặt quà cho khách hàng nhiều lần, luôn hài lòng!",
                },
                {
                  name: "Cô Lan Hương",
                  role: "Giáo viên - Đà Nẵng",
                  content:
                    "Quà tặng cho mẹ rất tinh tế, chất lượng tốt. Nhân viên hỗ trợ 24/7 rất chu đáo. Cảm ơn GiftMe!",
                },
              ].map((testimonial, index) => (
                <Card key={index} className="p-6 border-0 shadow-lg bg-white">
                  <CardContent className="space-y-4">
                    <p className="text-gray-600 italic">"{testimonial.content}"</p>
                    <div>
                      <div className="font-semibold text-gray-900">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-pink-500 text-white relative">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-pink-600"></div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="max-w-3xl mx-auto space-y-8">
              <h2 className="text-4xl font-bold text-white">Bắt Đầu Tạo Combo Quà Tặng Của Bạn</h2>
              <p className="text-xl text-white opacity-90">
                Liên hệ ngay để được tư vấn miễn phí và thiết kế combo quà tặng độc đáo. Hỗ trợ 24/7 trên toàn quốc!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto">
                <Button
                  size="lg"
                  className="bg-white text-pink-600 hover:bg-gray-100 flex-1"
                  onClick={() => handleContactClick("zalo")}
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Chat Zalo: 0901234567
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-pink-600 flex-1 bg-transparent"
                  onClick={() => handleContactClick("phone")}
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Hotline: 1900-GIFT
                </Button>
              </div>
              <div className="flex justify-center gap-8 pt-4 text-sm text-white opacity-90">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-white" />
                  <span className="text-white">Giao hàng 58 tỉnh thành</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-white" />
                  <span className="text-white">Hỗ trợ 24/7</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-white" />
                  <span className="text-white">Hoàn tiền 100%</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};