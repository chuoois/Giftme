import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  BarChart3,
  Eye,
  MousePointer,
  TrendingUp,
  Clock,
  Globe,
  RefreshCw,
} from "lucide-react";
import { analyticsService } from '@/services/analytics.services';
import toast from 'react-hot-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export const AdminDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    startDate: '30daysAgo',
    endDate: 'today',
    pageViewsDays: '7daysAgo',
  });

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await analyticsService.getAnalyticsData(filters);
      // Chuyển đổi định dạng ngày và giá trị trong dữ liệu
      const formattedData = {
        ...data,
        pageViews: data.pageViews.map(item => ({
          ...item,
          date: item.date.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3"), // Chuyển 20250917 thành 2025-09-17
        })),
        deviceTypes: data.deviceTypes.map(device => ({
          ...device,
          value: parseFloat(device.value), // Chuyển chuỗi thành số
        })),
      };
      setAnalyticsData(formattedData);
      if (data.warnings) {
        toast(data.warnings.join(', '), { icon: '⚠️' });
      }
    } catch (err) {
      console.error('Lỗi khi lấy dữ liệu:', err);
      setError(err.message || 'Không thể tải dữ liệu phân tích');
      toast.error(err.message || 'Không thể tải dữ liệu phân tích');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const newData = await analyticsService.refreshData(filters);
      const formattedData = {
        ...newData,
        pageViews: newData.pageViews.map(item => ({
          ...item,
          date: item.date.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3"),
        })),
        deviceTypes: newData.deviceTypes.map(device => ({
          ...device,
          value: parseFloat(device.value),
        })),
      };
      setAnalyticsData(formattedData);
      toast.success('Dữ liệu đã được làm mới');
    } catch (err) {
      console.error('Lỗi khi làm mới dữ liệu:', err);
      setError(err.message || 'Không thể làm mới dữ liệu');
      toast.error(err.message || 'Không thể làm mới dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!analyticsData) return <div className="p-6">Đang tải...</div>;

  // Hàm định dạng phần trăm thay đổi
  const formatPercentChange = (value) => {
    if (value === undefined || value === null || isNaN(parseFloat(value))) {
      return <span className="text-muted-foreground">Chưa có dữ liệu</span>;
    }
    const num = parseFloat(value);
    return (
      <span className={num >= 0 ? 'text-green-600' : 'text-red-600'}>
        {num >= 0 ? '+' : ''}{value}%
      </span>
    );
  };

  return (
    <div className="p-6 overflow-auto flex-1 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Tổng quan</h2>
        <div className="flex items-center gap-4">
          <Select
            value={filters.startDate}
            onValueChange={(value) => handleFilterChange('startDate', value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Chọn ngày bắt đầu" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7daysAgo">7 ngày trước</SelectItem>
              <SelectItem value="30daysAgo">30 ngày trước</SelectItem>
              <SelectItem value="90daysAgo">90 ngày trước</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filters.pageViewsDays}
            onValueChange={(value) => handleFilterChange('pageViewsDays', value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Lượt xem theo ngày" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7daysAgo">7 ngày</SelectItem>
              <SelectItem value="30daysAgo">30 ngày</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleRefresh} disabled={loading} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            {loading ? 'Đang làm mới...' : 'Làm mới dữ liệu'}
          </Button>
        </div>
      </div>

      {/* 4 chỉ số đầu */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lượt xem trang</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Number(analyticsData.totalStats.totalPageViews).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {formatPercentChange(analyticsData.totalStats.percentChange.totalPageViews)} so với tháng trước
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Phiên làm việc</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Number(analyticsData.totalStats.totalSessions).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {formatPercentChange(analyticsData.totalStats.percentChange.totalSessions)} so với tháng trước
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tỷ lệ thoát</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalStats.bounceRate}%</div>
            <p className="text-xs text-muted-foreground">
              {formatPercentChange(analyticsData.totalStats.percentChange.bounceRate)} so với tháng trước
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Thời gian trung bình</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalStats.avgSessionDuration}</div>
            <p className="text-xs text-muted-foreground">
              {formatPercentChange(analyticsData.totalStats.percentChange.avgSessionDuration)} so với tháng trước
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Biểu đồ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Lượt xem theo ngày
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analyticsData.pageViews && analyticsData.pageViews.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analyticsData.pageViews}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) =>
                      new Date(value).toLocaleDateString("vi-VN", { month: "short", day: "numeric" })
                    }
                  />
                  <YAxis />
                  <Tooltip
                    labelFormatter={(value) => new Date(value).toLocaleDateString("vi-VN")}
                    formatter={(value, name) => [value.toLocaleString(), name === "views" ? "Lượt xem" : "Phiên"]}
                  />
                  <Bar dataKey="views" fill="#3b82f6" name="Lượt xem" />
                  <Bar dataKey="sessions" fill="#f59e0b" name="Phiên" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="p-6 text-muted-foreground">Không có dữ liệu để hiển thị biểu đồ</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Thiết bị truy cập
            </CardTitle>
          </CardHeader>
          <CardContent>
            {analyticsData.deviceTypes && analyticsData.deviceTypes.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analyticsData.deviceTypes}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {analyticsData.deviceTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, "Tỷ lệ"]} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="p-6 text-muted-foreground">Không có dữ liệu thiết bị để hiển thị</div>
            )}
            <div className="flex justify-center gap-4 mt-4">
              {analyticsData.deviceTypes && analyticsData.deviceTypes.map((device, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: device.color }} />
                  <span className="text-sm">{device.name}: {device.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trang nhiều view nhất và Thống kê người dùng */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Trang được xem nhiều nhất</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.topPages && analyticsData.topPages.map((page, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium">{page.page}</div>
                    <div className="text-sm text-muted-foreground">{Number(page.views).toLocaleString()} lượt xem</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: `${page.percentage}%` }} />
                    </div>
                    <span className="text-sm font-medium w-10">{page.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Thống kê người dùng</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">Người dùng mới</div>
                  <div className="text-2xl font-bold text-orange-600">
                    {Number(analyticsData.totalStats.newUsers).toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatPercentChange(analyticsData.totalStats.percentChange.newUsers)} so với tháng trước
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Người dùng quay lại</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {Number(analyticsData.totalStats.returningUsers).toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {formatPercentChange(analyticsData.totalStats.percentChange.returningUsers)} so với tháng trước
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Tỷ lệ người dùng mới</span>
                  <span>
                    {(
                      (analyticsData.totalStats.newUsers /
                        (analyticsData.totalStats.newUsers + analyticsData.totalStats.returningUsers || 1)) *
                      100
                    ).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-orange-600 h-2 rounded-full"
                    style={{
                      width: `${(analyticsData.totalStats.newUsers /
                        (analyticsData.totalStats.newUsers + analyticsData.totalStats.returningUsers || 1)) *
                        100
                        }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};