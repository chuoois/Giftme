import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useDebounce } from "@/hook/search/useDebounce";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Plus, Edit, Trash2, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { contentService } from "@/services/content.services";
import toast from "react-hot-toast";

export const AdminContent = () => {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [filters, setFilters] = useState({
    search: "",
    sort: "desc",
  });

  const debouncedSearch = useDebounce(filters.search, 500);

  const loadContents = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: pagination.itemsPerPage,
        search: debouncedSearch,
        sort: filters.sort,
      };
      const data = await contentService.getAllContent(params);
      setContents(data.data || []);
      setPagination({
        ...pagination,
        currentPage: data.page,
        totalPages: data.totalPages,
        totalItems: data.total,
        hasNextPage: data.page < data.totalPages,
        hasPrevPage: data.page > 1,
      });
    } catch (error) {
      toast.error("Không thể tải danh sách nội dung!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContents(pagination.currentPage);
  }, [debouncedSearch, filters.sort, pagination.currentPage]);

  const safeSplit = (value) => {
    if (Array.isArray(value)) {
      return value.filter((item) => item && item.trim());
    }
    if (typeof value === "string") {
      return value.split(", ").filter((item) => item && item.trim());
    }
    return [];
  };

  const handleAdd = async (contentData) => {
    try {
      const payload = {
        ...contentData,
        tags: safeSplit(contentData.tags),
      };
      await contentService.createContent(payload);
      toast.success("Thêm nội dung thành công!");
      setShowForm(false);
      loadContents(pagination.currentPage);
    } catch (error) {
      toast.error(error.message || "Thêm nội dung thất bại!");
    }
  };

  const handleEdit = async (contentData) => {
    try {
      const payload = {
        ...contentData,
        tags: safeSplit(contentData.tags),
      };
      await contentService.updateContent(editingContent._id, payload);
      toast.success("Cập nhật nội dung thành công!");
      setEditingContent(null);
      setShowForm(false);
      loadContents(pagination.currentPage);
    } catch (error) {
      toast.error(error.message || "Cập nhật nội dung thất bại!");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa nội dung này?")) {
      try {
        await contentService.deleteContent(id);
        toast.success("Xóa nội dung thành công!");
        loadContents(pagination.currentPage);
      } catch (error) {
        toast.error(error.message || "Xóa nội dung thất bại!");
      }
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: page }));
    }
  };

  return (
    <div className="h-screen w-full bg-gray-50 flex flex-col overflow-hidden">
      <div className="flex-1 p-4 sm:p-6 space-y-6 overflow-y-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-2xl font-bold text-gray-900">Quản lý Nội Dung</h2>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  className="pl-10 w-full sm:w-64"
                  placeholder="Tìm kiếm nội dung..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </div>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap"
                onClick={() => {
                  setEditingContent(null);
                  setShowForm(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Thêm nội dung
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
            <div>
              <Label className="block text-sm font-medium mb-2 text-gray-700">Sắp xếp</Label>
              <Select
                value={filters.sort}
                onValueChange={(val) => setFilters({ ...filters, sort: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn cách sắp xếp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Mới nhất</SelectItem>
                  <SelectItem value="asc">Cũ nhất</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">
              {editingContent ? "Chỉnh sửa Nội Dung" : "Thêm Nội Dung Mới"}
            </h3>
            <ContentForm
              content={editingContent}
              onSubmit={editingContent ? handleEdit : handleAdd}
              onCancel={() => {
                setShowForm(false);
                setEditingContent(null);
              }}
            />
          </div>
        )}

        {/* Table Container */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                    Hình ảnh
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tiêu đề
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mô tả
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày tạo
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thẻ
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-2 text-gray-500">Đang tải...</span>
                      </div>
                    </td>
                  </tr>
                ) : contents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                      Không có nội dung nào.
                    </td>
                  </tr>
                ) : (
                  contents.map((content) => (
                    <tr key={content._id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-4 py-4">
                        <img
                          src={content.img || "/placeholder.svg"}
                          alt={content.title}
                          className="w-16 h-16 object-cover rounded-lg shadow-sm"
                          onError={(e) => {
                            e.target.src = "/placeholder.svg";
                          }}
                        />
                      </td>
                      <td className="px-4 py-4">
                        <div className="max-w-full">
                          <div className="font-medium text-gray-900 truncate">{content.title}</div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {content.description?.slice(0, 50)}...
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <Badge variant={content.enable ? "success" : "secondary"} className="text-xs">
                          {content.enable ? "Bật" : "Tắt"}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {new Date(content.createdAt).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="px-4 py-4">
                        {content.tags?.map((tag, index) => (
                          <Badge key={index} className="bg-blue-100 text-blue-800 mr-1">
                            {tag}
                          </Badge>
                        ))}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingContent(content);
                              setShowForm(true);
                            }}
                            className="h-8 w-8 p-0"
                            title={`Chỉnh sửa ${content.title}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(content._id)}
                            className="h-8 w-8 p-0 text-red-500 border-red-200 hover:bg-red-50 hover:border-red-300"
                            title={`Xóa ${content.title}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-700">
                  Hiển thị {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} đến{" "}
                  {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} trong tổng số{" "}
                  {pagination.totalItems} kết quả
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!pagination.hasPrevPage}
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    className="h-8"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="flex items-center gap-1">
                    {[...Array(Math.min(pagination.totalPages, 5))].map((_, index) => {
                      let pageNum;
                      if (pagination.totalPages <= 5) {
                        pageNum = index + 1;
                      } else if (pagination.currentPage <= 3) {
                        pageNum = index + 1;
                      } else if (pagination.currentPage >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + index;
                      } else {
                        pageNum = pagination.currentPage - 2 + index;
                      }
                      return (
                        <Button
                          key={pageNum}
                          variant={pagination.currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(pageNum)}
                          className="h-8 w-8 p-0"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!pagination.hasNextPage}
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    className="h-8"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function ContentForm({ content, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: content?.title || "",
    img: content?.img || "",
    description: content?.description || "",
    tags: Array.isArray(content?.tags) ? content.tags.join(", ") : (content?.tags || ""),
    enable: content?.enable || false,
  });

  const [uploading, setUploading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label className="block text-sm font-medium mb-2 text-gray-700">
              Tiêu đề <span className="text-red-500">*</span>
            </Label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="w-full"
            />
          </div>
          <div>
            <Label className="block text-sm font-medium mb-2 text-gray-700">
              Thẻ (phân cách bằng dấu phẩy)
            </Label>
            <Input
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="Ví dụ: nội dung, nổi bật, trang chủ"
              className="w-full"
            />
          </div>
          <div>
            <Label className="block text-sm font-medium mb-2 text-gray-700">
              Trạng thái
            </Label>
            <Select
              value={formData.enable ? "true" : "false"}
              onValueChange={(val) => setFormData({ ...formData, enable: val === "true" })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Bật</SelectItem>
                <SelectItem value="false">Tắt</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <Label className="block text-sm font-medium mb-2 text-gray-700">
              Hình ảnh chính <span className="text-red-500">*</span>
            </Label>
            <Input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files[0];
                if (!file) return;

                setUploading(true);
                const formDataUpload = new FormData();
                formDataUpload.append("file", file);
                formDataUpload.append("upload_preset", "giftme");

                try {
                  const res = await fetch(
                    "https://api.cloudinary.com/v1_1/dqh0zio2c/image/upload",
                    {
                      method: "POST",
                      body: formDataUpload,
                    }
                  );
                  const data = await res.json();
                  setFormData((prev) => ({ ...prev, img: data.secure_url }));
                  toast.success("Upload ảnh thành công!");
                } catch (err) {
                  toast.error("Upload ảnh thất bại!");
                } finally {
                  setUploading(false);
                }
              }}
              className="w-full"
            />
            {formData.img && (
              <div className="mt-3">
                <img
                  src={formData.img}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <div>
        <Label className="block text-sm font-medium mb-2 text-gray-700">
          Mô tả <span className="text-red-500">*</span>
        </Label>
        <Textarea
          className="w-full min-h-[200px] resize-y"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Nhập mô tả nội dung..."
          required
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
        <Button
          type="submit"
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2"
          disabled={uploading}
        >
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Đang xử lý...
            </>
          ) : (
            content ? "Cập nhật nội dung" : "Thêm nội dung mới"
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1 sm:flex-none sm:min-w-[120px]"
          disabled={uploading}
        >
          Hủy bỏ
        </Button>
      </div>
    </form>
  );
};