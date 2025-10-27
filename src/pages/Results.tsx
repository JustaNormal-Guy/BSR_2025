import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockActivities, activityTypeLabels, statusLabels } from '@/data/mockData';
import { Eye, Edit, Send, Trash2, Search } from 'lucide-react';
import { format } from 'date-fns';
import { Activity } from '@/types';
import { toast } from 'sonner';

export default function Results() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Lọc các hoạt động đang thực hiện
  const inProgressActivities = mockActivities.filter(a => a.status === 'inprogress');
  
  // Tìm kiếm
  const filteredActivities = inProgressActivities.filter(activity =>
    activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.organizingUnit.toLowerCase().includes(searchTerm.toLowerCase()) ||
    activity.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedActivities = filteredActivities.slice(startIndex, startIndex + itemsPerPage);

  const handleView = (activity: Activity) => {
    toast.info('Xem chi tiết hoạt động: ' + activity.name);
  };

  const handleEdit = (activity: Activity) => {
    toast.info('Cập nhật kết quả: ' + activity.name);
  };

  const handleSendApproval = (id: string) => {
    toast.success('Đã gửi trình duyệt kết quả thực hiện');
  };

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa hoạt động này?')) {
      toast.success('Đã xóa hoạt động');
    }
  };

  const getStatusClass = (status: string) => {
    const classes = {
      inprogress: 'status-badge bg-blue-100 text-blue-800',
      result_pending: 'status-badge bg-amber-100 text-amber-800',
    };
    return classes[status as keyof typeof classes] || 'status-badge';
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Cập nhật kết quả thực hiện</h1>
            <p className="text-muted-foreground mt-1">
              Quản lý và cập nhật kết quả các hoạt động đang thực hiện
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <Card className="p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Tìm theo tên hoạt động, đơn vị..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Đang thực hiện</div>
            <div className="text-2xl font-bold text-blue-600 mt-1">
              {inProgressActivities.length}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Chờ duyệt kết quả</div>
            <div className="text-2xl font-bold text-amber-600 mt-1">
              {mockActivities.filter(a => a.status === 'result_pending').length}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Đã hoàn thành</div>
            <div className="text-2xl font-bold text-green-600 mt-1">
              {mockActivities.filter(a => a.status === 'completed').length}
            </div>
          </Card>
        </div>

        {/* Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">STT</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold min-w-[250px]">Tên hoạt động</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Loại hình</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Đơn vị tổ chức</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Thời gian</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Địa điểm</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Số lượng</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Trạng thái</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginatedActivities.map((activity, index) => (
                  <tr key={activity.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 text-sm">{startIndex + index + 1}</td>
                    <td className="px-4 py-3 text-sm font-medium">{activity.name}</td>
                    <td className="px-4 py-3 text-sm">{activityTypeLabels[activity.type]}</td>
                    <td className="px-4 py-3 text-sm">{activity.organizingUnit}</td>
                    <td className="px-4 py-3 text-sm whitespace-nowrap">
                      {format(new Date(activity.startTime), 'dd/MM/yyyy')}
                    </td>
                    <td className="px-4 py-3 text-sm">{activity.location}</td>
                    <td className="px-4 py-3 text-sm text-center">
                      {activity.participants.length} người
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={getStatusClass(activity.status)}>
                        {statusLabels[activity.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleView(activity)}
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(activity)}
                          title="Cập nhật kết quả"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleSendApproval(activity.id)}
                          title="Gửi trình duyệt"
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(activity.id)}
                          title="Xóa"
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t">
              <div className="text-sm text-muted-foreground">
                Hiển thị {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredActivities.length)} / {filteredActivities.length} kết quả
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Trước
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <Button
                    key={page}
                    variant={currentPage === page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Sau
                </Button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {paginatedActivities.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Không tìm thấy hoạt động nào đang thực hiện</p>
            </div>
          )}
        </Card>
      </div>
    </MainLayout>
  );
}
