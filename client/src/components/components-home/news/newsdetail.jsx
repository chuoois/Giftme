import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Clock,
  User,
  ArrowLeft,
  BookOpen,
  Tag,
} from "lucide-react";
import { newsService } from "@/services/news.services";

export const NewsDetail = () => {
  const params = useParams();
  const articleId = params.id;
  const navigate = useNavigate();

  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch article and related articles
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Fetch article detail
        const articleResponse = await newsService.getNewsDetail(articleId);
        setArticle(articleResponse);

        // Fetch suggested news
        const suggestedResponse = await newsService.getSuggestedNews(articleId);
        setRelatedArticles(suggestedResponse.data || []);
      } catch (err) {
        setError("Không thể tải thông tin bài viết hoặc bài viết liên quan. Vui lòng thử lại sau.");
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    window.scrollTo(0, 0);
  }, [articleId]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Đang tải thông tin bài viết...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{error || "Không tìm thấy bài viết"}</h1>
          <Button onClick={() => navigate("/news")} className="bg-pink-500 hover:bg-pink-600 text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay về danh sách tin tức
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main>
        {/* Breadcrumb */}
        <section className="bg-gray-50 py-4">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Link to="/" className="hover:text-pink-500">
                Trang chủ
              </Link>
              <span>/</span>
              <Link to="/news" className="hover:text-pink-500">
                Tin tức
              </Link>
              <span>/</span>
              <span className="text-gray-900">{article.title}</span>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {/* Back Button */}
              <Link to="/news">
                <Button variant="outline" className="mb-6 bg-transparent">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Quay lại danh sách tin tức
                </Button>
              </Link>

              {/* Article Header */}
              <div className="space-y-6 mb-8">
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-blue-500 text-white">{article.category}</Badge>
                    {article.featured && <Badge className="bg-pink-500 text-white">Nổi bật</Badge>}
                  </div>

                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">{article.title}</h1>

                  <p className="text-xl text-gray-600 leading-relaxed">{article.excerpt}</p>
                </div>

                {/* Article Meta */}
                <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y">
                  <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{article.author}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(article.publishDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{article.readTime} phút đọc</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Featured Image */}
              <div className="mb-8">
                <img
                  src={article.image || "/placeholder.svg"}
                  alt={article.title}
                  className="w-full h-64 md:h-96 object-cover rounded-lg"
                />
              </div>

              {/* Article Content */}
              <div className="prose prose-lg max-w-none mb-8">
                <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: article.content }} />
              </div>

              {/* Tags */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Thẻ:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator className="my-8" />

              {/* Related Articles */}
              {relatedArticles.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-6">
                    <BookOpen className="w-5 h-5 text-gray-500" />
                    <h3 className="text-xl font-bold text-gray-900">Bài viết liên quan</h3>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    {relatedArticles.map((relatedArticle) => (
                      <Link
                        key={relatedArticle._id}
                        to={`/news/${relatedArticle._id}#${relatedArticle.title.replace(/\s+/g, "-").toLowerCase()}`}
                      >
                        <Card className="group hover:shadow-xl transition-all duration-300 border-0 overflow-hidden bg-white cursor-pointer">
                          <CardContent className="p-0">
                            <div className="relative overflow-hidden">
                              <img
                                src={relatedArticle.image || "/placeholder.svg"}
                                alt={relatedArticle.title}
                                className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <Badge className="absolute top-2 right-2 bg-blue-500 text-white text-xs border-0">
                                {relatedArticle.category}
                              </Badge>
                            </div>
                            <div className="p-4 space-y-2">
                              <h4 className="font-semibold text-sm text-card-foreground line-clamp-2 leading-5">
                                {relatedArticle.title}
                              </h4>
                              <div className="flex items-center justify-between text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  <span>{formatDate(relatedArticle.publishDate)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{relatedArticle.readTime} phút đọc</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};