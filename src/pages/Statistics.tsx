import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, CheckCircle, Clock, TrendingUp, FileSpreadsheet, Mail, FileText } from 'lucide-react';
import { mockStatistics } from '@/data/mockData';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

const COLORS = ['#DA251D', '#FFD700', '#2196F3', '#4CAF50', '#FF9800', '#9C27B0', '#00BCD4'];

export default function Statistics() {
  const [year, setYear] = useState('2025');
  const [quarter, setQuarter] = useState('all');
  const [unit, setUnit] = useState('all');

  const handleExport = (type: string) => {
    toast.success(`Đang xuất ${type}...`);
    setTimeout(() => {
      toast.success(`Xuất ${type} thành công`);
    }, 1000);
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold">Thống kê và Báo cáo</h1>
          <p className="text-muted-foreground mt-1">
            Tổng hợp và phân tích số liệu công tác Đảng
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-6 card-hover border-l-4 border-l-primary">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tổng số hoạt động năm 2025</p>
                <p className="text-3xl font-bold text-primary mt-2">{mockStatistics.totalActivities}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
            </div>
          </Card>

          <Card className="p-6 card-hover border-l-4 border-l-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Đang thực hiện</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">{mockStatistics.inProgress}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 card-hover border-l-4 border-l-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Đã hoàn thành</p>
                <p className="text-3xl font-bold text-green-600 mt-2">{mockStatistics.completed}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6 card-hover border-l-4 border-l-gold">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tỷ lệ hoàn thành</p>
                <p className="text-3xl font-bold text-gold mt-2">{mockStatistics.completionRate}%</p>
              </div>
              <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-gold" />
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Năm</label>
                <Select value={year} onValueChange={setYear}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Quý</label>
                <Select value={quarter} onValueChange={setQuarter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="all">Cả năm</SelectItem>
                    <SelectItem value="q1">Quý I</SelectItem>
                    <SelectItem value="q2">Quý II</SelectItem>
                    <SelectItem value="q3">Quý III</SelectItem>
                    <SelectItem value="q4">Quý IV</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Đơn vị</label>
                <Select value={unit} onValueChange={setUnit}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="vpdu">Văn phòng ĐU</SelectItem>
                    <SelectItem value="cb1">Chi bộ 1</SelectItem>
                    <SelectItem value="cb2">Chi bộ 2</SelectItem>
                    <SelectItem value="cb3">Chi bộ 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button className="bg-primary hover:bg-primary/90">Xem báo cáo</Button>
          </div>
        </Card>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h2 className="text-lg font-bold mb-4">Số lượng hoạt động theo loại hình</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockStatistics.byType}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#DA251D" name="Số lượng" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-bold mb-4">Phân bố theo đơn vị tổ chức</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mockStatistics.byUnit}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.unit}: ${entry.percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="percentage"
                >
                  {mockStatistics.byUnit.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        <Card className="p-6">
          <h2 className="text-lg font-bold mb-4">Xu hướng hoạt động theo tháng</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockStatistics.byMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#DA251D" strokeWidth={2} name="Số lượng hoạt động" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Detailed Tables */}
        <Card className="p-6">
          <h2 className="text-lg font-bold mb-4">Thống kê chi tiết theo loại hình</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Loại hình hoạt động</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Kế hoạch</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Đã thực hiện</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Đang thực hiện</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Tỷ lệ hoàn thành</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Tổng số người tham gia</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {mockStatistics.byType.map((item, index) => {
                  const planned = item.count;
                  const completed = Math.floor(item.count * 0.7);
                  const inProgress = Math.floor(item.count * 0.2);
                  const rate = Math.round((completed / planned) * 100);
                  const participants = item.count * 25;
                  
                  return (
                    <tr key={index} className="hover:bg-muted/20">
                      <td className="px-4 py-3 text-sm font-medium">{item.type}</td>
                      <td className="px-4 py-3 text-sm">{planned}</td>
                      <td className="px-4 py-3 text-sm">{completed}</td>
                      <td className="px-4 py-3 text-sm">{inProgress}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="font-semibold text-green-600">{rate}%</span>
                      </td>
                      <td className="px-4 py-3 text-sm">{participants} người</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-bold mb-4">Thống kê theo đơn vị</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Đơn vị</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Số hoạt động</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Đã hoàn thành</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Tỷ lệ</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Người tham gia TB</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {mockStatistics.byUnit.map((item, index) => {
                  const completed = Math.floor(item.count * 0.75);
                  const rate = Math.round((completed / item.count) * 100);
                  const avgParticipants = Math.floor(35 + Math.random() * 20);
                  
                  return (
                    <tr key={index} className="hover:bg-muted/20">
                      <td className="px-4 py-3 text-sm font-medium">{item.unit}</td>
                      <td className="px-4 py-3 text-sm">{item.count}</td>
                      <td className="px-4 py-3 text-sm">{completed}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="font-semibold text-green-600">{rate}%</span>
                      </td>
                      <td className="px-4 py-3 text-sm">{avgParticipants} người</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Export Buttons */}
        <Card className="p-6">
          <h2 className="text-lg font-bold mb-4">Xuất báo cáo</h2>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => handleExport('PDF')} className="gap-2">
              <FileText className="w-4 h-4" />
              Xuất báo cáo PDF
            </Button>
            <Button onClick={() => handleExport('Excel')} variant="outline" className="gap-2">
              <FileSpreadsheet className="w-4 h-4" />
              Xuất Excel
            </Button>
            <Button onClick={() => handleExport('Email')} variant="outline" className="gap-2">
              <Mail className="w-4 h-4" />
              Gửi email báo cáo
            </Button>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
}
