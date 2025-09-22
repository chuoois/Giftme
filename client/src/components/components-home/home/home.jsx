import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Gift,
  MessageCircle,
  Facebook,
  Phone,
  ArrowRight,
  Clock,
  Award,
  Shield,
  Truck,
  Users,
  CheckCircle,
  Package,
  Star,
  Heart,
  MapPin,
  Camera,
  Target,
  Zap
} from "lucide-react";
import { comboService } from "@/services/combo.services";
import { contentService } from "@/services/content.services";

// Memoized TikTok Icon Component
const TikTokIcon = React.memo(({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    aria-label="TikTok"
  >
    <defs>
      <linearGradient id="tiktok-red" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#FF0050" />
        <stop offset="100%" stopColor="#FF4458" />
      </linearGradient>
      <linearGradient id="tiktok-blue" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#00F2EA" />
        <stop offset="100%" stopColor="#25F4EE" />
      </linearGradient>
    </defs>
    <g transform="translate(1, 1)">
      <path
        d="M19.321 5.562a5.122 5.122 0 01-3.077-1.028 5.077 5.077 0 01-1.892-2.687V1.5h-3.67v14.72a3.093 3.093 0 11-2.202-2.972V9.608a6.738 6.738 0 00-1.028-.078A6.844 6.844 0 00.608 16.374 6.844 6.844 0 007.452 23.218a6.844 6.844 0 006.844-6.844V8.486a8.653 8.653 0 005.025 1.607V6.422a5.122 5.122 0 01-.86-.86z"
        fill="url(#tiktok-red)"
      />
    </g>
    <g transform="translate(-1, -1)">
      <path
        d="M19.321 5.562a5.122 5.122 0 01-3.077-1.028 5.077 5.077 0 01-1.892-2.687V1.5h-3.67v14.72a3.093 3.093 0 11-2.202-2.972V9.608a6.738 6.738 0 00-1.028-.078A6.844 6.844 0 00.608 16.374 6.844 6.844 0 007.452 23.218a6.844 6.844 0 006.844-6.844V8.486a8.653 8.653 0 005.025 1.607V6.422a5.122 5.122 0 01-.86-.86z"
        fill="url(#tiktok-blue)"
      />
    </g>
    <path
      d="M19.321 5.562a5.122 5.122 0 01-3.077-1.028 5.077 5.077 0 01-1.892-2.687V1.5h-3.67v14.72a3.093 3.093 0 11-2.202-2.972V9.608a6.738 6.738 0 00-1.028-.078A6.844 6.844 0 00.608 16.374 6.844 6.844 0 007.452 23.218a6.844 6.844 0 006.844-6.844V8.486a8.653 8.653 0 005.025 1.607V6.422a5.122 5.122 0 01-.86-.86z"
      fill="#000000"
    />
  </svg>
));

// Constants moved outside component to prevent re-creation
const CONTACT_LINKS = {
  zalo: "https://zalo.me/0988156786",
  facebook: "https://www.facebook.com/share/1Ayd5AzgqG/?mibextid=wwXIfr",
  tiktok: "https://www.tiktok.com/@giftme.official?_t=ZS-8zskPxtohho&_r=1",
  phone: "tel:0988156786",
};

const WHY_CHOOSE_US = [
  {
    icon: Target,
    title: "Cá Nhân Hóa 100%",
    description: "Thiết kế riêng theo yêu cầu"
  },
  {
    icon: Shield,
    title: "Chất Lượng Đảm Bảo",
    description: "Cam kết hoàn tiền nếu không hài lòng"
  },
  {
    icon: Zap,
    title: "Giao Hàng Nhanh",
    description: "Giao hàng trong 1-2 ngày tại Hà Nội"
  },
  {
    icon: Users,
    title: "Hỗ Trợ 24/7",
    description: "Tư vấn chuyên nghiệp"
  }
];

const PROCESSING_STEPS = [
  {
    step: 1,
    title: "Tư Vấn",
    description: "Liên hệ để được tư vấn combo phù hợp",
    icon: MessageCircle
  },
  {
    step: 2,
    title: "Thiết Kế",
    description: "Thiết kế theo yêu cầu và xác nhận",
    icon: Camera
  },
  {
    step: 3,
    title: "Chuẩn Bị",
    description: "Chuẩn bị và đóng gói cẩn thận",
    icon: Package
  },
  {
    step: 4,
    title: "Giao Hàng",
    description: "Giao hàng trong 1-2 ngày tại Hà Nội",
    icon: Truck
  }
];

const FAQ_DATA = [
  {
    question: "Tôi có thể tùy chỉnh combo theo yêu cầu không?",
    answer: "Có! Chúng tôi hỗ trợ thiết kế combo 100% theo yêu cầu của bạn."
  },
  {
    question: "Thời gian giao hàng tại Hà Nội mất bao lâu?",
    answer: "Giao hàng trong Hà Nội (nội thành và ngoại thành) trong 1-2 ngày."
  },
  {
    question: "Có chính sách hoàn trả không?",
    answer: "Cam kết hoàn tiền 100% nếu sản phẩm không đúng mô tả."
  },
  {
    question: "Giá combo đã bao gồm phí vận chuyển chưa?",
    answer: "Miễn phí giao hàng trong Hà Nội cho đơn từ 500k."
  }
];

// Memoized sub-components
const LoadingSpinner = React.memo(() => (
  <div className="flex items-center">
    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500"></div>
    <span className="ml-2 text-gray-600">Đang tải...</span>
  </div>
));

const ProductCard = React.memo(({ product, onContactClick, formatPrice }) => (
  <Link
    key={product._id}
    to={`/combo/${product._id}#${product.name.replace(/\s+/g, '-').toLowerCase()}`}
  >
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 overflow-hidden bg-white">
      <CardContent className="p-0">
        <div className="relative overflow-hidden">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <Badge
            className={`absolute top-3 left-3 text-xs font-bold border-0 ${product.badge === "HOT"
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
          {product.discount && (
            <Badge className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-bold border-0">
              -{product.discount}%
            </Badge>
          )}
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
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          <div className="space-y-2">
            <Button
              className="w-full bg-pink-500 hover:bg-pink-600 text-white"
              onClick={(e) => {
                e.preventDefault();
                onContactClick("zalo");
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
                  onContactClick("facebook");
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
                  onContactClick("tiktok");
                }}
              >
                <TikTokIcon className="w-3 h-3 mr-1" />
                TikTok
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </Link>
));

export const Home = () => {
  const [products, setProducts] = useState([]);
  const [enabledContent, setEnabledContent] = useState(null);
  const [loadingContent, setLoadingContent] = useState(true);
  const [error, setError] = useState(null);
  const scrollContainerRef = useRef(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [scrollDirection, setScrollDirection] = useState(1); // 1 for right, -1 for left

  // Memoized format price function
  const formatPrice = useCallback((price) => {
    if (!price) return "";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  }, []);

  // Memoized contact handler
  const handleContactClick = useCallback((platform) => {
    const link = CONTACT_LINKS[platform];
    if (!link) return;

    if (platform === "phone") {
      window.location.href = link;
    } else {
      window.open(link, "_blank", "noopener,noreferrer");
    }
  }, []);

  // Fetch functions with better error handling
  const fetchHotCombos = useCallback(async () => {
    try {
      const data = await comboService.getHotCombos({ location: "Hanoi" });
      const processedProducts = data.data?.map(product => ({
        ...product,
        deliveryTime: "1-2 ngày"
      })) || [];
      setProducts(processedProducts);
    } catch (error) {
      console.error("Error fetching hot combos:", error);
      setError("Không thể tải danh sách combo. Vui lòng thử lại sau.");
    }
  }, []);

  const fetchEnabledContent = useCallback(async () => {
    try {
      setLoadingContent(true);
      const data = await contentService.getEnabledContent();
      setEnabledContent(data);
    } catch (error) {
      console.error("Error fetching enabled content:", error);
      setError("Không thể tải nội dung. Vui lòng thử lại sau.");
    } finally {
      setLoadingContent(false);
    }
  }, []);

  useEffect(() => {
    Promise.all([fetchHotCombos(), fetchEnabledContent()]);
  }, [fetchHotCombos, fetchEnabledContent]);

  // Auto scroll effect
  useEffect(() => {
    if (!isAutoScrolling || products.length <= 3) return;

    const interval = setInterval(() => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const { scrollLeft, scrollWidth, clientWidth } = container;
      const maxScroll = scrollWidth - clientWidth;

      if (scrollDirection === 1 && scrollLeft >= maxScroll - 10) {
        // Reached right end, change direction
        setScrollDirection(-1);
      } else if (scrollDirection === -1 && scrollLeft <= 10) {
        // Reached left end, change direction
        setScrollDirection(1);
      }

      // Smooth scroll
      container.scrollBy({
        left: scrollDirection * 2, // 2px per interval for smooth movement
        behavior: 'auto'
      });
    }, 30); // 30ms interval for smooth animation

    return () => clearInterval(interval);
  }, [isAutoScrolling, scrollDirection, products.length]);

  // Handle manual interaction
  const handleScrollStart = useCallback(() => {
    setIsAutoScrolling(false);
  }, []);

  const handleScrollEnd = useCallback(() => {
    // Resume auto scroll after 3 seconds of no interaction
    setTimeout(() => {
      setIsAutoScrolling(true);
    }, 3000);
  }, []);

  // Memoized components to prevent unnecessary re-renders
  const heroSection = useMemo(() => (
    <section className="relative bg-gradient-to-br from-pink-50 via-white to-gray-50 py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            {loadingContent ? (
              <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
                <span className="ml-2 text-gray-600">Đang tải nội dung...</span>
              </div>
            ) : (
              enabledContent && (
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
              )
            )}
            <div className="grid grid-cols-2 gap-4 py-4">
              {[
                "Miễn phí tư vấn",
                "Giao hàng Hà Nội 1-2 ngày",
                "Hoàn tiền 100%",
                "Thiết kế riêng"
              ].map((benefit) => (
                <div key={benefit} className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span className="text-sm">{benefit}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 text-lg"
                onClick={() => handleContactClick("zalo")}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Tư Vấn Ngay
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
          </div>
          <div className="relative">
            <div className="relative z-10">
              <img
                src={enabledContent?.img || "/hanoi-themed-placeholder.svg"}
                alt={enabledContent?.title || "Combo quà tặng Hà Nội"}
                className="w-full h-96 object-cover rounded-2xl shadow-2xl"
                loading="eager"
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
  ), [loadingContent, enabledContent, handleContactClick]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Thử lại
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main>
        {heroSection}

        {/* Why Choose Us */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Tại Sao Chọn Chúng Tôi?</h2>
              <p className="text-gray-600">Lý do khách hàng tin tưởng và yêu thích</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {WHY_CHOOSE_US.map((reason, index) => {
                const Icon = reason.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="bg-pink-100 rounded-full p-4 mb-4 mx-auto w-16 h-16 flex items-center justify-center">
                      <Icon className="w-8 h-8 text-pink-500" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{reason.title}</h3>
                    <p className="text-sm text-gray-600">{reason.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Hot Combos Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Combo Quà Tặng Bán Chạy</h2>
              <p className="text-lg text-gray-600">Những bộ sưu tập được yêu thích nhất</p>
            </div>

            {/* Auto-scrolling Products */}
            <div className="relative">
              <div
                ref={scrollContainerRef}
                className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                onMouseEnter={handleScrollStart}
                onMouseLeave={handleScrollEnd}
                onTouchStart={handleScrollStart}
                onTouchEnd={handleScrollEnd}
              >
                <style jsx>{`
                  .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                  }
                `}</style>
                {products.map((product) => (
                  <div key={product._id} className="flex-none w-72 sm:w-80">
                    <ProductCard
                      product={product}
                      onContactClick={handleContactClick}
                      formatPrice={formatPrice}
                    />
                  </div>
                ))}
              </div>

              {/* Gradient overlays for visual effect */}
              {products.length > 3 && (
                <>
                  <div className="absolute left-0 top-0 bottom-4 w-8 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none"></div>
                  <div className="absolute right-0 top-0 bottom-4 w-8 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none"></div>
                </>
              )}

              {/* Auto scroll indicator */}
              {products.length > 3 && isAutoScrolling && (
                <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
                  AUTO
                </div>
              )}
            </div>

            {/* Interaction hint */}
            {products.length > 3 && (
              <div className="text-center mt-4">
                <p className="text-sm text-gray-500">
                  {isAutoScrolling ? "Hover để tạm dừng • " : ""}
                  Vuốt hoặc kéo để xem thêm sản phẩm
                </p>
              </div>
            )}

            {/* View All Products Button */}
            <div className="text-center mt-12">
              <Link to="/combo">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-pink-500 text-pink-500 hover:bg-pink-50 px-8 py-4"
                >
                  Xem Tất Cả Sản Phẩm
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Process Steps */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Quy Trình Đặt Hàng</h2>
              <p className="text-gray-600">4 bước để có combo quà tặng hoàn hảo</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {PROCESSING_STEPS.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={index} className="text-center relative">
                    {index < PROCESSING_STEPS.length - 1 && (
                      <div className="hidden lg:block absolute top-8 left-1/2 w-full h-0.5 bg-gray-200 -z-10"></div>
                    )}
                    <div className="bg-pink-500 text-white rounded-full p-4 mb-4 mx-auto w-16 h-16 flex items-center justify-center relative">
                      <Icon className="w-7 h-7" />
                      <span className="absolute -top-2 -right-2 bg-white text-pink-500 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                        {step.step}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Câu Hỏi Thường Gặp</h2>
              <p className="text-gray-600">Giải đáp những thắc mắc phổ biến</p>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
              {FAQ_DATA.map((faq, index) => (
                <Card key={index} className="shadow-sm">
                  <CardContent className="p-6">
                    <details className="group">
                      <summary className="flex items-center justify-between cursor-pointer font-semibold text-gray-900 list-none">
                        {faq.question}
                        <ArrowRight className="w-5 h-5 text-gray-400 group-open:rotate-90 transition-transform" />
                      </summary>
                      <div className="mt-4 text-gray-600 leading-relaxed">{faq.answer}</div>
                    </details>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 bg-pink-500">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-2xl mx-auto space-y-8">
              <h3 className="text-4xl font-bold text-white">
                Bắt Đầu Tạo Combo Quà Tặng Của Bạn
              </h3>
              <p className="text-lg text-white/90">
                Liên hệ ngay để được tư vấn miễn phí và nhận combo quà tặng trong 1-2 ngày tại Hà Nội
              </p>

              <Button
                size="lg"
                className="bg-white text-pink-600 hover:bg-gray-100 px-8 py-4 text-lg"
                onClick={() => handleContactClick("zalo")}
              >
                <MessageCircle className="w-6 h-6 mr-3" />
                Chat Zalo: 0988156786
              </Button>

              <div className="flex flex-wrap justify-center gap-8 pt-4 text-sm text-white/80">
                {[
                  { icon: MapPin, text: "Giao hàng Hà Nội 1-2 ngày" },
                  { icon: Clock, text: "Hỗ trợ 24/7" },
                  { icon: CheckCircle, text: "Hoàn tiền 100%" }
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};