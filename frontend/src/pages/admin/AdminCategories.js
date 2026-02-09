import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AdminSidebar } from '../../components/AdminSidebar';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog';

const API_URL = process.env.REACT_APP_BACKEND_URL;

export default function AdminCategories() {
  const navigate = useNavigate();
  const { user, token, isAuthenticated, isAdmin } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      navigate('/admin/login');
      return;
    }
    fetchCategories();
  }, [isAuthenticated, isAdmin]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingCategory) {
        await axios.put(
          `${API_URL}/api/categories/${editingCategory._id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Category updated successfully');
      } else {
        await axios.post(
          `${API_URL}/api/categories`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Category created successfully');
      }

      setDialogOpen(false);
      setFormData({ name: '', description: '' });
      setEditingCategory(null);
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Operation failed');
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, description: category.description });
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    try {
      await axios.delete(`${API_URL}/api/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Category deleted successfully');
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Delete failed');
    }
  };

  const handleDialogClose = (open) => {
    setDialogOpen(open);
    if (!open) {
      setEditingCategory(null);
      setFormData({ name: '', description: '' });
    }
  };

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-white">
      <AdminSidebar active="categories" />
      
      <div className="flex-1 ml-64">
        <header className="border-b p-6 flex items-center justify-between">
          <h1 className="text-3xl font-semibold tracking-tight" data-testid="categories-heading">
            Categories
          </h1>
          
          <Dialog open={dialogOpen} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
              <Button data-testid="add-category-button">
                <Plus className="h-4 w-4 mr-2" strokeWidth={1.5} />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingCategory ? 'Edit Category' : 'Create Category'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4" data-testid="category-form">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    data-testid="category-name-input"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    data-testid="category-description-input"
                  />
                </div>
                <Button type="submit" className="w-full" data-testid="category-submit-button">
                  {editingCategory ? 'Update' : 'Create'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </header>

        <div className="p-8">
          {loading ? (
            <p>Loading...</p>
          ) : categories.length === 0 ? (
            <div className="text-center py-16" data-testid="no-categories">
              <p className="text-muted-foreground">No categories yet. Create your first one!</p>
            </div>
          ) : (
            <div className="border rounded-md">
              <table className="w-full">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-medium">Name</th>
                    <th className="text-left p-4 font-medium">Description</th>
                    <th className="text-right p-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map(category => (
                    <tr key={category._id} className="border-b last:border-0" data-testid={`category-row-${category._id}`}>
                      <td className="p-4 font-medium">{category.name}</td>
                      <td className="p-4 text-muted-foreground">{category.description}</td>
                      <td className="p-4 text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(category)}
                          data-testid="edit-category-button"
                        >
                          <Pencil className="h-4 w-4" strokeWidth={1.5} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(category._id)}
                          data-testid="delete-category-button"
                        >
                          <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
