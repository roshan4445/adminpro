import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  AlertTriangle, 
  Megaphone, 
  Car, 
  Users, 
  Shield, 
  Settings,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isMobile?: boolean;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'complaints', label: 'Complaints', icon: AlertTriangle },
  { id: 'schemes', label: 'Schemes', icon: Megaphone },
  { id: 'traffic', label: 'Traffic Issues', icon: Car },
  { id: 'elderly', label: 'Elderly Skills', icon: Users },
  { id: 'scam-alerts', label: 'Scam Alerts', icon: Shield },
  { id: 'admin-tools', label: 'Admin Tools', icon: Settings }
];

export function Sidebar({ activeSection, onSectionChange, isMobile = false }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleSectionChange = (section: string) => {
    onSectionChange(section);
    if (isMobile) {
      setIsMobileOpen(false);
    }
  };

  if (isMobile) {
    return (
      <>
        <Button
          variant="ghost"
          size="sm"
          className="fixed top-4 left-4 z-50 md:hidden"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>

        {isMobileOpen && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div 
              className="absolute inset-0 bg-black/50" 
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.aside className="relative w-64 h-full bg-background border-r shadow-lg">
              <div className="p-6">
                <h2 className="text-xl font-bold">Admin Portal</h2>
                <p className="text-sm text-muted-foreground">Government Services</p>
              </div>
              <nav className="px-4 space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.id}
                      variant={activeSection === item.id ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => handleSectionChange(item.id)}
                    >
                      <Icon className="mr-3 h-4 w-4" />
                      {item.label}
                    </Button>
                  );
                })}
              </nav>
            </motion.aside>
          </motion.div>
        )}
      </>
    );
  }

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 80 : 256 }}
      className="hidden md:flex flex-col bg-background border-r h-screen sticky top-0"
    >
      <div className="p-6">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div>
              <h2 className="text-xl font-bold">Admin Portal</h2>
              <p className="text-sm text-muted-foreground">Government Services</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <nav className="px-4 space-y-2 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={activeSection === item.id ? "default" : "ghost"}
              className={cn(
                "w-full",
                isCollapsed ? "justify-center px-2" : "justify-start"
              )}
              onClick={() => handleSectionChange(item.id)}
            >
              <Icon className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
              {!isCollapsed && item.label}
            </Button>
          );
        })}
      </nav>
    </motion.aside>
  );
}