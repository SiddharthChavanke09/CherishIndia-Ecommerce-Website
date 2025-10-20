import React, { createContext, useContext, useState, useEffect } from 'react';
import { orderAPI } from '../utils/api';
import { useAuth } from './AuthContext';

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchUserOrders = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await orderAPI.getByUser(user.id);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserOrders();
    }
  }, [user]);

  const createOrder = async (orderData) => {
    try {
      const response = await orderAPI.create({
        ...orderData,
        userId: user?.id,
        status: 'pending',
        trackingSteps: [
          { status: 'Order Placed', completed: true, date: new Date().toISOString() },
          { status: 'Processing', completed: false, date: null },
          { status: 'Shipped', completed: false, date: null },
          { status: 'Out for Delivery', completed: false, date: null },
          { status: 'Delivered', completed: false, date: null }
        ]
      });
      
      const newOrder = response.data;
      setOrders(prev => [newOrder, ...prev]);
      return { success: true, order: newOrder };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateOrderStatus = async (orderId, newStatus, stepIndex) => {
    try {
      const response = await orderAPI.updateStatus(orderId, { status: newStatus, stepIndex });
      setOrders(prev => prev.map(order =>
        order._id === orderId ? response.data : order
      ));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const getOrderById = async (orderId) => {
    try {
      const response = await orderAPI.getById(orderId);
      return response.data;
    } catch (error) {
      console.error('Error fetching order:', error);
      return null;
    }
  };

  return (
    <OrderContext.Provider value={{
      orders,
      loading,
      createOrder,
      updateOrderStatus,
      getOrderById,
      fetchUserOrders
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within OrderProvider');
  }
  return context;
};
