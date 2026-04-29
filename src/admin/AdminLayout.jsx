import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { LayoutDashboard, Inbox, FileText, FileSpreadsheet, LogOut, Users, TrendingUp } from 'lucide-react';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const session = localStorage.getItem('logiccraft_admin_session');
    if (!session) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('logiccraft_admin_session');
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <TrendingUp size={20} /> },
    { name: 'Clients', path: '/admin/clients', icon: <Users size={20} /> },
    { name: 'Inquiries', path: '/admin/inquiries', icon: <Inbox size={20} /> },
    { name: 'Quotes', path: '/admin/quotes', icon: <FileText size={20} /> },
    { name: 'Invoices', path: '/admin/invoices', icon: <FileSpreadsheet size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-void-black text-slate-300 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0A1128] border-r border-slate-800 flex flex-col z-20">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-void-black border border-slate-700 rounded flex items-center justify-center">
            <LayoutDashboard className="text-electric-cyan" size={16} />
          </div>
          <span className="font-display font-bold text-lg text-white">Logic Core</span>
        </div>

        <nav className="flex-1 py-6 px-4 flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path === '/admin/clients' && location.pathname.startsWith('/admin/clients/'));
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-electric-cyan/10 text-electric-cyan border border-electric-cyan/30' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                {item.icon}
                <span className="font-medium text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium text-sm">Terminate Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
         <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#00E5FF_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
         <div className="flex-1 overflow-auto p-8 z-10">
           <Outlet />
         </div>
      </main>
    </div>
  );
};

export default AdminLayout;
