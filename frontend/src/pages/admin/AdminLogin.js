import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'sonner';
import { Shield } from 'lucide-react';

const API_URL = process.env.REACT_APP_BACKEND_URL;

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, formData);
      
      if (response.data.user.role !== 'admin') {
        toast.error('Access denied. Admin only.');
        return;
      }

      login(response.data.token, response.data.user);
      toast.success('Admin login successful!');
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-center mb-6">
            <Shield className="h-12 w-12 text-primary" strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl font-semibold tracking-tight mb-2 text-center" data-testid="admin-login-heading">
            Pixeladda Admin Portal
          </h1>
          <p className="text-muted-foreground mb-8 text-center">Login to manage your marketplace</p>

          <form onSubmit={handleSubmit} className="space-y-6" data-testid="admin-login-form">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                data-testid="email-input"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                data-testid="password-input"
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading} data-testid="admin-login-submit-button">
              {loading ? 'Logging in...' : 'Login as Admin'}
            </Button>
          </form>
        </div>
      </div>

      <div
        className="hidden lg:block flex-1 bg-gray-100"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1696087225391-eb97abf5ba20?crop=entropy&cs=srgb&fm=jpg&q=85')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      ></div>
    </div>
  );
}
