import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  Calendar,
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  HourglassIcon,
  FileText,
  Upload,
  Video,
  Download
} from 'lucide-react';
import { useState } from 'react';

interface Resolution {
  id: number;
  title: string;
  code?: string;
  createdDate: string;
  createdTime: string;
  deadline: string;
  status: 'approved' | 'ongoing' | 'overdue';
  statusLabel: string;
  category: string;
  participants: number;
  issuedBy?: string;
  attachments?: string[];
}

interface StudySession {
  id: number;
  resolutionId: number;
  date: string;
  time: string;
  format: 'full' | 'compact';
  participants: number;
  status: 'completed' | 'pending';
  videoUrl?: string;
  documents?: string[];
}

const mockResolutions: Resolution[] = [
  {
    id: 1,
    title: 'NQ 01-NQ/TW về phát triển kinh tế - xã hội 2025',
    code: 'NQ 01-NQ/TW',
    createdDate: '15/1/2025',
    createdTime: '08:30',
    deadline: '20/1/2025',
    status: 'approved',
    statusLabel: 'Đã quán triệt',
    category: 'Toàn thể',
    participants: 234,
    issuedBy: 'Trung ương',
    attachments: ['NQ-01-TW-2025.pdf']
  },
  {
    id: 2,
    title: 'NQ 05-NQ/TW về công tác tuyên truyền',
    code: 'NQ 05-NQ/TW',
    createdDate: '10/2/2025',
    createdTime: '09:00',
    deadline: '15/2/2025',
    status: 'ongoing',
    statusLabel: 'Đang triển khai',
    category: 'Thư gọn',
    participants: 45,
    issuedBy: 'Trung ương',
    attachments: []
  },
  {
    id: 3,
    title: 'NQ 08-NQ/TW về xây dựng đảng trong sạch vững mạnh',
    code: 'NQ 08-NQ/TW',
    createdDate: '5/3/2025',
    createdTime: '10:15',
    deadline: '',
    status: 'overdue',
    statusLabel: 'Chưa quán triệt',
    category: 'Toàn thể',
    participants: 0,
    issuedBy: 'Trung ương',
    attachments: []
  }
];

const mockStudySessions: StudySession[] = [
  {
    id: 1,
    resolutionId: 1,
    date: '20/1/2025',
    time: '14:00',
    format: 'full',
    participants: 234,
    status: 'completed',
    documents: ['Tai-lieu-hoc-tap.pdf']
  },
  {
    id: 2,
    resolutionId: 1,
    date: '25/1/2025',
    time: '15:30',
    format: 'compact',
    participants: 45,
    status: 'completed',
    videoUrl: 'video-hoc-tap.mp4'
  }
];

const timelineSteps = [
  { label: 'TW ban hành', date: '15/1/2025', completed: true },
  { label: 'TĐ học', date: '20/1/2025', completed: true },
  { label: 'ĐU KH', date: '25/1/2025', completed: true },
  { label: 'ĐU CTHĐ', date: '30/1/2025', completed: true }
];

export default function Resolutions() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResolution, setSelectedResolution] = useState<Resolution | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isAddSessionOpen, setIsAddSessionOpen] = useState(false);
  const [resolutions, setResolutions] = useState<Resolution[]>(mockResolutions);
  const [studySessions, setStudySessions] = useState<StudySession[]>(mockStudySessions);
  
  // Form state for new resolution
  const [newResolutionTitle, setNewResolutionTitle] = useState('');
  const [newResolutionDate, setNewResolutionDate] = useState('');
  const [newResolutionTime, setNewResolutionTime] = useState('');

  // Form state for resolution details
  const [resolutionCode, setResolutionCode] = useState('');
  const [resolutionIssuedBy, setResolutionIssuedBy] = useState('');
  const [resolutionCategory, setResolutionCategory] = useState('');

  // Form state for new study session
  const [sessionDate, setSessionDate] = useState('');
  const [sessionTime, setSessionTime] = useState('');
  const [sessionFormat, setSessionFormat] = useState<'full' | 'compact'>('full');
  const [sessionParticipants, setSessionParticipants] = useState('');

  const handleViewDetails = (resolution: Resolution) => {
    setSelectedResolution(resolution);
    setResolutionCode(resolution.code || '');
    setResolutionIssuedBy(resolution.issuedBy || '');
    setResolutionCategory(resolution.category || '');
    setIsDetailOpen(true);
  };

  const handleCreateResolution = () => {
    if (!newResolutionTitle || !newResolutionDate || !newResolutionTime) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    const newResolution: Resolution = {
      id: resolutions.length + 1,
      title: newResolutionTitle,
      createdDate: newResolutionDate.split('-').reverse().join('/'), // Convert YYYY-MM-DD to DD/MM/YYYY
      createdTime: newResolutionTime,
      deadline: '',
      status: 'overdue',
      statusLabel: 'Chưa quán triệt',
      category: 'Toàn thể',
      participants: 0,
      issuedBy: 'Trung ương',
      attachments: []
    };

    setResolutions([newResolution, ...resolutions]);
    
    // Reset form
    setNewResolutionTitle('');
    setNewResolutionDate('');
    setNewResolutionTime('');
    setIsCreateOpen(false);
    
    // Show success message
    alert('Thêm nghị quyết thành công!');
  };

  const handleAddStudySession = () => {
    if (!sessionDate || !sessionTime || !sessionParticipants) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    const newSession: StudySession = {
      id: studySessions.length + 1,
      resolutionId: selectedResolution!.id,
      date: sessionDate.split('-').reverse().join('/'),
      time: sessionTime,
      format: sessionFormat,
      participants: parseInt(sessionParticipants),
      status: 'pending',
      documents: []
    };

    setStudySessions([...studySessions, newSession]);

    // Reset form
    setSessionDate('');
    setSessionTime('');
    setSessionFormat('full');
    setSessionParticipants('');
    setIsAddSessionOpen(false);

    alert('Thêm buổi học tập thành công!');
  };

  const getStatusColor = (status: Resolution['status']) => {
    switch (status) {
      case 'approved':
        return 'bg-green-500 hover:bg-green-600';
      case 'ongoing':
        return 'bg-orange-500 hover:bg-orange-600';
      case 'overdue':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: Resolution['status']) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'ongoing':
        return <HourglassIcon className="w-4 h-4" />;
      case 'overdue':
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nghị quyết & Kế hoạch</h1>
          <p className="text-gray-600 mt-1">Quản lý nghị quyết Trung ương và kế hoạch triển khai</p>
        </div>

        {/* Main Content - Full Width */}
        <Card className="p-6 space-y-4">
          {/* Add Button */}
          <Button 
            className="bg-primary hover:bg-primary/90" 
            size="lg"
            onClick={() => setIsCreateOpen(true)}
          >
            <Plus className="w-5 h-5 mr-2" />
            Thêm Nghị quyết
          </Button>

          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Tìm kiếm nghị quyết..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-700 pb-3 border-b">
            <div className="col-span-1 text-center">#</div>
            <div className="col-span-6">Tên & Thông tin</div>
            <div className="col-span-2 text-center">Trạng thái</div>
            <div className="col-span-3 text-center">Thao tác</div>
          </div>

          {/* Resolution List */}
          <div className="space-y-3">
            {resolutions.map((resolution, index) => (
              <div
                key={resolution.id}
                className="p-4 rounded-lg border border-gray-200 hover:border-primary/50 hover:shadow-md transition-all"
              >
                <div className="grid grid-cols-12 gap-4 items-center">
                  {/* Number */}
                  <div className="col-span-1 text-center font-semibold text-gray-600 text-lg">
                    {index + 1}
                  </div>

                  {/* Title & Info */}
                  <div className="col-span-6 space-y-2">
                    <h3 className="font-semibold text-base text-gray-900 leading-tight">
                      {resolution.title}
                    </h3>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>TW: {resolution.createdDate} {resolution.createdTime}</span>
                      </div>
                      {resolution.deadline && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>TĐ: {resolution.deadline}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="destructive" className="text-xs">
                        {resolution.category}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{resolution.participants}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="col-span-2 flex justify-center">
                    <Badge 
                      className={`${getStatusColor(resolution.status)} text-white text-xs px-3 py-1 flex items-center gap-1`}
                    >
                      {getStatusIcon(resolution.status)}
                      <span>{resolution.statusLabel}</span>
                    </Badge>
                  </div>

                  {/* Actions */}
                  <div className="col-span-3 flex gap-2 justify-center">
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-9 w-9"
                      onClick={() => handleViewDetails(resolution)}
                    >
                      <Eye className="w-5 h-5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-9 w-9">
                      <Edit className="w-5 h-5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-9 w-9 text-red-600 hover:text-red-700">
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Create Resolution Modal */}
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Plus className="w-6 h-6 text-primary" />
                </div>
                Thêm Nghị quyết mới
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 pt-4">
              {/* Resolution Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên Nghị quyết *
                </label>
                <Input
                  placeholder="VD: NQ 01-NQ/TW về phát triển kinh tế - xã hội 2025"
                  value={newResolutionTitle}
                  onChange={(e) => setNewResolutionTitle(e.target.value)}
                  className="w-full"
                />
              </div>

              {/* Date and Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày giờ Trung ương ban hành *
                </label>
                <div className="flex gap-4">
                  <Input
                    type="date"
                    value={newResolutionDate}
                    onChange={(e) => setNewResolutionDate(e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    type="time"
                    value={newResolutionTime}
                    onChange={(e) => setNewResolutionTime(e.target.value)}
                    className="w-40"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreateOpen(false);
                    setNewResolutionTitle('');
                    setNewResolutionDate('');
                    setNewResolutionTime('');
                  }}
                >
                  Hủy
                </Button>
                <Button
                  className="bg-primary hover:bg-primary/90"
                  onClick={handleCreateResolution}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm Nghị quyết
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Detail Modal */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
            {selectedResolution && (
              <div className="space-y-6">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      {selectedResolution.title}
                    </div>
                  </DialogTitle>
                </DialogHeader>

                {/* Tabs */}
                <Tabs defaultValue="info" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="info">Thông tin Nghị quyết</TabsTrigger>
                    <TabsTrigger value="training">Công tác Quán triệt</TabsTrigger>
                  </TabsList>

                  {/* Tab 1: Thông tin Nghị quyết */}
                  <TabsContent value="info" className="space-y-6 mt-6">
                    <div className="grid grid-cols-2 gap-6">
                      {/* Tên Nghị quyết */}
                      <div className="col-span-2">
                        <Label htmlFor="title">Tên Nghị quyết *</Label>
                        <Input
                          id="title"
                          value={selectedResolution.title}
                          className="mt-2"
                          readOnly
                        />
                      </div>

                      {/* Số hiệu */}
                      <div>
                        <Label htmlFor="code">Số hiệu *</Label>
                        <Input
                          id="code"
                          value={resolutionCode}
                          onChange={(e) => setResolutionCode(e.target.value)}
                          placeholder="VD: NQ 01-NQ/TW"
                          className="mt-2"
                        />
                      </div>

                      {/* Cấp ban hành */}
                      <div>
                        <Label htmlFor="issuedBy">Cấp ban hành *</Label>
                        <Select value={resolutionIssuedBy} onValueChange={setResolutionIssuedBy}>
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Chọn cấp ban hành" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Trung ương">Nghị quyết Trung ương</SelectItem>
                            <SelectItem value="Tập đoàn">Nghị quyết của Tập đoàn</SelectItem>
                            <SelectItem value="Đảng ủy">Nghị quyết Đảng ủy</SelectItem>
                            <SelectItem value="Chi bộ">Nghị quyết Chi bộ</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Ngày ban hành */}
                      <div>
                        <Label htmlFor="issueDate">Ngày ban hành *</Label>
                        <Input
                          id="issueDate"
                          type="date"
                          defaultValue={selectedResolution.createdDate.split('/').reverse().join('-')}
                          className="mt-2"
                        />
                      </div>

                      {/* Giờ ban hành */}
                      <div>
                        <Label htmlFor="issueTime">Giờ ban hành *</Label>
                        <Input
                          id="issueTime"
                          type="time"
                          defaultValue={selectedResolution.createdTime}
                          className="mt-2"
                        />
                      </div>

                      {/* Phân loại */}
                      <div className="col-span-2">
                        <Label htmlFor="category">Phân loại *</Label>
                        <Select value={resolutionCategory} onValueChange={setResolutionCategory}>
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Chọn phân loại" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Toàn thể">Toàn thể đảng viên</SelectItem>
                            <SelectItem value="Thu gọn">Thu gọn</SelectItem>
                            <SelectItem value="Chuyên đề">Chuyên đề</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* File đính kèm */}
                    <div className="space-y-3 border-t pt-6">
                      <div className="flex items-center justify-between">
                        <Label>File văn bản đính kèm</Label>
                        <Button variant="outline" size="sm">
                          <Upload className="w-4 h-4 mr-2" />
                          Tải lên file PDF
                        </Button>
                      </div>

                      {selectedResolution.attachments && selectedResolution.attachments.length > 0 ? (
                        <div className="space-y-2">
                          {selectedResolution.attachments.map((file, index) => (
                            <div key={index} className="border rounded-lg p-4 bg-gray-50">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-red-500 rounded flex items-center justify-center text-white font-bold text-sm">
                                  PDF
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900">{file}</div>
                                  <div className="text-sm text-gray-600">2.3 MB</div>
                                </div>
                                <Button variant="outline" size="sm">
                                  <Download className="w-4 h-4 mr-2" />
                                  Tải xuống
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="border-2 border-dashed rounded-lg p-8 text-center text-gray-500">
                          <Upload className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                          <p>Chưa có file đính kèm</p>
                          <p className="text-sm">Nhấn nút "Tải lên file PDF" để thêm văn bản</p>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                      <Button variant="outline" onClick={() => setIsDetailOpen(false)}>
                        Đóng
                      </Button>
                      <Button className="bg-primary hover:bg-primary/90">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Lưu thay đổi
                      </Button>
                    </div>
                  </TabsContent>

                  {/* Tab 2: Công tác Quán triệt */}
                  <TabsContent value="training" className="space-y-6 mt-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold">Danh sách buổi học tập</h3>
                        <p className="text-sm text-gray-600">Quản lý các buổi học tập và quán triệt nghị quyết</p>
                      </div>
                      <Button 
                        className="bg-primary hover:bg-primary/90"
                        onClick={() => setIsAddSessionOpen(true)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Thêm buổi học tập
                      </Button>
                    </div>

                    {/* Study Sessions Table */}
                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">STT</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Ngày giờ</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Hình thức</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Số người</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Trạng thái</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Tài liệu</th>
                            <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Thao tác</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {studySessions
                            .filter(session => session.resolutionId === selectedResolution.id)
                            .map((session, index) => (
                            <tr key={session.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm">{index + 1}</td>
                              <td className="px-4 py-3 text-sm">
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-gray-400" />
                                  <span>{session.date} {session.time}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm">
                                <Badge variant={session.format === 'full' ? 'destructive' : 'secondary'}>
                                  {session.format === 'full' ? 'Toàn thể' : 'Thu gọn'}
                                </Badge>
                              </td>
                              <td className="px-4 py-3 text-sm">
                                <div className="flex items-center gap-1">
                                  <Users className="w-4 h-4 text-gray-400" />
                                  <span>{session.participants}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm">
                                <Badge 
                                  className={session.status === 'completed' ? 'bg-green-500' : 'bg-orange-500'}
                                >
                                  {session.status === 'completed' ? 'Đã tổ chức' : 'Chưa tổ chức'}
                                </Badge>
                              </td>
                              <td className="px-4 py-3 text-sm">
                                <div className="flex gap-2">
                                  {session.videoUrl && (
                                    <Button variant="ghost" size="sm" className="h-7 px-2">
                                      <Video className="w-4 h-4" />
                                    </Button>
                                  )}
                                  {session.documents && session.documents.length > 0 && (
                                    <Button variant="ghost" size="sm" className="h-7 px-2">
                                      <FileText className="w-4 h-4" />
                                    </Button>
                                  )}
                                  {!session.videoUrl && (!session.documents || session.documents.length === 0) && (
                                    <span className="text-gray-400 text-xs">Chưa có</span>
                                  )}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm">
                                <div className="flex gap-1 justify-center">
                                  <Button size="icon" variant="ghost" className="h-8 w-8">
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600">
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {studySessions.filter(session => session.resolutionId === selectedResolution.id).length === 0 && (
                        <div className="p-12 text-center text-gray-500">
                          <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                          <p>Chưa có buổi học tập nào</p>
                          <p className="text-sm mt-1">Nhấn nút "Thêm buổi học tập" để tạo buổi học mới</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Add Study Session Modal */}
        <Dialog open={isAddSessionOpen} onOpenChange={setIsAddSessionOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Plus className="w-5 h-5 text-primary" />
                </div>
                Thêm buổi học tập mới
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 pt-4">
              {/* Date and Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sessionDate">Ngày tổ chức *</Label>
                  <Input
                    id="sessionDate"
                    type="date"
                    value={sessionDate}
                    onChange={(e) => setSessionDate(e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="sessionTime">Giờ tổ chức *</Label>
                  <Input
                    id="sessionTime"
                    type="time"
                    value={sessionTime}
                    onChange={(e) => setSessionTime(e.target.value)}
                    className="mt-2"
                  />
                </div>
              </div>

              {/* Format */}
              <div>
                <Label htmlFor="format">Hình thức tổ chức *</Label>
                <Select value={sessionFormat} onValueChange={(value: 'full' | 'compact') => setSessionFormat(value)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Toàn thể đảng viên</SelectItem>
                    <SelectItem value="compact">Thu gọn</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Participants */}
              <div>
                <Label htmlFor="participants">Số người tham dự *</Label>
                <Input
                  id="participants"
                  type="number"
                  value={sessionParticipants}
                  onChange={(e) => setSessionParticipants(e.target.value)}
                  placeholder="Nhập số người tham dự"
                  className="mt-2"
                  min="0"
                />
              </div>

              {/* File uploads */}
              <div className="space-y-3">
                <Label>Tài liệu đính kèm (tùy chọn)</Label>
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="w-full">
                    <Upload className="w-4 h-4 mr-2" />
                    Tải lên tài liệu
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Video className="w-4 h-4 mr-2" />
                    Tải lên video
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddSessionOpen(false);
                    setSessionDate('');
                    setSessionTime('');
                    setSessionFormat('full');
                    setSessionParticipants('');
                  }}
                >
                  Hủy
                </Button>
                <Button
                  className="bg-primary hover:bg-primary/90"
                  onClick={handleAddStudySession}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm buổi học tập
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}
