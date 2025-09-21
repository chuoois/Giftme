import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  Gift,
  MessageCircle,
  Facebook,
  Instagram,
  Search,
  Filter,
  X,
  Grid3X3,
  List,
  SlidersHorizontal,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { comboService } from "@/services/combo.services";

export const Combo = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedOccasions, setSelectedOccasions] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 2000000]);
  const [sortBy, setSortBy] = useState("popular");
  const [viewMode, setViewMode] = useState("grid");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [products, setProducts] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Static categories and occasions for filters
  const categories = [
    "Combo Cao Cấp",
    "Combo Sinh Nhật",
    "Combo Tết",
    "Combo Tốt Nghiệp",
    "Combo Gia Đình",
    "Combo Doanh Nghiệp",
    "Combo Cặp Đôi",
  ];
  const occasions = ["Valentine", "Sinh Nhật", "Tết Nguyên Đán", "Kỷ Niệm", "Tốt Nghiệp", "Ngày Của Mẹ", "Doanh Nghiệp"];

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const params = {
          page: currentPage,
          limit: itemsPerPage,
          search: searchQuery,
          category: selectedCategories.join(",") || "",
          occasion: selectedOccasions.join(",") || "",
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
          sortBy: sortBy === "price-low" ? "price_low" : sortBy === "price-high" ? "price_high" : sortBy === "name" ? "name_az" : sortBy,
        };

        const response = await comboService.getComboList(params);
        setProducts(response.data.combos);
        setTotalItems(response.data.pagination.totalItems);
        setTotalPages(response.data.pagination.totalPages);
      } catch (err) {
        setError("Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.");
        console.error("Error fetching combos:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery, selectedCategories, selectedOccasions, priceRange, sortBy, currentPage, itemsPerPage]);

  // Map API sort values to UI sort values
  const sortOptions = [
    { value: "popular", label: "Phổ biến nhất" },
    { value: "price-low", label: "Giá thấp đến cao" },
    { value: "price-high", label: "Giá cao đến thấp" },
    { value: "discount", label: "Giảm giá nhiều nhất" },
    { value: "name", label: "Tên A-Z" },
  ];

  // Handle category change
  const handleCategoryChange = (category, checked) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    }
    setCurrentPage(1);
  };

  // Handle occasion change
  const handleOccasionChange = (occasion, checked) => {
    if (checked) {
      setSelectedOccasions([...selectedOccasions, occasion]);
    } else {
      setSelectedOccasions(selectedOccasions.filter((o) => o !== occasion));
    }
    setCurrentPage(1);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setSelectedOccasions([]);
    setPriceRange([0, 2000000]);
    setSortBy("popular");
    setCurrentPage(1);
  };

  // Format price for display
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Handle contact button clicks
  const handleContactClick = (platform) => {
    const links = {
      zalo: "https://zalo.me/0988156786",
      facebook: "https://www.facebook.com/share/1Ayd5AzgqG/?mibextid=wwXIfr",
      tiktok: "https://www.tiktok.com/@giftme.official?_t=ZS-8zskPxtohho&_r=1",
      phone: "tel:0988156786", // hoặc bỏ nếu không cần
    };

    if (platform === "phone") {
      window.location.href = links[platform];
    } else {
      window.open(links[platform], "_blank", "noopener,noreferrer");
    }
  };

  // FilterSidebar Component
  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Search */}
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-900">Tìm kiếm</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Tìm combo quà tặng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900">Khoảng giá</h3>
        <div className="px-2">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            max={2000000}
            min={0}
            step={50000}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>{formatPrice(priceRange[0])}</span>
            <span>{formatPrice(priceRange[1])}</span>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900">Danh mục ({selectedCategories.length})</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {categories.map((category) => (
            <div key={category} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={category}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={(checked) => handleCategoryChange(category, !!checked)}
                />
                <label htmlFor={category} className="text-sm text-gray-700 cursor-pointer">
                  {category}
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Occasions */}
      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900">Dịp đặc biệt ({selectedOccasions.length})</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {occasions.map((occasion) => (
            <div key={occasion} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={occasion}
                  checked={selectedOccasions.includes(occasion)}
                  onCheckedChange={(checked) => handleOccasionChange(occasion, !!checked)}
                />
                <label htmlFor={occasion} className="text-sm text-gray-700 cursor-pointer">
                  {occasion}
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      <Button
        variant="outline"
        onClick={clearAllFilters}
        className="w-full border-pink-500 text-pink-600 hover:bg-pink-500 hover:text-white bg-transparent"
      >
        <X className="w-4 h-4 mr-2" />
        Xóa tất cả bộ lọc
      </Button>
    </div>
  );

  // Pagination Component
  const Pagination = () => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
      const pages = [];
      const maxVisiblePages = 5;

      if (totalPages <= maxVisiblePages) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        if (currentPage <= 3) {
          for (let i = 1; i <= 4; i++) {
            pages.push(i);
          }
          pages.push("...");
          pages.push(totalPages);
        } else if (currentPage >= totalPages - 2) {
          pages.push(1);
          pages.push("...");
          for (let i = totalPages - 3; i <= totalPages; i++) {
            pages.push(i);
          }
        } else {
          pages.push(1);
          pages.push("...");
          for (let i = currentPage - 1; i <= currentPage + 1; i++) {
            pages.push(i);
          }
          pages.push("...");
          pages.push(totalPages);
        }
      }

      return pages;
    };

    return (
      <div className="flex items-center justify-center gap-2 mt-8">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="bg-transparent"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        {getPageNumbers().map((page, index) =>
          page === "..." ? (
            <span key={index} className="px-2 text-gray-500">
              ...
            </span>
          ) : (
            <Button
              key={index}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(page)}
              className={currentPage === page ? "bg-pink-500 hover:bg-pink-600 text-white" : "bg-transparent"}
            >
              {page}
            </Button>
          )
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="bg-transparent"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <main>
        {/* Page Header */}
        <section className="bg-gradient-to-r from-pink-500 to-pink-600 py-12 text-white">
          <div className="container mx-auto px-4">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold">Combo Quà Tặng</h1>
              <p className="text-xl text-pink-100 max-w-2xl mx-auto">
                Khám phá bộ sưu tập combo quà tặng đa dạng cho mọi dịp đặc biệt
              </p>
              <div className="flex items-center justify-center gap-4 text-sm">
                <span className="bg-white/20 px-3 py-1 rounded-full">{totalItems} sản phẩm</span>
                <span className="bg-white/20 px-3 py-1 rounded-full">Giao hàng toàn quốc</span>
                <span className="bg-white/20 px-3 py-1 rounded-full">Tư vấn 24/7</span>
              </div>
            </div>
          </div>
        </section>

        {/* Filters and Products */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="flex gap-8">
              {/* Desktop Sidebar */}
              <div className="hidden lg:block w-80 flex-shrink-0">
                <div className="sticky top-4 bg-white rounded-xl border p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-6">
                    <SlidersHorizontal className="w-5 h-5 text-pink-500" />
                    <h2 className="text-lg font-semibold text-gray-900">Bộ lọc</h2>
                  </div>
                  <FilterSidebar />
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1">
                {/* Mobile Filter Button & Controls */}
                <div className="flex items-center justify-between mb-6 gap-4">
                  <div className="flex items-center gap-4">
                    {/* Mobile Filter Button */}
                    <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                      <SheetTrigger asChild>
                        <Button variant="outline" className="lg:hidden bg-transparent">
                          <Filter className="w-4 h-4 mr-2" />
                          Bộ lọc
                          {selectedCategories.length + selectedOccasions.length > 0 && (
                            <Badge className="ml-2 bg-pink-500 text-white">
                              {selectedCategories.length + selectedOccasions.length}
                            </Badge>
                          )}
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="left" className="w-80">
                        <SheetHeader>
                          <SheetTitle className="flex items-center gap-2">
                            <SlidersHorizontal className="w-5 h-5 text-pink-500" />
                            Bộ lọc sản phẩm
                          </SheetTitle>
                          <SheetDescription>Tìm combo quà tặng phù hợp với nhu cầu của bạn</SheetDescription>
                        </SheetHeader>
                        <div className="mt-6">
                          <FilterSidebar />
                        </div>
                      </SheetContent>
                    </Sheet>

                    {/* Active Filters */}
                    {(selectedCategories.length > 0 || selectedOccasions.length > 0) && (
                      <div className="flex flex-wrap gap-2">
                        {selectedCategories.map((category) => (
                          <Badge
                            key={category}
                            variant="secondary"
                            className="bg-pink-100 text-pink-700 hover:bg-pink-200 cursor-pointer"
                            onClick={() => handleCategoryChange(category, false)}
                          >
                            {category}
                            <X className="w-3 h-3 ml-1" />
                          </Badge>
                        ))}
                        {selectedOccasions.map((occasion) => (
                          <Badge
                            key={occasion}
                            variant="secondary"
                            className="bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer"
                            onClick={() => handleOccasionChange(occasion, false)}
                          >
                            {occasion}
                            <X className="w-3 h-3 ml-1" />
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Sort */}
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-48">
                        <ArrowUpDown className="w-4 h-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {sortOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {/* View Mode */}
                    <div className="flex border rounded-lg overflow-hidden">
                      <Button
                        variant={viewMode === "grid" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("grid")}
                        className="rounded-none"
                      >
                        <Grid3X3 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant={viewMode === "list" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("list")}
                        className="rounded-none"
                      >
                        <List className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Results Count */}
                <div className="mb-6">
                  <p className="text-gray-600">
                    Hiển thị <span className="font-semibold text-gray-900">{products.length}</span> trong tổng số{" "}
                    <span className="font-semibold text-gray-900">{totalItems}</span> sản phẩm
                    {searchQuery && (
                      <span>
                        {" "}
                        cho từ khóa "<span className="font-semibold text-pink-600">{searchQuery}</span>"
                      </span>
                    )}
                  </p>
                </div>

                {/* Loading State */}
                {isLoading && (
                  <div className="text-center py-16">
                    <p className="text-gray-600">Đang tải sản phẩm...</p>
                  </div>
                )}

                {/* Error State */}
                {error && (
                  <div className="text-center py-16">
                    <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Lỗi</h3>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <Button onClick={() => fetchProducts()} className="bg-pink-500 hover:bg-pink-600 text-white">
                      Thử lại
                    </Button>
                  </div>
                )}

                {/* Products Grid/List */}
                {!isLoading && !error && products.length > 0 ? (
                  <>
                    <div className={viewMode === "grid" ? "grid md:grid-cols-2 xl:grid-cols-3 gap-6" : "space-y-4"}>
                      {products.map((product) => (
                        <Link
                          key={product._id}
                          to={`/combo/${product._id}#${product.name.replace(/\s+/g, "-").toLowerCase()}`}
                        >
                          <Card
                            className={`group hover:shadow-xl transition-all duration-300 border-0 overflow-hidden bg-white cursor-pointer ${viewMode === "list" ? "flex" : ""
                              }`}
                          >
                            <CardContent className={`p-0 ${viewMode === "list" ? "flex w-full" : ""}`}>
                              <div
                                className={`relative overflow-hidden ${viewMode === "list" ? "w-48 flex-shrink-0" : ""}`}
                              >
                                <img
                                  src={product.image || "/placeholder.svg"}
                                  alt={product.name}
                                  className={`object-cover group-hover:scale-105 transition-transform duration-300 ${viewMode === "list" ? "w-full h-full" : "w-full h-48"
                                    }`}
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
                                <Badge className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-bold border-0">
                                  -{product.discount}%
                                </Badge>
                              </div>
                              <div className={`space-y-3 ${viewMode === "list" ? "p-6 flex-1" : "p-4"}`}>
                                <div className="space-y-2">
                                  <div className="flex gap-2 flex-wrap">
                                    <Badge variant="outline" className="text-xs">
                                      {product.category}
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                      {product.occasion}
                                    </Badge>
                                  </div>
                                  <h3
                                    className={`font-semibold text-card-foreground ${viewMode === "list" ? "text-lg" : "line-clamp-2 h-12 leading-6"
                                      }`}
                                  >
                                    {product.name}
                                  </h3>
                                  {viewMode === "list" && (
                                    <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xl font-bold text-pink-500">{formatPrice(product.price)}</span>
                                  <span className="text-sm text-gray-500 line-through">
                                    {formatPrice(product.originalPrice)}
                                  </span>
                                </div>
                                <div className="space-y-2">
                                  <Button
                                    className="w-full bg-pink-500 hover:bg-pink-600 text-white"
                                    onClick={() => handleContactClick("zalo")}
                                  >
                                    <MessageCircle className="w-4 h-4 mr-2" />
                                    Liên Hệ Đặt Hàng
                                  </Button>
                                  <div className="flex gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="flex-1 text-xs bg-transparent"
                                      onClick={() => handleContactClick("facebook")}
                                    >
                                      <Facebook className="w-3 h-3 mr-1" />
                                      Facebook
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="flex-1 text-xs bg-transparent"
                                      onClick={() => handleContactClick("instagram")}
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

                    {/* Pagination */}
                    <Pagination />
                  </>
                ) : (
                  !isLoading &&
                  !error && (
                    <div className="text-center py-16">
                      <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy sản phẩm</h3>
                      <p className="text-gray-600 mb-6">
                        Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm để xem thêm sản phẩm
                      </p>
                      <Button onClick={clearAllFilters} className="bg-pink-500 hover:bg-pink-600 text-white">
                        Xóa tất cả bộ lọc
                      </Button>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};