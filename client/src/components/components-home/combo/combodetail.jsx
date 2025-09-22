import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  MessageCircle,
  Facebook,
  Instagram,
  Phone,
  CheckCircle,
  Gift,
  Clock,
  Truck,
  Shield,
} from "lucide-react";
import { comboService } from "@/services/combo.services";

export const ComboDetail = () => {
  const params = useParams();
  const productId = params.id;
  const navigate = useNavigate();

  const [product, setProduct] = React.useState(null);
  const [relatedProducts, setRelatedProducts] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [selectedImage, setSelectedImage] = React.useState("");

  // Fetch product and related products
  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch product detail
        const productResponse = await comboService.getComboById(productId);
        const productData = productResponse.data;
        setProduct(productData);
        setSelectedImage(productData.image || "/placeholder.svg");

        // Fetch related products
        const relatedResponse = await comboService.getSuggestedCombos(productId);
        setRelatedProducts(relatedResponse.data || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          "Không thể tải thông tin sản phẩm hoặc sản phẩm liên quan. Vui lòng thử lại sau."
        );
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, [productId]);

  // Debug: Kiểm tra khi selectedImage thay đổi
  React.useEffect(() => {
  }, [selectedImage]);

  const links = {
    zalo: "https://zalo.me/0988156786",
    facebook: "https://www.facebook.com/share/1Ayd5AzgqG/?mibextid=wwXIfr",
    tiktok: "https://www.tiktok.com/@giftme.official?_t=ZS-8zskPxtohho&_r=1",
    phone: "tel:0988156786", // hoặc bỏ nếu không cần
  };

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

  const handleContactClick = (platform) => {
    if (platform === "phone") {
      window.location.href = links[platform];
    } else {
      window.open(links[platform], "_blank", "noopener,noreferrer");
    }
  };

  const handleBackClick = () => {
    navigate("/combo");
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Đang tải thông tin sản phẩm...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{error || "Không tìm thấy sản phẩm"}</h1>
          <Button onClick={handleBackClick} className="bg-pink-500 hover:bg-pink-600 text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay về trang combo
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={handleBackClick} className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Quay lại
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="relative">
              <img
                key={selectedImage}
                src={selectedImage}
                alt={product.name}
                className="w-full h-96 lg:h-[500px] object-cover rounded-2xl shadow-lg"
                onError={(e) => {
                  e.target.src = "/placeholder.svg";
                  console.error("Error loading image:", selectedImage);
                }}
              />
              <Badge
                className={`absolute top-4 left-4 text-sm font-bold border-0 ${product.badge === "HOT"
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
              <Badge className="absolute top-4 right-4 bg-orange-500 text-white text-sm font-bold border-0">
                -{product.discount}%
              </Badge>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {product.gallery?.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className={`w-full h-24 object-cover rounded-lg cursor-pointer transition-all ${selectedImage === image ? "ring-2 ring-pink-500" : "hover:opacity-80"
                    }`}
                  onClick={() => handleImageClick(image)}
                  onError={(e) => {
                    e.target.src = "/placeholder.svg";
                    console.error("Error loading gallery image:", image);
                  }}
                />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4 text-balance">{product.name}</h1>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl font-bold text-pink-500">{formatPrice(product.price)}</span>
                <span className="text-xl text-gray-500 line-through">{formatPrice(product.originalPrice)}</span>
                <Badge className="bg-green-100 text-green-800 text-sm">Tiết kiệm {product.discount}%</Badge>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Mô tả sản phẩm</h3>
              <p className="text-gray-600 leading-relaxed text-pretty">{product.description}</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Đặc điểm nổi bật</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Bao gồm trong combo</h3>
              <ul className="space-y-2">
                {product.includes.map((item, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Gift className="w-4 h-4 text-pink-500 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4 py-6 border-t border-b">
              <div className="text-center">
                <Clock className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                <div className="text-sm font-medium">Giao hàng nhanh</div>
                <div className="text-xs text-gray-600">1-2 ngày nội thành(ngoại thành) Hà Nội</div>
              </div>
              <div className="text-center">
                <Shield className="w-6 h-6 text-green-500 mx-auto mb-2" />
                <div className="text-sm font-medium">Đảm bảo chất lượng</div>
                <div className="text-xs text-gray-600">Hoàn tiền 100%</div>
              </div>
            </div>

            <div className="space-y-4">
              <Button
                size="lg"
                className="w-full bg-pink-500 hover:bg-pink-600 text-white py-4 text-lg"
                onClick={() => handleContactClick("zalo")}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Liên Hệ Đặt Hàng Ngay
              </Button>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="flex-1 bg-transparent border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white"
                  onClick={() => handleContactClick("facebook")}
                >
                  <Facebook className="w-4 h-4 mr-2" />
                  Facebook
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 bg-transparent border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white"
                  onClick={() => handleContactClick("tiktok")}
                >
                  <TikTokIcon className="w-4 h-4 mr-2" />
                  TikTok
                </Button>
              </div>

              <Button
                variant="outline"
                size="lg"
                className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent"
                onClick={() => handleContactClick("phone")}
              >
                <Phone className="w-5 h-5 mr-2" />
                Gọi Hotline: 0988156786
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Sản phẩm liên quan</h2>
          {relatedProducts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link key={relatedProduct._id} to={`/combo/${relatedProduct._id}`}>
                  <Card className="group hover:shadow-xl transition-all duration-300 border-0 overflow-hidden bg-white">
                    <CardContent className="p-0">
                      <div className="relative overflow-hidden">
                        <img
                          src={relatedProduct.image || "/placeholder.svg"}
                          alt={relatedProduct.name}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <Badge
                          className={`absolute top-3 left-3 text-xs font-bold border-0 ${relatedProduct.badge === "HOT"
                            ? "bg-red-500 text-white"
                            : relatedProduct.badge === "SALE"
                              ? "bg-pink-500 text-white"
                              : relatedProduct.badge === "NEW"
                                ? "bg-green-500 text-white"
                                : "bg-purple-500 text-white"
                            }`}
                        >
                          {relatedProduct.badge}
                        </Badge>
                        <Badge className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-bold border-0">
                          -{relatedProduct.discount}%
                        </Badge>
                      </div>
                      <div className="p-4 space-y-3">
                        <div className="space-y-2">
                          <div className="flex gap-2 flex-wrap">
                            <Badge variant="outline" className="text-xs">
                              {relatedProduct.category}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {relatedProduct.occasion}
                            </Badge>
                          </div>
                          <h3 className="font-semibold text-card-foreground line-clamp-2 h-12 leading-6">
                            {relatedProduct.name}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-pink-500">{formatPrice(relatedProduct.price)}</span>
                          <span className="text-sm text-gray-500 line-through">
                            {formatPrice(relatedProduct.originalPrice)}
                          </span>
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
                                handleContactClick("tiktok");
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
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">Không có sản phẩm liên quan.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};