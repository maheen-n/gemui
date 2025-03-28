
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Hotel } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // In a real app, this would be an API call to localhost:8000
      // For demo purposes, just check for admin/admin
      if (username === 'admin' && password === 'admin') {
        localStorage.setItem('hotelUser', JSON.stringify({ 
          username, 
          role: 'admin', 
          name: 'Admin User',
          token: 'demo-token-12345' 
        }));
        
        toast({
          title: 'Login Successful',
          description: 'Welcome to Hotel Harmony Management System',
        });
        
        navigate('/dashboard');
      } else {
        toast({
          variant: 'destructive',
          title: 'Login Failed',
          description: 'Invalid username or password',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Login Error',
        description: 'Failed to connect to the server',
      });
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background bg-[url('/hotel-bg.svg')] bg-cover bg-center">
      <div className="w-full max-w-md">
        <Card className="border-primary/10 shadow-xl">
          <CardHeader className="space-y-1 flex flex-col items-center">
            <div className="bg-primary rounded-full p-3 mb-3">
              <Hotel className="h-6 w-6 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl text-center">Hotel Harmony</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access the management system
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </CardFooter>
          </form>
        </Card>
        <div className="mt-4 text-center text-sm text-muted-foreground">
          <p>Demo credentials: admin / admin</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
