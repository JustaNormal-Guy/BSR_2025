import { useState, useEffect } from 'react';
import { Activity, Participant, ActivityType } from '@/types';
import { activityTypeLabels, units, mockParticipants } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { X, Plus, Save, Send, Upload, FileText, Trash2, Edit } from 'lucide-react';
import { toast } from 'sonner';

// Mock data cho nghị quyết (sẽ import từ context sau)
const mockResolutions = [
  { id: 1, code: 'NQ 01-NQ/TW', title: 'NQ 01-NQ/TW về phát triển kinh tế - xã hội 2025' },
  { id: 2, code: 'NQ 05-NQ/TW', title: 'NQ 05-NQ/TW về công tác tuyên truyền' },
  { id: 3, code: 'NQ 08-NQ/TW', title: 'NQ 08-NQ/TW về xây dựng đảng trong sạch vững mạnh' },
];

interface AttachedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  file?: File;
}

interface CreateActivityModalProps {
  activity?: Activity | null;
  onClose: () => void;
  onSave: (activity: Activity) => void;
}

export function CreateActivityModal({ activity, onClose, onSave }: CreateActivityModalProps) {
  const [formData, setFormData] = useState<Partial<Activity>>({
    name: '',
    type: 'conference' as ActivityType,
    organizingUnit: units[0],
    startTime: '',
    endTime: '',
    location: '',
    description: '',
    participants: [],
    status: 'draft',
  });

  const [selectedResolution, setSelectedResolution] = useState<string>('');
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (activity) {
      setFormData(activity);
      // Load existing attachments if any
      if (activity.attachments) {
        setAttachedFiles(activity.attachments.map(att => ({
          id: att.id,
          name: att.name,
          size: att.size,
          type: att.type
        })));
      }
    }
  }, [activity]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Vui lòng nhập tên hoạt động';
    if (!formData.startTime) newErrors.startTime = 'Vui lòng chọn thời gian bắt đầu';
    if (!formData.location) newErrors.location = 'Vui lòng nhập địa điểm';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = (status: 'draft' | 'pending' | 'inprogress' | 'completed') => {
    if (!validate()) {
      toast.error('Vui lòng điền đầy đủ các trường bắt buộc');
      return;
    }

    // Nếu đang ở trạng thái inprogress và click Cập nhật -> chuyển sang completed và lưu actualData
    const isCompletingActivity = activity?.status === 'inprogress' && status === 'completed';

    const savedActivity: Activity = {
      id: activity?.id || Date.now().toString(),
      name: formData.name!,
      type: formData.type!,
      organizingUnit: formData.organizingUnit!,
      startTime: formData.startTime!,
      endTime: formData.endTime,
      location: formData.location!,
      description: formData.description,
      participants: [], // Danh sách sẽ được đính kèm trong file Excel
      status: status,
      createdBy: 'Nguyễn Văn A',
      createdAt: activity?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      attachments: attachedFiles.map(file => ({
        id: file.id,
        name: file.name,
        size: file.size,
        type: file.type
      })),
      // Nếu đang cập nhật từ inprogress, lưu thông tin thực tế
      actualData: isCompletingActivity ? {
        name: formData.name,
        type: formData.type,
        organizingUnit: formData.organizingUnit,
        startTime: formData.startTime,
        endTime: formData.endTime,
        location: formData.location,
        description: formData.description,
      } : activity?.actualData,
    };

    onSave(savedActivity);
    
    let statusMessage = 'Đã lưu nháp';
    if (status === 'pending') statusMessage = 'Đã gửi trình duyệt';
    if (status === 'inprogress') statusMessage = 'Đã cập nhật hoạt động';
    if (status === 'completed') statusMessage = 'Đã hoàn thành và lưu kết quả thực tế';
    toast.success(statusMessage);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newFiles: AttachedFile[] = Array.from(files).map(file => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file
    }));

    setAttachedFiles(prev => [...prev, ...newFiles]);
    event.target.value = ''; // Reset input
  };

  const removeFile = (fileId: string) => {
    setAttachedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };



  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {activity ? 'CHỈNH SỬA KẾ HOẠCH HOẠT ĐỘNG' : 'TẠO KẾ HOẠCH TỔ CHỨC HOẠT ĐỘNG MỚI'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Section 1: Basic Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-primary">1. Thông tin cơ bản</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label>Tên chương trình hoạt động <span className="text-destructive">*</span></Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nhập tên hoạt động"
                  className={errors.name ? 'border-destructive' : ''}
                />
                {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
              </div>

              <div>
                <Label>Loại hình hoạt động <span className="text-destructive">*</span></Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value as ActivityType })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    {Object.entries(activityTypeLabels).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Đơn vị tổ chức <span className="text-destructive">*</span></Label>
                <Select
                  value={formData.organizingUnit}
                  onValueChange={(value) => setFormData({ ...formData, organizingUnit: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    {units.map(unit => (
                      <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Nghị quyết liên quan</Label>
                <Select
                  value={selectedResolution}
                  onValueChange={setSelectedResolution}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn nghị quyết (nếu có)" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="none">Không liên quan nghị quyết</SelectItem>
                    {mockResolutions.map(resolution => (
                      <SelectItem key={resolution.id} value={resolution.id.toString()}>
                        {resolution.code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedResolution && selectedResolution !== 'none' && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {mockResolutions.find(r => r.id.toString() === selectedResolution)?.title}
                  </p>
                )}
              </div>

              <div>
                <Label>Thời gian bắt đầu <span className="text-destructive">*</span></Label>
                <Input
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className={errors.startTime ? 'border-destructive' : ''}
                />
                {errors.startTime && <p className="text-xs text-destructive mt-1">{errors.startTime}</p>}
              </div>

              <div>
                <Label>Thời gian kết thúc</Label>
                <Input
                  type="datetime-local"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                />
              </div>

              <div className="md:col-span-2">
                <Label>Địa điểm <span className="text-destructive">*</span></Label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Nhập địa điểm tổ chức"
                  className={errors.location ? 'border-destructive' : ''}
                />
                {errors.location && <p className="text-xs text-destructive mt-1">{errors.location}</p>}
              </div>

              <div className="md:col-span-2">
                <Label>Mô tả nội dung</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Mô tả chi tiết nội dung hoạt động"
                  rows={4}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Document Attachments */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-primary">2. Tài liệu đính kèm</h3>
            
            <div className="space-y-4">
              {/* File Upload Area */}
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-1">
                    Nhấn để chọn tài liệu hoặc kéo thả file vào đây
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Hỗ trợ: PDF, Word, Excel, PowerPoint, ảnh (tối đa 10MB/file)
                  </p>
                  <p className="text-xs text-primary mt-2 font-medium">
                    * Danh sách thành phần tham gia đính kèm dưới dạng file Excel
                  </p>
                </label>
              </div>

              {/* File List */}
              {attachedFiles.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Danh sách tài liệu đã đính kèm:</Label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {attachedFiles.map((file) => (
                      <div key={file.id} className="flex items-center justify-between p-2 bg-muted/30 rounded border">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{file.name}</p>
                            <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(file.id)}
                          className="text-destructive hover:text-destructive flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Hủy bỏ
            </Button>
            {activity?.status === 'inprogress' ? (
              // Nút cho trạng thái "Đang thực hiện" - click sẽ chuyển sang "Hoàn thành"
              <Button onClick={() => handleSave('completed')} className="gap-2">
                <Edit className="w-4 h-4" />
                Cập nhật
              </Button>
            ) : (
              // Nút cho trạng thái "Nháp" và "Chờ duyệt"
              <>
                <Button variant="secondary" onClick={() => handleSave('draft')} className="gap-2">
                  <Save className="w-4 h-4" />
                  Lưu nháp
                </Button>
                <Button onClick={() => handleSave('pending')} className="gap-2">
                  <Send className="w-4 h-4" />
                  Lưu và gửi trình duyệt
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
