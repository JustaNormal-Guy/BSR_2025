import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save } from 'lucide-react';
import { toast } from 'sonner';

export default function Settings() {
  const handleSave = () => {
    toast.success('Đã lưu cài đặt thành công');
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Cài đặt</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý cài đặt hệ thống
          </p>
        </div>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Thông tin tổ chức</h2>
          <div className="space-y-4 max-w-2xl">
            <div>
              <Label>Tên cơ quan</Label>
              <Input defaultValue="Đảng bộ Cơ quan XYZ" />
            </div>
            <div>
              <Label>Địa chỉ</Label>
              <Input defaultValue="Số 1 Đường ABC, Quận 1, TP.HCM" />
            </div>
            <div>
              <Label>Điện thoại</Label>
              <Input defaultValue="028 1234 5678" />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" defaultValue="dangbo@example.com" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Cài đặt hệ thống</h2>
          <div className="space-y-4 max-w-2xl">
            <div>
              <Label>Múi giờ</Label>
              <Input defaultValue="GMT+7 (Giờ Việt Nam)" disabled />
            </div>
            <div>
              <Label>Định dạng ngày tháng</Label>
              <Input defaultValue="dd/MM/yyyy" disabled />
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave} className="gap-2">
            <Save className="w-4 h-4" />
            Lưu cài đặt
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
