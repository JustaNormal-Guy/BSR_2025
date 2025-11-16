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
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="info">Thông tin chung</TabsTrigger>
            <TabsTrigger value="files">Tài liệu đính kèm</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4 mt-4">
            {/* Bảng 3 cột: Nội dung - Kế hoạch - Thực tế */}
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold w-1/4">Nội dung</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold w-1/3">Kế hoạch</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold w-1/3">Thực tế</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {/* Tên chương trình hoạt động */}
                  <tr className="hover:bg-muted/20">
                    <td className="px-4 py-3 text-sm font-medium text-muted-foreground">Tên chương trình hoạt động</td>
                    <td className="px-4 py-3 text-sm font-semibold">{activity.name}</td>
                    <td className="px-4 py-3 text-sm">
                      {activity.actualData?.name || <span className="text-muted-foreground italic">Chưa cập nhật</span>}
                    </td>
                  </tr>

                  {/* Loại hình hoạt động */}
                  <tr className="hover:bg-muted/20">
                    <td className="px-4 py-3 text-sm font-medium text-muted-foreground">Loại hình hoạt động</td>
                    <td className="px-4 py-3 text-sm">{activityTypeLabels[activity.type]}</td>
                    <td className="px-4 py-3 text-sm">
                      {activity.actualData?.type ? activityTypeLabels[activity.actualData.type] : <span className="text-muted-foreground italic">Chưa cập nhật</span>}
                    </td>
                  </tr>

                  {/* Đơn vị tổ chức */}
                  <tr className="hover:bg-muted/20">
                    <td className="px-4 py-3 text-sm font-medium text-muted-foreground">Đơn vị tổ chức</td>
                    <td className="px-4 py-3 text-sm">{activity.organizingUnit}</td>
                    <td className="px-4 py-3 text-sm">
                      {activity.actualData?.organizingUnit || <span className="text-muted-foreground italic">Chưa cập nhật</span>}
                    </td>
                  </tr>

                  {/* Nghị quyết liên quan */}
                  <tr className="hover:bg-muted/20">
                    <td className="px-4 py-3 text-sm font-medium text-muted-foreground">Nghị quyết liên quan</td>
                    <td className="px-4 py-3 text-sm">NQ 01-NQ/TW</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground italic">Chưa cập nhật</td>
                  </tr>

                  {/* Thời gian bắt đầu */}
                  <tr className="hover:bg-muted/20">
                    <td className="px-4 py-3 text-sm font-medium text-muted-foreground">Thời gian bắt đầu</td>
                    <td className="px-4 py-3 text-sm">{format(new Date(activity.startTime), 'HH:mm:ss dd/MM/yyyy')}</td>
                    <td className="px-4 py-3 text-sm">
                      {activity.actualData?.startTime ? format(new Date(activity.actualData.startTime), 'HH:mm:ss dd/MM/yyyy') : <span className="text-muted-foreground italic">Chưa cập nhật</span>}
                    </td>
                  </tr>

                  {/* Thời gian kết thúc */}
                  <tr className="hover:bg-muted/20">
                    <td className="px-4 py-3 text-sm font-medium text-muted-foreground">Thời gian kết thúc</td>
                    <td className="px-4 py-3 text-sm">
                      {activity.endTime ? format(new Date(activity.endTime), 'HH:mm:ss dd/MM/yyyy') : 'Chưa xác định'}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {activity.actualData?.endTime ? format(new Date(activity.actualData.endTime), 'HH:mm:ss dd/MM/yyyy') : <span className="text-muted-foreground italic">Chưa cập nhật</span>}
                    </td>
                  </tr>

                  {/* Địa điểm */}
                  <tr className="hover:bg-muted/20">
                    <td className="px-4 py-3 text-sm font-medium text-muted-foreground">Địa điểm</td>
                    <td className="px-4 py-3 text-sm">{activity.location}</td>
                    <td className="px-4 py-3 text-sm">
                      {activity.actualData?.location || <span className="text-muted-foreground italic">Chưa cập nhật</span>}
                    </td>
                  </tr>

                  {/* Mô tả nội dung */}
                  <tr className="hover:bg-muted/20">
                    <td className="px-4 py-3 text-sm font-medium text-muted-foreground">Mô tả nội dung</td>
                    <td className="px-4 py-3 text-sm">
                      {activity.description || 'Không có mô tả'}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {activity.actualData?.description || <span className="text-muted-foreground italic">Chưa cập nhật</span>}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Trạng thái */}
            <div className="flex items-center gap-2 pt-4">
              <span className="text-sm font-medium text-muted-foreground">Trạng thái:</span>
              <span className={getStatusClass(activity.status)}>
                {statusLabels[activity.status]}
              </span>
            </div>
          </TabsContent>

          <TabsContent value="files" className="mt-4">
            <div className="space-y-3">
              {/* File danh sách tham gia */}
              <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
                <FileText className="w-10 h-10 text-blue-600 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-blue-900">Danh_sach_tham_gia.xlsx</p>
                  <p className="text-sm text-blue-700 mt-1">
                    Tổng số: <span className="font-semibold">{activity.participants.length} người</span> • 156 KB • Excel Spreadsheet
                  </p>
                </div>
                <Button size="sm" variant="outline" className="border-blue-300 hover:bg-blue-50">
                  Tải xuống
                </Button>
              </div>
              
              {/* Các tài liệu khác */}
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
