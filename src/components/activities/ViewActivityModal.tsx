import { Activity } from '@/types';
import { activityTypeLabels, statusLabels } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Edit, Printer, FileText } from 'lucide-react';
import { format } from 'date-fns';

interface ViewActivityModalProps {
  activity: Activity;
  onClose: () => void;
  onEdit: () => void;
}

export function ViewActivityModal({ activity, onClose, onEdit }: ViewActivityModalProps) {
  const getStatusClass = (status: string) => {
    const classes = {
      draft: 'status-badge status-draft',
      pending: 'status-badge status-pending',
      approved: 'status-badge status-approved',
      inprogress: 'status-badge status-inprogress',
      completed: 'status-badge status-completed',
    };
    return classes[status as keyof typeof classes] || 'status-badge';
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">CHI TIẾT HOẠT ĐỘNG</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="info" className="mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="info">Thông tin chung</TabsTrigger>
            <TabsTrigger value="participants">Danh sách tham gia</TabsTrigger>
            <TabsTrigger value="files">Tài liệu đính kèm</TabsTrigger>
            <TabsTrigger value="history">Lịch sử thay đổi</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Tên hoạt động</label>
                <p className="mt-1 font-semibold">{activity.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Trạng thái</label>
                <p className="mt-1">
                  <span className={getStatusClass(activity.status)}>
                    {statusLabels[activity.status]}
                  </span>
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Loại hình</label>
                <p className="mt-1">{activityTypeLabels[activity.type]}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Đơn vị tổ chức</label>
                <p className="mt-1">{activity.organizingUnit}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Thời gian bắt đầu</label>
                <p className="mt-1">{format(new Date(activity.startTime), 'HH:mm - dd/MM/yyyy')}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Thời gian kết thúc</label>
                <p className="mt-1">
                  {activity.endTime ? format(new Date(activity.endTime), 'HH:mm - dd/MM/yyyy') : 'Chưa xác định'}
                </p>
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium text-muted-foreground">Địa điểm</label>
                <p className="mt-1">{activity.location}</p>
              </div>
              {activity.description && (
                <div className="col-span-2">
                  <label className="text-sm font-medium text-muted-foreground">Mô tả</label>
                  <p className="mt-1 text-sm">{activity.description}</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="participants" className="mt-4">
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-semibold">STT</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold">Họ và tên</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold">Chức vụ</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold">Đơn vị</th>
                    <th className="px-4 py-2 text-left text-sm font-semibold">Vai trò</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {activity.participants.map((p, index) => (
                    <tr key={p.id}>
                      <td className="px-4 py-2 text-sm">{index + 1}</td>
                      <td className="px-4 py-2 text-sm font-medium">{p.name}</td>
                      <td className="px-4 py-2 text-sm">{p.position}</td>
                      <td className="px-4 py-2 text-sm">{p.unit}</td>
                      <td className="px-4 py-2 text-sm">{p.role || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              Tổng số: <span className="font-semibold">{activity.participants.length} người</span>
            </div>
          </TabsContent>

          <TabsContent value="files" className="mt-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                <FileText className="w-8 h-8 text-blue-600" />
                <div className="flex-1">
                  <p className="font-medium">Ke_hoach_boi_duong_2025.pdf</p>
                  <p className="text-xs text-muted-foreground">2.5 MB - PDF Document</p>
                </div>
                <Button size="sm" variant="outline">Tải xuống</Button>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                <FileText className="w-8 h-8 text-green-600" />
                <div className="flex-1">
                  <p className="font-medium">Bieu_mau_danh_gia.xlsx</p>
                  <p className="text-xs text-muted-foreground">1.2 MB - Excel Spreadsheet</p>
                </div>
                <Button size="sm" variant="outline">Tải xuống</Button>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                <FileText className="w-8 h-8 text-blue-600" />
                <div className="flex-1">
                  <p className="font-medium">Nghi_quyet_trung_uong.docx</p>
                  <p className="text-xs text-muted-foreground">3.1 MB - Word Document</p>
                </div>
                <Button size="sm" variant="outline">Tải xuống</Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  <div className="w-0.5 h-full bg-border"></div>
                </div>
                <div className="flex-1 pb-4">
                  <p className="font-medium">Tạo hoạt động mới</p>
                  <p className="text-sm text-muted-foreground">
                    {activity.createdBy} - {activity.createdAt ? format(new Date(activity.createdAt), 'HH:mm dd/MM/yyyy') : 'Không xác định'}
                  </p>
                </div>
              </div>
              {activity.updatedAt && (
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div className="w-0.5 h-full bg-border"></div>
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="font-medium">Cập nhật thông tin</p>
                    <p className="text-sm text-muted-foreground">
                      {activity.createdBy} - {format(new Date(activity.updatedAt), 'HH:mm dd/MM/yyyy')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
          <Button variant="outline" className="gap-2">
            <Printer className="w-4 h-4" />
            In thông tin
          </Button>
          <Button onClick={onEdit} className="gap-2">
            <Edit className="w-4 h-4" />
            Chỉnh sửa
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
