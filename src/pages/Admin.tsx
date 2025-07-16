import React, { useState, useEffect } from 'react';
import './Admin.css';

interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  size: string;
  color: string;
}

interface Order {
  _id: string;
  orderId: string;
  customerInfo: {
    email: string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    zipCode: string;
    country: string;
  };
  items: OrderItem[];
  payment: {
    stripePaymentIntentId: string;
    amount: number;
    currency: string;
    status: string;
  };
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  orderStatus: string;
  createdAt: string;
  updatedAt: string;
}

interface OrdersResponse {
  orders: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

const Admin: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);

  const fetchOrders = async (page: number = 1) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/orders?page=${page}&limit=20`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      
      const data: OrdersResponse = await response.json();
      setOrders(data.orders);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'succeeded': return '#28a745';
      case 'confirmed': return '#007bff';
      case 'processing': return '#ffc107';
      case 'shipped': return '#17a2b8';
      case 'delivered': return '#28a745';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  if (loading) {
    return (
      <div className="admin">
        <div className="container">
          <div className="admin__loading">Loading orders...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin">
        <div className="container">
          <div className="admin__error">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin">
      <div className="container">
        <div className="admin__header">
          <h1 className="admin__title">Order Management</h1>
          <div className="admin__stats">
            <div className="admin__stat">
              <span className="admin__stat-label">Total Orders:</span>
              <span className="admin__stat-value">{pagination?.total || 0}</span>
            </div>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="admin__empty">No orders found.</div>
        ) : (
          <>
            <div className="admin__table-container">
              <table className="admin__table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Email</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="admin__table-row">
                      <td className="admin__cell">
                        <code className="admin__order-id">{order.orderId}</code>
                      </td>
                      <td className="admin__cell">
                        <div className="admin__customer">
                          <div className="admin__customer-name">
                            {order.customerInfo.firstName} {order.customerInfo.lastName}
                          </div>
                          <div className="admin__customer-address">
                            {order.customerInfo.city}, {order.customerInfo.country}
                          </div>
                        </div>
                      </td>
                      <td className="admin__cell">
                        <a href={`mailto:${order.customerInfo.email}`} className="admin__email">
                          {order.customerInfo.email}
                        </a>
                      </td>
                      <td className="admin__cell">
                        <div className="admin__items">
                          {order.items.map((item, index) => (
                            <div key={index} className="admin__item">
                              <span className="admin__item-name">{item.productName}</span>
                              <span className="admin__item-details">
                                {item.quantity}x {item.size} {item.color} - {formatPrice(item.price)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="admin__cell">
                        <div className="admin__total">{formatPrice(order.total)}</div>
                        <div className="admin__payment-id">
                          Stripe: {order.payment.stripePaymentIntentId.slice(-8)}
                        </div>
                      </td>
                      <td className="admin__cell">
                        <span 
                          className="admin__status"
                          style={{ backgroundColor: getStatusColor(order.payment.status) }}
                        >
                          {order.payment.status}
                        </span>
                      </td>
                      <td className="admin__cell">
                        <div className="admin__date">{formatDate(order.createdAt)}</div>
                      </td>
                      <td className="admin__cell">
                        <button 
                          className="admin__view-btn"
                          onClick={() => {/* View details functionality */}}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pagination && pagination.pages > 1 && (
              <div className="admin__pagination">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="admin__page-btn"
                >
                  Previous
                </button>
                
                <span className="admin__page-info">
                  Page {currentPage} of {pagination.pages}
                </span>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.pages))}
                  disabled={currentPage === pagination.pages}
                  className="admin__page-btn"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Admin; 