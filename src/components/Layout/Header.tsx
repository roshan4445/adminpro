import { Bell, Search, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ui/theme-toggle';

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-semibold ml-12 md:ml-0">{title}</h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-2 bg-muted/50 rounded-lg px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search..." 
              className="border-0 bg-transparent focus-visible:ring-0 w-48"
            />
          </div>

          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              3
            </Badge>
          </Button>

          <ThemeToggle />

          <Avatar className="h-8 w-8">
            <AvatarImage src="" />
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}