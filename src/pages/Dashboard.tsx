import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Calendar, CheckCircle, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { mockStatistics, mockActivities } from '@/data/mockData';
import { format } from 'date-fns';

export default function Dashboard() {
  const upcomingActivities = mockActivities
    .filter(a => new Date(a.startTime) > new Date())
    .slice(0, 5);

  const pendingActions = {
    pending: mockActivities.filter(a => a.status === 'pending').length,
    draft: mockActivities.filter(a => a.status === 'draft').length,
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-lg p-6 shadow-lg">
          <h1 className="text-2xl font-bold mb-2">Chào mừng Đồng chí Nguyễn Văn A</h1>
          <p className="text-primary-foreground/90">
            Hôm nay: {format(new Date(), "dd/MM/yyyy")}
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Activities */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h2 className="text-lg font-bold mb-4">Hoạt động sắp diễn ra</h2>
              <div className="space-y-4">
                {upcomingActivities.map((activity) => (
                  <div key={activity.id} className="flex gap-4 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-shrink-0 w-16 text-center">
                      <div className="text-2xl font-bold text-primary">
                        {format(new Date(activity.startTime), 'dd')}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Tháng {format(new Date(activity.startTime), 'MM')}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{activity.name}</h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span>📍 {activity.location}</span>
                        <span>🏛️ {activity.organizingUnit}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Pending Actions */}
          <div>
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold">Cần xử lý</h2>
                <div className="w-6 h-6 bg-destructive rounded-full flex items-center justify-center">
                  <span className="text-xs text-destructive-foreground font-bold">
                    {pendingActions.pending + pendingActions.draft}
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-orange-600" />
                    <span className="text-sm">Chờ duyệt kế hoạch</span>
                  </div>
                  <span className="font-bold text-orange-600">{pendingActions.pending}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-600" />
                    <span className="text-sm">Bản nháp</span>
                  </div>
                  <span className="font-bold text-gray-600">{pendingActions.draft}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Recent Highlights */}
        <div>
          <h2 className="text-lg font-bold mb-4">Hoạt động nổi bật gần đây</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mockActivities.filter(a => a.status === 'pending').slice(0, 3).map((activity) => (
              <Card key={activity.id} className="overflow-hidden card-hover">
                <div className="h-32 bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                  <span className="text-4xl">🏛️</span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2 line-clamp-2">{activity.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {format(new Date(activity.startTime), 'dd/MM/yyyy')}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="status-badge status-completed">Đã hoàn thành</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
