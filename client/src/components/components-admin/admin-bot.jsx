import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useDebounce } from "@/hook/search/useDebounce";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Plus, Edit, Trash2, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { botService } from "@/services/bot.services";
import toast from "react-hot-toast";

export const AdminBot = () => {
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingBot, setEditingBot] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12,
  });
  const [filters, setFilters] = useState({
    search: "",
  });

  const debouncedSearch = useDebounce(filters.search, 500);

  // Load bots với phân trang và search
  const loadBots = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: pagination.itemsPerPage,
        search: debouncedSearch,
      };
      const data = await botService.getAllBots(params);

      setBots(data.data);
      setPagination((prev) => ({
        ...prev,
        currentPage: data.page,
        totalPages: data.totalPages,
        totalItems: data.total,
      }));
    } catch (error) {
      toast.error("Không thể tải danh sách bot!");
    } finally {
      setLoading(false);
    }
  };

  // Reload khi search thay đổi
  useEffect(() => {
    loadBots(1);
  }, [debouncedSearch]);

  // Chia keywords
  const safeSplit = (value) => {
    if (Array.isArray(value)) return value.filter((v) => v && v.trim());
    if (typeof value === "string") return value.split(",").map((v) => v.trim()).filter(Boolean);
    return [];
  };

  // Thêm bot
  const handleAdd = async (botData) => {
    try {
      const payload = {
        ...botData,
        keywords: safeSplit(botData.keywords),
      };
      await botService.createBot(payload);
      toast.success("Thêm bot thành công!");
      setShowForm(false);
      loadBots();
    } catch (error) {
      toast.error(error.message || "Thêm bot thất bại!");
    }
  };

  // Cập nhật bot
  const handleEdit = async (botData) => {
    try {
      const payload = {
        ...botData,
        keywords: safeSplit(botData.keywords),
      };
      await botService.updateBot(editingBot._id, payload);
      toast.success("Cập nhật bot thành công!");
      setEditingBot(null);
      setShowForm(false);
      loadBots();
    } catch (error) {
      toast.error(error.message || "Cập nhật bot thất bại!");
    }
  };

  // Xóa bot
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa bot này?")) return;
    try {
      await botService.deleteBot(id);
      toast.success("Xóa bot thành công!");
      loadBots();
    } catch (error) {
      toast.error(error.message || "Xóa bot thất bại!");
    }
  };

  return (
    <div className="h-screen w-full bg-gray-50 flex flex-col overflow-hidden">
      <div className="flex-1 p-4 sm:p-6 space-y-6 overflow-y-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Quản lý Bot</h2>
          <div className="flex gap-2">
            <Input
              placeholder="Tìm kiếm..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="max-w-xs"
              prefix={<Search className="h-4 w-4 mr-2 text-gray-400" />}
            />
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center"
              onClick={() => {
                setEditingBot(null);
                setShowForm(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" /> Thêm Bot
            </Button>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">
              {editingBot ? "Chỉnh sửa Bot" : "Thêm Bot Mới"}
            </h3>
            <BotForm
              bot={editingBot}
              onSubmit={editingBot ? handleEdit : handleAdd}
              onCancel={() => {
                setShowForm(false);
                setEditingBot(null);
              }}
            />
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keywords</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Response</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-2 text-gray-500">Đang tải...</span>
                      </div>
                    </td>
                  </tr>
                ) : bots.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                      Không có bot nào.
                    </td>
                  </tr>
                ) : (
                  bots.map((bot) => (
                    <tr key={bot._id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-4 py-4">{bot.keywords.join(", ")}</td>
                      <td className="px-4 py-4">{bot.response}</td>
                      <td className="px-4 py-4">
                        <Badge variant={bot.isActive ? "success" : "secondary"} className="text-xs">
                          {bot.isActive ? "Bật" : "Tắt"}
                        </Badge>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingBot(bot);
                              setShowForm(true);
                            }}
                            className="h-8 w-8 p-0"
                            title={`Chỉnh sửa bot`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(bot._id)}
                            className="h-8 w-8 p-0 text-red-500 border-red-200 hover:bg-red-50 hover:border-red-300"
                            title={`Xóa bot`}
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
                {/* Thông tin kết quả */}
                <div className="text-sm text-gray-700">
                  Hiển thị {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} đến{" "}
                  {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} trong tổng số{" "}
                  {pagination.totalItems} kết quả
                </div>

                {/* Nút phân trang */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.currentPage <= 1}
                    onClick={() => loadBots(pagination.currentPage - 1)}
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
                          onClick={() => loadBots(pageNum)}
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
                    disabled={pagination.currentPage >= pagination.totalPages}
                    onClick={() => loadBots(pagination.currentPage + 1)}
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

// BotForm component
function BotForm({ bot, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    keywords: bot?.keywords?.join(", ") || "",
    response: bot?.response || "",
    isActive: bot?.isActive ?? true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label className="block text-sm font-medium mb-2 text-gray-700">Keywords <span className="text-red-500">*</span></Label>
        <Input
          value={formData.keywords}
          onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
          placeholder="Nhập từ khóa, phân cách bằng dấu phẩy"
          required
        />
      </div>
      <div>
        <Label className="block text-sm font-medium mb-2 text-gray-700">Response <span className="text-red-500">*</span></Label>
        <Textarea
          value={formData.response}
          onChange={(e) => setFormData({ ...formData, response: e.target.value })}
          placeholder="Nhập câu trả lời của bot"
          required
        />
      </div>
      <div>
        <Label className="block text-sm font-medium mb-2 text-gray-700">Trạng thái</Label>
        <Select
          value={formData.isActive ? "true" : "false"}
          onValueChange={(val) => setFormData({ ...formData, isActive: val === "true" })}
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
      <div className="flex gap-3 pt-6 border-t border-gray-200">
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white flex-1">
          {bot ? "Cập nhật Bot" : "Thêm Bot Mới"}
        </Button>
        <Button type="button" variant="outline" className="flex-1" onClick={onCancel}>Hủy</Button>
      </div>
    </form>
  );
}
