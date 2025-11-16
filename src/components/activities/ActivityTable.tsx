import { useState } from 'react';
import { Activity } from '@/types';
import { activityTypeLabels, statusLabels } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Eye, Edit, Trash2, Send, FileCheck, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface ActivityTableProps {
  activities: Activity[];
  onView: (activity: Activity) => void;
  onEdit: (activity: Activity) => void;
  onDelete: (id: string) => void;
  onSendApproval: (id: string) => void;
  onApprove: (id: string) => void;
}

export function ActivityTable({ activities, onView, onEdit, onDelete, onSendApproval, onApprove }: ActivityTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(activities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedActivities = activities.slice(startIndex, startIndex + itemsPerPage);

  const getStatusClass = (status: string) => {
    const classes = {
      draft: 'status-badge status-draft',
      pending: 'status-badge status-pending',
      inprogress: 'status-badge status-inprogress',
      completed: 'status-badge status-completed',
    };
    return classes[status as keyof typeof classes] || 'status-badge';
  };

  return (
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
                      onClick={() => onView(activity)}
                      title="Xem chi tiết"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    
                    {/* Chỉnh sửa: cho Nháp, Chờ duyệt và Đang thực hiện (không cho sửa khi Hoàn thành) */}
                    {(activity.status === 'draft' || activity.status === 'pending' || activity.status === 'inprogress') && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onEdit(activity)}
                        title="Chỉnh sửa"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    )}
                    
                    {/* Xóa: chỉ cho Nháp và Chờ duyệt */}
                    {(activity.status === 'draft' || activity.status === 'pending') && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onDelete(activity.id)}
                        title="Xóa"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                    
                    {/* Gửi duyệt: cho Nháp */}
                    {activity.status === 'draft' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onSendApproval(activity.id)}
                        title="Gửi trình duyệt"
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    )}
                    
                    {/* Phê duyệt: cho Chờ duyệt */}
                    {activity.status === 'pending' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onApprove(activity.id)}
                        title="Phê duyệt"
                        className="text-green-600 hover:text-green-700"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                    )}
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
            Hiển thị {startIndex + 1} - {Math.min(startIndex + itemsPerPage, activities.length)} / {activities.length} kết quả
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
    </Card>
  );
}
