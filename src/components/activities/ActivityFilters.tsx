import { activityTypeLabels, statusLabels, units } from '@/data/mockData';
import { ActivityStatus, ActivityType } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface ActivityFiltersProps {
  filters: {
    status: ActivityStatus | 'all';
    type: ActivityType | 'all';
    unit: string;
    dateFrom: string;
    dateTo: string;
  };
  onFiltersChange: (filters: any) => void;
}

export function ActivityFilters({ filters, onFiltersChange }: ActivityFiltersProps) {
  const handleReset = () => {
    onFiltersChange({
      status: 'all',
      type: 'all',
      unit: 'all',
      dateFrom: '',
      dateTo: '',
    });
  };

  return (
    <div className="border-t pt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Trạng thái</label>
          <Select
            value={filters.status}
            onValueChange={(value) => onFiltersChange({ ...filters, status: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn trạng thái" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="all">Tất cả</SelectItem>
              {Object.entries(statusLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Loại hình hoạt động</label>
          <Select
            value={filters.type}
            onValueChange={(value) => onFiltersChange({ ...filters, type: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn loại hình" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="all">Tất cả</SelectItem>
              {Object.entries(activityTypeLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Đơn vị tổ chức</label>
          <Select
            value={filters.unit}
            onValueChange={(value) => onFiltersChange({ ...filters, unit: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn đơn vị" />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="all">Tất cả</SelectItem>
              {units.map((unit) => (
                <SelectItem key={unit} value={unit}>{unit}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2 items-end">
          <Button onClick={handleReset} variant="outline" className="flex-1">
            Xóa bộ lọc
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Từ ngày</label>
          <Input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => onFiltersChange({ ...filters, dateFrom: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block">Đến ngày</label>
          <Input
            type="date"
            value={filters.dateTo}
            onChange={(e) => onFiltersChange({ ...filters, dateTo: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
