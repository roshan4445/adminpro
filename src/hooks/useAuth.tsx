import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'state' | 'district' | 'mandal';
  district?: string;
  mandal?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  userRole: 'state' | 'district' | 'mandal' | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Mock user database
const mockUsers: User[] = [
  {
    id: '1',
    email: 'state.admin@gov.in',
    name: 'State Administrator',
    role: 'state'
  },
  {
    id: '2',
    email: 'district1.admin@gov.in',
    name: 'District 1 Administrator',
    role: 'district',
    district: 'district1'
  },
  {
    id: '3',
    email: 'district2.admin@gov.in',
    name: 'District 2 Administrator',
    role: 'district',
    district: 'district2'
  },
  {
    id: '4',
    email: 'mandal1.admin@gov.in',
    name: 'Mandal 1 Administrator',
    role: 'mandal',
    district: 'district1',
    mandal: 'mandal1'
  },
  {
    id: '5',
    email: 'mandal2.admin@gov.in',
    name: 'Mandal 2 Administrator',
    role: 'mandal',
    district: 'district1',
    mandal: 'mandal2'
  },
  {
    id: '6',
    email: 'mandal3.admin@gov.in',
    name: 'Mandal 3 Administrator',
    role: 'mandal',
    district: 'district2',
    mandal: 'mandal3'
  }
];

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<'state' | 'district' | 'mandal' | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const token = Cookies.get('authToken');
    const userData = Cookies.get('userData');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setIsAuthenticated(true);
        setUser(parsedUser);
        setUserRole(parsedUser.role);
      } catch (error) {
        console.error('Error parsing user data:', error);
        logout();
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find user by email
    const foundUser = mockUsers.find(u => u.email === email);
    
    // For demo purposes, password is 'admin123' for all users
    if (foundUser && password === 'admin123') {
      const token = `token_${foundUser.id}_${Date.now()}`;
      
      Cookies.set('authToken', token, { expires: 1 });
      Cookies.set('userData', JSON.stringify(foundUser), { expires: 1 });
      
      setIsAuthenticated(true);
      setUser(foundUser);
      setUserRole(foundUser.role);
      
      toast({
        title: "Login Successful",
        description: `Welcome, ${foundUser.name}!`,
      });
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    Cookies.remove('authToken');
    Cookies.remove('userData');
    setIsAuthenticated(false);
    setUser(null);
    setUserRole(null);
    
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const value = {
    isAuthenticated,
    user,
    userRole,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}