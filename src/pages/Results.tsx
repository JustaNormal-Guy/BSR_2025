import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockActivities, activityTypeLabels, statusLabels, units } from '@/data/mockData';
import { Eye, Edit, Send, Trash2, Search, X, FileText, CheckCircle, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { Activity, ActivityType, ActivityStatus } from '@/types';
import { toast } from 'sonner';
import { ViewActivityModal } from '@/components/activities/ViewActivityModal';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function Results() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filters
  const [filters, setFilters] = useState({
    status: 'all' as ActivityStatus | 'all',
    type: 'all' as ActivityType | 'all',
    unit: 'all',
  });
  
  // Form fields for updating result
  const [implementationContent, setImplementationContent] = useState('');
  const [participantListFile, setParticipantListFile] = useState<File | null>(null);
  const [conclusion, setConclusion] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  
  // Local state để quản lý trạng thái hoạt động
  const [activities, setActivities] = useState(mockActivities);
  
  const itemsPerPage = 10;

  // Lọc các hoạt động: Đang thực hiện, Chờ duyệt kết quả, Đã hoàn thành
  const relevantActivities = activities.filter(a => 
    a.status === 'inprogress' || a.status === 'result_pending' || a.status === 'completed'
  );
  
  // Tìm kiếm và lọc
  const filteredActivities = relevantActivities.filter(activity => {
    // Tìm kiếm theo từ khóa
    const matchesSearch = 
      activity.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.organizingUnit.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Lọc theo trạng thái
    const matchesStatus = filters.status === 'all' || activity.status === filters.status;
    
    // Lọc theo loại hình
    const matchesType = filters.type === 'all' || activity.type === filters.type;
    
    // Lọc theo đơn vị
    const matchesUnit = filters.unit === 'all' || activity.organizingUnit === filters.unit;
    
    return matchesSearch && matchesStatus && matchesType && matchesUnit;
  });

  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedActivities = filteredActivities.slice(startIndex, startIndex + itemsPerPage);

  const handleView = (activity: Activity) => {
    setSelectedActivity(activity);
    setIsViewModalOpen(true);
  };

  const handleEdit = (activity: Activity) => {
    setSelectedActivity(activity);
    setImplementationContent('');
    setParticipantListFile(null);
    setConclusion('');
    setAttachedFiles([]);
    setIsEditModalOpen(true);
  };

  const handleSendForApproval = () => {
    if (!selectedActivity) return;
    
    if (!implementationContent.trim()) {
      toast.error('Vui lòng nhập nội dung triển khai');
      return;
    }
    if (!conclusion.trim()) {
      toast.error('Vui lòng nhập kết luận/đánh giá');
      return;
    }
    if (!participantListFile) {
      toast.error('Vui lòng đính kèm danh sách người tham gia');
      return;
    }
    
    // Cập nhật trạng thái sang "Chờ duyệt kết quả"
    setActivities(prev => 
      prev.map(act => 
        act.id === selectedActivity.id 
          ? { ...act, status: 'result_pending' as const }
          : act
      )
    );
    
    toast.success('Đã gửi phê duyệt kết quả thực hiện. Đang chờ cấp trên xét duyệt.');
    setIsEditModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setImplementationContent('');
    setParticipantListFile(null);
    setConclusion('');
    setAttachedFiles([]);
  };

  const handleParticipantFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setParticipantListFile(file);
    }
  };

  const removeParticipantFile = () => {
    setParticipantListFile(null);
  };

  const handleApprove = (activity: Activity) => {
    // Cập nhật trạng thái sang "Đã hoàn thành"
    setActivities(prev =>
      prev.map(act =>
        act.id === activity.id
          ? { ...act, status: 'completed' as const }
          : act
      )
    );
    toast.success(`Đã phê duyệt kết quả thực hiện: ${activity.name}`);
  };

  const handleDeleteClick = (id: string) => {
    setActivityToDelete(id);
    setIsDeleteAlertOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (activityToDelete) {
      setActivities(prev => prev.filter(act => act.id !== activityToDelete));
      toast.success('Đã xóa hoạt động thành công');
      setActivityToDelete(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getStatusClass = (status: string) => {
    const classes = {
      inprogress: 'status-badge bg-blue-100 text-blue-800',
      result_pending: 'status-badge bg-amber-100 text-amber-800',
      completed: 'status-badge bg-green-100 text-green-800',
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
          <div className="flex flex-col gap-4">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Tìm theo tên hoạt động, đơn vị..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4" />
                Lọc & Phân loại
              </Button>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Trạng thái</Label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value as ActivityStatus | 'all' })}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="inprogress">Đang thực hiện</option>
                    <option value="result_pending">Chờ duyệt kết quả</option>
                    <option value="completed">Đã hoàn thành</option>
                  </select>
                </div>
                <div>
                  <Label className="text-sm font-medium mb-2 block">Loại hình hoạt động</Label>
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value as ActivityType | 'all' })}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="all">Tất cả loại hình</option>
                    {Object.entries(activityTypeLabels).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label className="text-sm font-medium mb-2 block">Đơn vị tổ chức</Label>
                  <select
                    value={filters.unit}
                    onChange={(e) => setFilters({ ...filters, unit: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="all">Tất cả đơn vị</option>
                    {units.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Đang thực hiện</div>
            <div className="text-2xl font-bold text-blue-600 mt-1">
              {activities.filter(a => a.status === 'inprogress').length}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Chờ duyệt kết quả</div>
            <div className="text-2xl font-bold text-amber-600 mt-1">
              {activities.filter(a => a.status === 'result_pending').length}
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Đã hoàn thành</div>
            <div className="text-2xl font-bold text-green-600 mt-1">
              {activities.filter(a => a.status === 'completed').length}
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
                        {activity.status === 'inprogress' && (
                          <>
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
                              onClick={() => handleDeleteClick(activity.id)}
                              title="Xóa"
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                        {activity.status === 'result_pending' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleApprove(activity)}
                            title="Phê duyệt"
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        )}
                        {activity.status === 'completed' && (
                          <span className="text-xs text-muted-foreground px-2">
                            Đã hoàn thành
                          </span>
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

      {/* View Activity Modal - Using ViewActivityModal component */}
      {selectedActivity && isViewModalOpen && (
        <ViewActivityModal
          activity={selectedActivity}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedActivity(null);
          }}
          onEdit={() => {
            setIsViewModalOpen(false);
            handleEdit(selectedActivity);
          }}
        />
      )}

      {/* Edit Result Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Cập nhật kết quả thực hiện</DialogTitle>
          </DialogHeader>
          {selectedActivity && (
            <div className="space-y-6">
              <div>
                <Label className="text-muted-foreground">Hoạt động</Label>
                <p className="font-semibold mt-1">{selectedActivity.name}</p>
              </div>

              {/* 1. Nội dung triển khai */}
              <div>
                <Label>Nội dung triển khai <span className="text-destructive">*</span></Label>
                <Textarea
                  placeholder="Nhập nội dung triển khai thực tế của hoạt động..."
                  value={implementationContent}
                  onChange={(e) => setImplementationContent(e.target.value)}
                  rows={5}
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Mô tả chi tiết quá trình thực hiện, các hoạt động đã diễn ra
                </p>
              </div>

              {/* 2. Danh sách người tham gia thực tế */}
              <div>
                <Label>Danh sách người tham gia thực tế <span className="text-destructive">*</span></Label>
                <p className="text-sm text-muted-foreground mt-1 mb-3">
                  Đính kèm file danh sách người tham gia thực tế (Excel, PDF)
                </p>
                <div className="space-y-3">
                  <Input
                    type="file"
                    onChange={handleParticipantFileChange}
                    className="cursor-pointer"
                    accept=".xlsx,.xls,.pdf,.doc,.docx"
                  />
                  {participantListFile && (
                    <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-blue-900 truncate">
                            {participantListFile.name}
                          </p>
                          <p className="text-xs text-blue-600">
                            {formatFileSize(participantListFile.size)}
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={removeParticipantFile}
                        className="ml-2 text-destructive hover:text-destructive"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Hỗ trợ: Excel (.xlsx, .xls), PDF, Word (.doc, .docx)
                  </p>
                </div>
              </div>

              {/* 3. Kết luận, đánh giá */}
              <div>
                <Label>Kết luận, đánh giá <span className="text-destructive">*</span></Label>
                <Textarea
                  placeholder="Nhập kết luận và đánh giá về hiệu quả của hoạt động..."
                  value={conclusion}
                  onChange={(e) => setConclusion(e.target.value)}
                  rows={5}
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Đánh giá tổng quan, hiệu quả đạt được, những vấn đề còn tồn tại
                </p>
              </div>

              {/* 4. Tài liệu đính kèm */}
              <div>
                <Label>Tài liệu đính kèm</Label>
                <p className="text-sm text-muted-foreground mt-1 mb-2">
                  Hình ảnh, văn bản, báo cáo liên quan
                </p>
                <div className="space-y-3">
                  <Input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="cursor-pointer"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.zip"
                  />
                  {attachedFiles.length > 0 && (
                    <div className="space-y-2">
                      {attachedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-muted rounded-lg border"
                        >
                          <div className="flex-1 min-w-0 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{file.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatFileSize(file.size)}
                              </p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeFile(index)}
                            className="ml-2 text-destructive hover:text-destructive"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => {
              setIsEditModalOpen(false);
              resetForm();
            }}>
              Hủy
            </Button>
            <Button onClick={handleSendForApproval} className="bg-primary">
              <Send className="w-4 h-4 mr-2" />
              Gửi phê duyệt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Alert Dialog */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa hoạt động này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setActivityToDelete(null)}>
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
}
