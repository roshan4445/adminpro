import { useState, useEffect, createContext, useContext } from 'react';
import Cookies from 'js-cookie';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  isAuthenticated: boolean;
  adminCode: string | null;
  userRole: 'state' | 'district' | 'mandal' | null;
  login: (code: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    // Fallback implementation for when context is not available
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [adminCode, setAdminCode] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<'state' | 'district' | 'mandal' | null>(null);
    const { toast } = useToast();

    useEffect(() => {
      const token = Cookies.get('authToken');
      const code = Cookies.get('adminCode');
      
      if (token && code) {
        setIsAuthenticated(true);
        setAdminCode(code);
        setUserRole(determineRole(code));
      }
    }, []);

    const determineRole = (code: string): 'state' | 'district' | 'mandal' => {
      if (code.startsWith('s')) return 'state';
      if (code.includes('m')) return 'mandal';
      return 'district';
    };

    const login = async (code: string, password: string) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validate credentials
      const validCodes = ['s001', 'd1', 'd2', 'd3', 'd4', 'd1m1', 'd1m2', 'd2m1', 'd2m2'];
      
      if (validCodes.includes(code) && password === 'admin123') {
        const token = `token_${code}_${Date.now()}`;
        
        Cookies.set('authToken', token, { expires: 1 });
        Cookies.set('adminCode', code, { expires: 1 });
        
        setIsAuthenticated(true);
        setAdminCode(code);
        setUserRole(determineRole(code));
        
        toast({
          title: "Login Successful",
          description: `Welcome, ${code.toUpperCase()} Admin!`,
        });
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid credentials. Please try again.",
          variant: "destructive",
        });
        throw new Error('Invalid credentials');
      }
    };

    const logout = () => {
      Cookies.remove('authToken');
      Cookies.remove('adminCode');
      setIsAuthenticated(false);
      setAdminCode(null);
      setUserRole(null);
      
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
    };

    return {
      isAuthenticated,
      adminCode,
      userRole,
      login,
      logout,
    };
  }
  
  return context;
}