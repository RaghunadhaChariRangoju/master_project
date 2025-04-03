import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Package, Users, ShoppingBag, BarChart3, Settings, Inbox } from 'lucide-react';

// Placeholder admin components - would be replaced with actual implementations
const ProductManagement = () => (
  <div className="p-4">
    <h2 className="text-2xl font-bold mb-4">Product Management</h2>
    <Alert className="mb-4">
      <AlertDescription>
        This feature is under development. You will be able to manage your products here soon.
      </AlertDescription>
    </Alert>
    <div className="flex justify-end">
      <Button>Add New Product</Button>
    </div>
  </div>
);

const OrderManagement = () => (
  <div className="p-4">
    <h2 className="text-2xl font-bold mb-4">Order Management</h2>
    <Alert className="mb-4">
      <AlertDescription>
        This feature is under development. You will be able to manage customer orders here soon.
      </AlertDescription>
    </Alert>
  </div>
);

const CustomerManagement = () => (
  <div className="p-4">
    <h2 className="text-2xl font-bold mb-4">Customer Management</h2>
    <Alert className="mb-4">
      <AlertDescription>
        This feature is under development. You will be able to manage your customers here soon.
      </AlertDescription>
    </Alert>
  </div>
);

const StoreSettings = () => (
  <div className="p-4">
    <h2 className="text-2xl font-bold mb-4">Store Settings</h2>
    <Alert className="mb-4">
      <AlertDescription>
        This feature is under development. You will be able to configure your store settings here soon.
      </AlertDescription>
    </Alert>
  </div>
);

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Summary stats for the dashboard
  const stats = [
    { title: 'Total Orders', value: '0', icon: <ShoppingBag className="h-5 w-5" /> },
    { title: 'Total Revenue', value: '₹0.00', icon: <BarChart3 className="h-5 w-5" /> },
    { title: 'Total Products', value: '0', icon: <Package className="h-5 w-5" /> },
    { title: 'Total Customers', value: '0', icon: <Users className="h-5 w-5" /> },
  ];

  return (
    <div className="container py-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64">
          <Card>
            <CardHeader>
              <CardTitle>Admin Panel</CardTitle>
              <CardDescription>Manage your online store</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <nav className="space-y-1">
                <Button 
                  variant={activeTab === 'overview' ? 'default' : 'ghost'} 
                  className="w-full justify-start gap-2 rounded-none"
                  onClick={() => {
                    setActiveTab('overview');
                    navigate('/admin');
                  }}
                >
                  <BarChart3 className="h-4 w-4" />
                  Dashboard
                </Button>
                <Button 
                  variant={activeTab === 'products' ? 'default' : 'ghost'} 
                  className="w-full justify-start gap-2 rounded-none"
                  onClick={() => {
                    setActiveTab('products');
                    navigate('/admin/products');
                  }}
                >
                  <Package className="h-4 w-4" />
                  Products
                </Button>
                <Button 
                  variant={activeTab === 'orders' ? 'default' : 'ghost'} 
                  className="w-full justify-start gap-2 rounded-none"
                  onClick={() => {
                    setActiveTab('orders');
                    navigate('/admin/orders');
                  }}
                >
                  <ShoppingBag className="h-4 w-4" />
                  Orders
                </Button>
                <Button 
                  variant={activeTab === 'customers' ? 'default' : 'ghost'} 
                  className="w-full justify-start gap-2 rounded-none"
                  onClick={() => {
                    setActiveTab('customers');
                    navigate('/admin/customers');
                  }}
                >
                  <Users className="h-4 w-4" />
                  Customers
                </Button>
                <Button 
                  variant={activeTab === 'settings' ? 'default' : 'ghost'} 
                  className="w-full justify-start gap-2 rounded-none"
                  onClick={() => {
                    setActiveTab('settings');
                    navigate('/admin/settings');
                  }}
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Button>
              </nav>
            </CardContent>
          </Card>
        </aside>
        
        {/* Main Content */}
        <div className="flex-1">
          <Routes>
            <Route path="/" element={
              <div className="space-y-6">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {stats.map((stat, index) => (
                    <Card key={index}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                            <p className="text-2xl font-bold">{stat.value}</p>
                          </div>
                          <div className="bg-primary/10 p-2 rounded-full text-primary">
                            {stat.icon}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {/* Recent Orders */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                    <CardDescription>Most recent customer orders</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <Inbox className="w-12 h-12 text-muted-foreground mb-4" />
                      <h3 className="text-xl font-medium mb-2">No orders yet</h3>
                      <p className="text-muted-foreground mb-6">
                        When customers place orders, they will appear here.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            } />
            <Route path="/products" element={<ProductManagement />} />
            <Route path="/orders" element={<OrderManagement />} />
            <Route path="/customers" element={<CustomerManagement />} />
            <Route path="/settings" element={<StoreSettings />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
