import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  ResponsiveContainer,
  AreaChart,
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
} from "lucide-react";
import { analyticsService } from '@/services/analytics.services';

export const AdminDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Gọi API để lấy dữ liệu phân tích
    analyticsService.getAnalyticsData()
      .then(data => setAnalyticsData(data))
      .catch(err => setError('Không thể tải dữ liệu phân tích'));
  }, []);

  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!analyticsData) return <div className="p-6">Đang tải...</div>;

  return (
    <div className="p-6 overflow-auto flex-1 space-y-6">
      <h2 className="text-2xl font-bold">Tổng quan</h2>

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
              <span className="text-blue-600">+12.5%</span> so với tháng trước
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
              <span className="text-green-600">+8.2%</span> so với tháng trước
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
              <span className="text-red-600">+2.1%</span> so với tháng trước
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
              <span className="text-purple-600">+5.3%</span> so với tháng trước
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
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analyticsData.pageViews}>
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
                <Bar type="monotone" dataKey="views" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} />
                <Bar type="monotone" dataKey="sessions" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} />
              </AreaChart>
            </ResponsiveContainer>
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
            <div className="flex justify-center gap-4 mt-4">
              {analyticsData.deviceTypes.map((device, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: device.color }} />
                  <span className="text-sm">{device.name}: {device.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trang nhiều view nhất */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Trang được xem nhiều nhất</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.topPages.map((page, index) => (
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
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Người dùng quay lại</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {Number(analyticsData.totalStats.returningUsers).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Tỷ lệ người dùng mới</span>
                  <span>
                    {(
                      (analyticsData.totalStats.newUsers /
                        (analyticsData.totalStats.newUsers + analyticsData.totalStats.returningUsers)) *
                      100
                    ).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-orange-600 h-2 rounded-full"
                    style={{
                      width: `${
                        (analyticsData.totalStats.newUsers /
                          (analyticsData.totalStats.newUsers + analyticsData.totalStats.returningUsers)) *
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
