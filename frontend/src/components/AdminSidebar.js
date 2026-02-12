import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, FolderTree, Package, ShoppingCart } from 'lucide-react';

export const AdminSidebar = ({ active }) => {
  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard, key: 'dashboard' },
    { name: 'Categories', path: '/admin/categories', icon: FolderTree, key: 'categories' },
    { name: 'Products', path: '/admin/products', icon: Package, key: 'products' },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingCart, key: 'orders' }
  ];

  return (
    <aside className="w-64 border-r bg-white h-screen fixed left-0 top-0">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold tracking-tight">Pixeladda Admin</h2>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map(item => {
            const Icon = item.icon;
            return (
              <li key={item.key}>
                <Link
                  to={item.path}
                  data-testid={`nav-${item.key}`}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-md transition-colors ${
                    active === item.key
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <Icon className="h-5 w-5" strokeWidth={1.5} />
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};
