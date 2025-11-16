import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Plus, Search, Filter, RefreshCw, FileSpreadsheet, Eye, Edit, Trash2, Send } from 'lucide-react';
import { mockActivities, activityTypeLabels, statusLabels, units } from '@/data/mockData';
import { Activity, ActivityStatus, ActivityType } from '@/types';
import { ActivityFilters } from '@/components/activities/ActivityFilters';
import { ActivityTable } from '@/components/activities/ActivityTable';
import { CreateActivityModal } from '@/components/activities/CreateActivityModal';
import { ViewActivityModal } from '@/components/activities/ViewActivityModal';
import { toast } from 'sonner';

export default function Activities() {
  const [activities, setActivities] = useState<Activity[]>(mockActivities);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  
  const [filters, setFilters] = useState({
    status: 'all' as ActivityStatus | 'all',
    type: 'all' as ActivityType | 'all',
    unit: 'all',
    dateFrom: '',
    dateTo: '',
  });

  // Chỉ hiển thị hoạt động có trạng thái "Nháp", "Chờ duyệt", "Đang thực hiện" và "Hoàn thành"
  const planningActivities = activities.filter(a => 
    a.status === 'draft' || a.status === 'pending' || a.status === 'inprogress' || a.status === 'completed'
  );

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa hoạt động này?')) {
      setActivities(activities.filter(a => a.id !== id));
      toast.success('Đã xóa hoạt động thành công');
    }
  };

  const handleView = (activity: Activity) => {
    setSelectedActivity(activity);
    setShowViewModal(true);
  };

  const handleEdit = (activity: Activity) => {
    setSelectedActivity(activity);
    setShowCreateModal(true);
  };

  const handleSendApproval = (id: string) => {
    const activity = activities.find(a => a.id === id);
    if (activity) {
      setActivities(activities.map(a => 
        a.id === id ? { ...a, status: 'pending' as ActivityStatus } : a
      ));
      toast.success('Đã gửi trình duyệt trên hệ thống Doffice thành công');
    }
  };

  const handleApprove = (id: string) => {
    const activity = activities.find(a => a.id === id);
    if (activity && activity.status === 'pending') {
      if (confirm('Bạn có chắc chắn muốn phê duyệt hoạt động này?')) {
        setActivities(activities.map(a => 
          a.id === id ? { ...a, status: 'inprogress' as ActivityStatus } : a
        ));
        toast.success('Đã phê duyệt hoạt động thành công. Trạng thái chuyển sang "Đang thực hiện"');
      }
    }
  };

  const handleExport = () => {
    toast.success('Đang xuất file Excel...');
    setTimeout(() => {
      toast.success('Xuất Excel thành công');
    }, 1000);
  };

  const filteredActivities = planningActivities.filter(activity => {
    if (searchQuery && !activity.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !activity.organizingUnit.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filters.status !== 'all' && activity.status !== filters.status) return false;
    if (filters.type !== 'all' && activity.type !== filters.type) return false;
    if (filters.unit !== 'all' && activity.organizingUnit !== filters.unit) return false;
    return true;
  });

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold">Lập kế hoạch và Quản lý hoạt động</h1>
          <p className="text-muted-foreground mt-1">
            Tạo mới, quản lý và theo dõi các hoạt động công tác Đảng
          </p>
        </div>

        {/* Toolbar */}
        <Card className="p-4">
          <div className="flex flex-col gap-4">
            {/* Top Row */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                className="bg-primary hover:bg-primary/90 gap-2"
                onClick={() => {
                  setSelectedActivity(null);
                  setShowCreateModal(true);
                }}
              >
                <Plus className="w-4 h-4" />
                Tạo kế hoạch mới
              </Button>
              
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm theo tên hoạt động, đơn vị..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Button 
                variant={showFilters ? 'default' : 'outline'}
                className="gap-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4" />
                Lọc & Phân loại
              </Button>
              
              <Button variant="outline" className="gap-2" onClick={handleExport}>
                <FileSpreadsheet className="w-4 h-4" />
                Xuất Excel
              </Button>
              
              <Button variant="outline" size="icon">
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <ActivityFilters filters={filters} onFiltersChange={setFilters} />
            )}
          </div>
        </Card>

        {/* Activities Table */}
        <ActivityTable
          activities={filteredActivities}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSendApproval={handleSendApproval}
          onApprove={handleApprove}
        />

        {/* Modals */}
        {showCreateModal && (
          <CreateActivityModal
            activity={selectedActivity}
            onClose={() => {
              setShowCreateModal(false);
              setSelectedActivity(null);
            }}
            onSave={(activity) => {
              if (selectedActivity) {
                setActivities(activities.map(a => a.id === activity.id ? activity : a));
                toast.success('Đã cập nhật hoạt động thành công');
              } else {
                setActivities([...activities, activity]);
                toast.success('Đã tạo hoạt động mới thành công');
              }
              setShowCreateModal(false);
              setSelectedActivity(null);
            }}
          />
        )}

        {showViewModal && selectedActivity && (
          <ViewActivityModal
            activity={selectedActivity}
            onClose={() => {
              setShowViewModal(false);
              setSelectedActivity(null);
            }}
            onEdit={() => {
              setShowViewModal(false);
              setShowCreateModal(true);
            }}
          />
        )}
      </div>
    </MainLayout>
  );
}
