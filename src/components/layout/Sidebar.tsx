import { NavLink, useLocation } from 'react-router-dom';
import { BarChart3, Calendar, CheckCircle, Settings, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { path: '/', icon: LayoutDashboard, label: 'Tổng quan' },
  { path: '/activities', icon: Calendar, label: 'Lập kế hoạch và Quản lý hoạt động' },
  { path: '/results', icon: CheckCircle, label: 'Cập nhật kết quả thực hiện' },
  { path: '/statistics', icon: BarChart3, label: 'Thống kê và Báo cáo' },
  { path: '/settings', icon: Settings, label: 'Cài đặt' },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-primary text-primary-foreground shadow-lg z-30">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-4 border-b border-primary-foreground/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center text-2xl">
              ★
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-sm leading-tight">HỆ THỐNG QUẢN LÝ</h2>
              <p className="text-xs opacity-90">Công tác Đảng</p>
            </div>
          </div>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto py-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-all',
                  isActive
                    ? 'bg-primary-foreground text-primary font-semibold shadow-md'
                    : 'text-primary-foreground/90 hover:bg-primary-foreground/10'
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm leading-tight">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-primary-foreground/20">
          <div className="text-xs text-primary-foreground/70 text-center">
            © 2025 Đảng Cộng sản Việt Nam
          </div>
        </div>
      </div>
    </aside>
  );
}
