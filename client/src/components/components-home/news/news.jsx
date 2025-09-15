import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, User, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { newsService } from "@/services/news.services";

export const News = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [articles, setArticles] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch articles from API
  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const params = {
          page: currentPage,
          limit: itemsPerPage,
          search: searchQuery,
          category: selectedCategory === "all" ? "" : selectedCategory,
          sort: sortBy === "newest" ? "desc" : "asc",
        };

        const response = await newsService.getNewsList(params);
        setArticles(response.data);
        setTotalItems(response.pagination.total);
        setTotalPages(response.pagination.totalPages);
      } catch (err) {
        setError("Không thể tải danh sách bài viết. Vui lòng thử lại sau.");
        console.error("Error fetching articles:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [searchQuery, selectedCategory, sortBy, currentPage, itemsPerPage]);

  const featuredArticles = useMemo(() => articles.filter((article) => article.featured).slice(0, 3), [articles]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const truncateExcerpt = (text) => {
    return text.length > 100 ? text.slice(0, 100) + "..." : text;
  };

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
              <h1 className="text-4xl font-bold">Tin Tức & Bài Viết</h1>
              <p className="text-xl text-pink-100 max-w-2xl mx-auto">
                Cập nhật những xu hướng mới nhất về quà tặng và các mẹo hay trong việc lựa chọn quà
              </p>
            </div>
          </div>
        </section>

        {/* Featured Articles */}
        {featuredArticles.length > 0 && (
          <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Bài Viết Nổi Bật</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {featuredArticles.map((article) => (
                  <Link
                    key={article._id}
                    to={`/news/${article._id}#${article.title.replace(/\s+/g, "-").toLowerCase()}`}
                  >
                    <Card className="group hover:shadow-xl transition-all duration-300 border-0 overflow-hidden bg-white cursor-pointer">
                      <CardContent className="p-0">
                        <div className="relative overflow-hidden">
                          <img
                            src={article.image || "/placeholder.svg"}
                            alt={article.title}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <Badge className="absolute top-3 left-3 bg-pink-500 text-white text-xs font-bold border-0">
                            Nổi bật
                          </Badge>
                          <Badge className="absolute top-3 right-3 bg-blue-500 text-white text-xs border-0">
                            {article.category}
                          </Badge>
                        </div>
                        <div className="p-6 space-y-4">
                          <h3 className="font-bold text-lg text-card-foreground line-clamp-2 leading-6">
                            {article.title}
                          </h3>
                          <p className="text-gray-600 text-sm line-clamp-3">{truncateExcerpt(article.excerpt)}</p>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                <span>{article.author}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                <span>{formatDate(article.publishDate)}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{article.readTime} phút đọc</span>
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
        )}

        {/* Main Content */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Tìm kiếm bài viết..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả danh mục</SelectItem>
                    <SelectItem value="Xu hướng">Xu hướng</SelectItem>
                    <SelectItem value="Hướng dẫn">Hướng dẫn</SelectItem>
                    <SelectItem value="Văn hóa">Văn hóa</SelectItem>
                    <SelectItem value="Top list">Top list</SelectItem>
                    <SelectItem value="Doanh nghiệp">Doanh nghiệp</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sắp xếp theo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Mới nhất</SelectItem>
                    <SelectItem value="oldest">Cũ nhất</SelectItem>
                    {/* Remove if not supported by backend */}
                    {/* <SelectItem value="popular">Phổ biến nhất</SelectItem> */}
                    {/* <SelectItem value="comments">Nhiều bình luận</SelectItem> */}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-6">
              <p className="text-gray-600">
                Hiển thị <span className="font-semibold text-gray-900">{articles.length}</span> trong tổng số{" "}
                <span className="font-semibold text-gray-900">{totalItems}</span> bài viết
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
                <p className="text-gray-600">Đang tải bài viết...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-16">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Lỗi</h3>
                <p className="text-gray-600 mb-6">{error}</p>
                <Button onClick={() => window.location.reload()} className="bg-pink-500 hover:bg-pink-600 text-white">
                  Thử lại
                </Button>
              </div>
            )}

            {/* Articles Grid */}
            {!isLoading && !error && articles.length > 0 ? (
              <>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {articles.map((article) => (
                    <Link
                      key={article._id}
                      to={`/news/${article._id}#${article.title.replace(/\s+/g, "-").toLowerCase()}`}
                    >
                      <Card className="group hover:shadow-xl transition-all duration-300 border-0 overflow-hidden bg-white cursor-pointer h-full">
                        <CardContent className="p-0 h-full flex flex-col">
                          <div className="relative overflow-hidden">
                            <img
                              src={article.image || "/placeholder.svg"}
                              alt={article.title}
                              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <Badge className="absolute top-3 right-3 bg-blue-500 text-white text-xs border-0">
                              {article.category}
                            </Badge>
                          </div>
                          <div className="p-6 space-y-4 flex-1 flex flex-col">
                            <h3 className="font-bold text-lg text-card-foreground line-clamp-2 leading-6">
                              {article.title}
                            </h3>
                            <p className="text-gray-600 text-sm line-clamp-3 flex-1">{truncateExcerpt(article.excerpt)}</p>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between text-xs text-gray-500">
                                <div className="flex items-center gap-4">
                                  <div className="flex items-center gap-1">
                                    <User className="w-3 h-3" />
                                    <span>{article.author}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    <span>{formatDate(article.publishDate)}</span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{article.readTime} phút đọc</span>
                                </div>
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
              !isLoading && !error && (
                <div className="text-center py-16">
                  <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Không tìm thấy bài viết</h3>
                  <p className="text-gray-600 mb-6">Thử điều chỉnh từ khóa tìm kiếm hoặc bộ lọc để xem thêm bài viết</p>
                  <Button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                      setSortBy("newest");
                      setCurrentPage(1);
                    }}
                    className="bg-pink-500 hover:bg-pink-600 text-white"
                  >
                    Xóa tất cả bộ lọc
                  </Button>
                </div>
              )
            )}
          </div>
        </section>
      </main>
    </div>
  );
};