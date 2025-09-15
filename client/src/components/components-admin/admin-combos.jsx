import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useDebounce } from "@/hook/search/useDebounce";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Plus, Edit, Trash2, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { comboService } from "@/services/combo.services";
import toast from "react-hot-toast";

export const AdminCombos = () => {
  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCombo, setEditingCombo] = useState(null);
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
    category: "all",
    occasion: "all",
    sortBy: "popular",
  });

  const debouncedSearch = useDebounce(filters.search, 500);

  const loadCombos = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: pagination.itemsPerPage,
        search: debouncedSearch,
        category: filters.category === "all" ? "" : filters.category,
        occasion: filters.occasion === "all" ? "" : filters.occasion,
        sortBy: filters.sortBy,
      };
      const data = await comboService.getComboList(params);
      setCombos(data.data.combos || []);
      setPagination(data.data.pagination);
    } catch (error) {
      toast.error("Không thể tải danh sách combo!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCombos(pagination.currentPage);
  }, [debouncedSearch, filters.category, filters.occasion, filters.sortBy, pagination.currentPage]);

  const safeSplit = (value) => {
    if (Array.isArray(value)) {
      return value.filter((item) => item && item.trim());
    }
    if (typeof value === "string") {
      return value.split(", ").filter((item) => item && item.trim());
    }
    return [];
  };

  const handleAdd = async (comboData) => {
    try {
      const payload = {
        ...comboData,
        badge: comboData.badge === "none" ? "" : comboData.badge,
        features: safeSplit(comboData.features),
        includes: safeSplit(comboData.includes),
        gallery: safeSplit(comboData.gallery),
      };
      await comboService.addCombo(payload);
      toast.success("Thêm combo thành công!");
      setShowForm(false);
      loadCombos(pagination.currentPage);
    } catch (error) {
      toast.error(error.message || "Thêm combo thất bại!");
    }
  };

  const handleEdit = async (comboData) => {
    try {
      const payload = {
        ...comboData,
        badge: comboData.badge === "none" ? "" : comboData.badge,
        features: safeSplit(comboData.features),
        includes: safeSplit(comboData.includes),
        gallery: safeSplit(comboData.gallery),
      };
      await comboService.editCombo(editingCombo._id, payload);
      toast.success("Cập nhật combo thành công!");
      setEditingCombo(null);
      setShowForm(false);
      loadCombos(pagination.currentPage);
    } catch (error) {
      toast.error(error.message || "Cập nhật combo thất bại!");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa combo này?")) {
      try {
        await comboService.deleteCombo(id);
        toast.success("Xóa combo thành công!");
        loadCombos(pagination.currentPage);
      } catch (error) {
        toast.error(error.message || "Xóa combo thất bại!");
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
            <h2 className="text-2xl font-bold text-gray-900">Quản lý Combo</h2>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  className="pl-10 w-full sm:w-64"
                  placeholder="Tìm kiếm combo..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </div>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap"
                onClick={() => {
                  setEditingCombo(null);
                  setShowForm(true);
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Thêm combo
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label className="block text-sm font-medium mb-2 text-gray-700">Danh mục</Label>
              <Select
                value={filters.category}
                onValueChange={(val) => setFilters({ ...filters, category: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="Combo Cao Cấp">Combo Cao Cấp</SelectItem>
                  <SelectItem value="Combo Tiết Kiệm">Combo Tiết Kiệm</SelectItem>
                  <SelectItem value="Combo Theo Dịp">Combo Theo Dịp</SelectItem>
                  <SelectItem value="Combo Sinh Nhật">Combo Sinh Nhật</SelectItem>
                  <SelectItem value="Combo Tết">Combo Tết</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="block text-sm font-medium mb-2 text-gray-700">Dịp tặng</Label>
              <Select
                value={filters.occasion}
                onValueChange={(val) => setFilters({ ...filters, occasion: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn dịp tặng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="Valentine">Valentine</SelectItem>
                  <SelectItem value="8/3">8/3</SelectItem>
                  <SelectItem value="20/10">20/10</SelectItem>
                  <SelectItem value="Noel">Noel</SelectItem>
                  <SelectItem value="Sinh Nhật">Sinh Nhật</SelectItem>
                  <SelectItem value="Tết Nguyên Đán">Tết Nguyên Đán</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="block text-sm font-medium mb-2 text-gray-700">Sắp xếp</Label>
              <Select
                value={filters.sortBy}
                onValueChange={(val) => setFilters({ ...filters, sortBy: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn cách sắp xếp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Phổ biến</SelectItem>
                  <SelectItem value="price_low">Giá thấp đến cao</SelectItem>
                  <SelectItem value="price_high">Giá cao đến thấp</SelectItem>
                  <SelectItem value="discount">Giảm giá</SelectItem>
                  <SelectItem value="name_az">Tên A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">
              {editingCombo ? "Chỉnh sửa Combo" : "Thêm Combo Mới"}
            </h3>
            <ComboForm
              combo={editingCombo}
              onSubmit={editingCombo ? handleEdit : handleAdd}
              onCancel={() => {
                setShowForm(false);
                setEditingCombo(null);
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
                    Tên
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Danh mục
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dịp tặng
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giá
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giá gốc
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giảm giá
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nhãn
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-2 text-gray-500">Đang tải...</span>
                      </div>
                    </td>
                  </tr>
                ) : combos.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                      Không có combo nào.
                    </td>
                  </tr>
                ) : (
                  combos.map((combo) => (
                    <tr key={combo._id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-4 py-4">
                        <img
                          src={combo.image || "/placeholder.svg"}
                          alt={combo.name}
                          className="w-16 h-16 object-cover rounded-lg shadow-sm"
                          onError={(e) => {
                            e.target.src = "/placeholder.svg";
                          }}
                        />
                      </td>
                      <td className="px-4 py-4">
                        <div className="max-w-full">
                          <div className="font-medium text-gray-900 truncate">{combo.name}</div>
                          <div className="text-sm text-gray-500 truncate">
                            {combo.description?.slice(0, 50)}...
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <Badge variant="secondary" className="text-xs">
                          {combo.category}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {combo.occasion}
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-medium text-gray-900">
                          {combo.price?.toLocaleString()}đ
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500">
                        {combo.originalPrice?.toLocaleString()}đ
                      </td>
                      <td className="px-4 py-4">
                        {combo.discount > 0 && (
                          <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200">
                            -{combo.discount}%
                          </Badge>
                        )}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">
                        {combo.badge ? (
                          <Badge className="bg-blue-100 text-blue-800">
                            {combo.badge}
                          </Badge>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingCombo(combo);
                              setShowForm(true);
                            }}
                            className="h-8 w-8 p-0"
                            title={`Chỉnh sửa ${combo.name}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(combo._id)}
                            className="h-8 w-8 p-0 text-red-500 border-red-200 hover:bg-red-50 hover:border-red-300"
                            title={`Xóa ${combo.name}`}
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

// ComboForm component remains unchanged
function ComboForm({ combo, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: combo?.name || "",
    price: combo?.price || 0,
    originalPrice: combo?.originalPrice || 0,
    image: combo?.image || "",
    badge: combo?.badge || "none",
    discount: combo?.discount || 0,
    category: combo?.category || "",
    occasion: combo?.occasion || "",
    priceRange: combo?.priceRange || "",
    description: combo?.description || "",
    features: Array.isArray(combo?.features) ? combo.features.join(", ") : (combo?.features || ""),
    includes: Array.isArray(combo?.includes) ? combo.includes.join(", ") : (combo?.includes || ""),
    gallery: Array.isArray(combo?.gallery) ? combo.gallery : (typeof combo?.gallery === 'string' ? combo.gallery.split(", ") : []),
  });

  const [uploading, setUploading] = useState(false);

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    setUploading(true);
    try {
      const uploadPromises = files.map(async (file) => {
        const formDataUpload = new FormData();
        formDataUpload.append("file", file);
        formDataUpload.append("upload_preset", "giftme");

        const res = await fetch(
          "https://api.cloudinary.com/v1_1/dqh0zio2c/image/upload",
          {
            method: "POST",
            body: formDataUpload,
          }
        );
        const data = await res.json();
        return data.secure_url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      setFormData((prev) => ({
        ...prev,
        gallery: [...prev.gallery, ...uploadedUrls].filter((url) => url && url.trim()),
      }));
      toast.success("Upload bộ sưu tập ảnh thành công!");
    } catch (err) {
      toast.error("Upload bộ sưu tập ảnh thất bại!");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveGalleryImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const originalPrice = Number(formData.originalPrice);
    const discount = Number(formData.discount);
    const calculatedPrice = discount > 0
      ? Math.round(originalPrice * (1 - discount / 100))
      : originalPrice;

    onSubmit({
      ...formData,
      price: calculatedPrice,
      originalPrice: originalPrice,
      discount: discount,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label className="block text-sm font-medium mb-2 text-gray-700">
              Tên combo <span className="text-red-500">*</span>
            </Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full"
            />
          </div>
          <div>
            <Label className="block text-sm font-medium mb-2 text-gray-700">
              Danh mục <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.category}
              onValueChange={(val) => setFormData({ ...formData, category: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Combo Cao Cấp">Combo Cao Cấp</SelectItem>
                <SelectItem value="Combo Tiết Kiệm">Combo Tiết Kiệm</SelectItem>
                <SelectItem value="Combo Theo Dịp">Combo Theo Dịp</SelectItem>
                <SelectItem value="Combo Sinh Nhật">Combo Sinh Nhật</SelectItem>
                <SelectItem value="Combo Tết">Combo Tết</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="block text-sm font-medium mb-2 text-gray-700">
              Dịp tặng <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.occasion}
              onValueChange={(val) => setFormData({ ...formData, occasion: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn dịp tặng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Valentine">Valentine</SelectItem>
                <SelectItem value="8/3">8/3</SelectItem>
                <SelectItem value="20/10">20/10</SelectItem>
                <SelectItem value="Noel">Noel</SelectItem>
                <SelectItem value="Sinh Nhật">Sinh Nhật</SelectItem>
                <SelectItem value="Tết Nguyên Đán">Tết Nguyên Đán</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="block text-sm font-medium mb-2 text-gray-700">Nhãn</Label>
            <Select
              value={formData.badge}
              onValueChange={(val) => setFormData({ ...formData, badge: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn nhãn" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Không nhãn</SelectItem>
                <SelectItem value="HOT">HOT</SelectItem>
                <SelectItem value="NEW">NEW</SelectItem>
                <SelectItem value="SALE">SALE</SelectItem>
                <SelectItem value="LIMITED">LIMITED</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <Label className="block text-sm font-medium mb-2 text-gray-700">
              Giá gốc (đ) <span className="text-red-500">*</span>
            </Label>
            <Input
              type="number"
              value={formData.originalPrice}
              onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
              required
              className="w-full"
            />
          </div>
          <div>
            <Label className="block text-sm font-medium mb-2 text-gray-700">Giảm giá (%)</Label>
            <Input
              type="number"
              value={formData.discount}
              onChange={(e) => setFormData({ ...formData, discount: Number(e.target.value) })}
              className="w-full"
            />
          </div>
          {formData.originalPrice > 0 && formData.discount > 0 && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Label className="block text-sm font-medium text-blue-800 mb-1">Giá sau giảm:</Label>
              <div className="text-lg font-bold text-blue-900">
                {Math.round(formData.originalPrice * (1 - formData.discount / 100)).toLocaleString()}đ
              </div>
            </div>
          )}
          <div>
            <Label className="block text-sm font-medium mb-2 text-gray-700">Phạm vi giá</Label>
            <Select
              value={formData.priceRange}
              onValueChange={(val) => setFormData({ ...formData, priceRange: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn phạm vi giá" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Dưới 100K">Dưới 100K</SelectItem>
                <SelectItem value="100K-300K">100K-300K</SelectItem>
                <SelectItem value="300K-500K">300K-500K</SelectItem>
                <SelectItem value="500K-1M">500K-1M</SelectItem>
                <SelectItem value="Trên 1M">Trên 1M</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                setFormData((prev) => ({ ...prev, image: data.secure_url }));
                toast.success("Upload ảnh thành công!");
              } catch (err) {
                toast.error("Upload ảnh thất bại!");
              }
            }}
            className="w-full"
          />
          {formData.image && (
            <div className="mt-3">
              <img
                src={formData.image}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
              />
            </div>
          )}
        </div>
        <div>
          <Label className="block text-sm font-medium mb-2 text-gray-700">
            Bộ sưu tập ảnh
          </Label>
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={handleGalleryUpload}
            disabled={uploading}
            className="w-full"
          />
          {uploading && (
            <div className="mt-2 text-sm text-blue-600 flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              Đang upload...
            </div>
          )}
          {formData.gallery.length > 0 && (
            <div className="mt-3 grid grid-cols-3 gap-2">
              {formData.gallery.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`Gallery image ${index + 1}`}
                    className="w-full h-20 object-cover rounded-lg border-2 border-gray-200"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleRemoveGalleryImage(index)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <Label className="block text-sm font-medium mb-2 text-gray-700">
            Mô tả <span className="text-red-500">*</span>
          </Label>
          <Textarea
            className="w-full min-h-[100px] resize-y"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Nhập mô tả chi tiết về combo..."
            required
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <Label className="block text-sm font-medium mb-2 text-gray-700">
              Tính năng (phân cách bằng dấu phẩy)
            </Label>
            <Input
              value={formData.features}
              onChange={(e) => setFormData({ ...formData, features: e.target.value })}
              placeholder="Ví dụ: Giao hàng miễn phí, Thiết kế độc đáo, Chất lượng cao"
              className="w-full"
            />
          </div>
          <div>
            <Label className="block text-sm font-medium mb-2 text-gray-700">
              Bao gồm (phân cách bằng dấu phẩy)
            </Label>
            <Input
              value={formData.includes}
              onChange={(e) => setFormData({ ...formData, includes: e.target.value })}
              placeholder="Ví dụ: 1 bó hoa hồng, 1 hộp chocolate, Thiệp chúc mừng"
              className="w-full"
            />
          </div>
        </div>
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
            combo ? "Cập nhật combo" : "Thêm combo mới"
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
}