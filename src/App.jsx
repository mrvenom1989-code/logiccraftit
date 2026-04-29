import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AdminLayout from './admin/AdminLayout';
import LoginPage from './admin/LoginPage';
import InquiriesPage from './admin/InquiriesPage';
import QuotesPage from './admin/QuotesPage';
import InvoicesPage from './admin/InvoicesPage';
import DashboardPage from './admin/DashboardPage';
import ClientsPage from './admin/ClientsPage';
import ClientDetailPage from './admin/ClientDetailPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        
        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="clients" element={<ClientsPage />} />
          <Route path="clients/:id" element={<ClientDetailPage />} />
          <Route path="inquiries" element={<InquiriesPage />} />
          <Route path="quotes" element={<QuotesPage />} />
          <Route path="invoices" element={<InvoicesPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
