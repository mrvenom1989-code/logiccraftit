import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { TrendingUp, Users, FileSpreadsheet, Activity, Clock, Server, ArrowUpRight } from 'lucide-react';
import { format } from 'date-fns';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    mrr: 0,
    activeClients: 0,
    activeProjects: 0,
    pendingInvoices: 0
  });
  const [upcomingRenewals, setUpcomingRenewals] = useState([]);
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // These will fail gracefully if tables don't exist yet
      
      // 1. Fetch Clients
      let clientCount = 0;
      const { count: clientsC, error: clientErr } = await supabase.from('clients').select('*', { count: 'exact', head: true }).eq('status', 'Active');
      if (!clientErr) clientCount = clientsC || 0;

      // 2. Fetch Projects
      let projectCount = 0;
      const { count: projectsC, error: projErr } = await supabase.from('projects').select('*', { count: 'exact', head: true }).neq('status', 'Completed');
      if (!projErr) projectCount = projectsC || 0;

      // 3. Fetch Pending Invoices (Unpaid) amount
      let pendingTotal = 0;
      const { data: unpaidInvoices, error: invErr } = await supabase.from('invoices').select('total').eq('status', 'Unpaid');
      if (!invErr && unpaidInvoices) {
        pendingTotal = unpaidInvoices.reduce((sum, inv) => sum + Number(inv.total), 0);
      }

      // 4. Calculate MRR from active maintenance contracts
      let currentMrr = 0;
      const { data: contracts, error: conErr } = await supabase.from('billing_contracts').select('amount, billing_cycle').eq('status', 'Active').eq('charge_type', 'Maintenance');
      if (!conErr && contracts) {
        currentMrr = contracts.reduce((sum, contract) => {
          let monthlyVal = 0;
          if (contract.billing_cycle === 'Monthly') monthlyVal = Number(contract.amount);
          if (contract.billing_cycle === 'Quarterly') monthlyVal = Number(contract.amount) / 3;
          if (contract.billing_cycle === 'Bi-Annually') monthlyVal = Number(contract.amount) / 6;
          if (contract.billing_cycle === 'Annually') monthlyVal = Number(contract.amount) / 12;
          return sum + monthlyVal;
        }, 0);
      }

      // 5. Fetch upcoming renewals
      const { data: renewals, error: renErr } = await supabase
        .from('billing_contracts')
        .select('*, projects(name, clients(company_name))')
        .eq('status', 'Active')
        .order('next_billing_date', { ascending: true })
        .limit(5);

      // 6. Fetch recent invoices
      const { data: recentInv, error: riErr } = await supabase
        .from('invoices')
        .select('id, client_name, total, status, issue_date')
        .order('created_at', { ascending: false })
        .limit(5);

      setStats({
        mrr: currentMrr,
        activeClients: clientCount,
        activeProjects: projectCount,
        pendingInvoices: pendingTotal
      });

      if (!renErr) setUpcomingRenewals(renewals || []);
      if (!riErr) setRecentInvoices(recentInv || []);

    } catch (err) {
      console.warn('Dashboard fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="h-full flex items-center justify-center"><Activity className="animate-spin text-electric-cyan" size={40} /></div>;
  }

  return (
    <div className="flex flex-col h-full relative space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-white mb-2">Revenue Operations</h1>
        <p className="text-slate-400">High-level overview of active contracts and MRR.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#0A1128] border border-slate-800 p-6 rounded-2xl relative overflow-hidden">
          <div className="absolute -right-4 -top-4 text-electric-cyan opacity-10"><TrendingUp size={100} /></div>
          <p className="text-slate-400 text-sm font-mono mb-2">MONTHLY RECURRING REVENUE</p>
          <h2 className="text-4xl font-display font-bold text-white flex items-center gap-2">
            <span className="text-electric-cyan">$</span>{stats.mrr.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
          </h2>
        </div>
        
        <div className="bg-[#0A1128] border border-slate-800 p-6 rounded-2xl">
          <div className="flex justify-between items-start mb-2">
            <p className="text-slate-400 text-sm font-mono">ACTIVE CLIENTS</p>
            <Users className="text-slate-500" size={20} />
          </div>
          <h2 className="text-3xl font-display font-bold text-white">{stats.activeClients}</h2>
        </div>

        <div className="bg-[#0A1128] border border-slate-800 p-6 rounded-2xl">
          <div className="flex justify-between items-start mb-2">
            <p className="text-slate-400 text-sm font-mono">ACTIVE PROJECTS</p>
            <Server className="text-slate-500" size={20} />
          </div>
          <h2 className="text-3xl font-display font-bold text-white">{stats.activeProjects}</h2>
        </div>

        <div className="bg-[#0A1128] border border-slate-800 p-6 rounded-2xl">
          <div className="flex justify-between items-start mb-2">
            <p className="text-slate-400 text-sm font-mono">PENDING INVOICES</p>
            <FileSpreadsheet className="text-slate-500" size={20} />
          </div>
          <h2 className="text-3xl font-display font-bold text-white text-yellow-500">
            ${stats.pendingInvoices.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
        {/* Upcoming Renewals */}
        <div className="bg-[#0A1128] border border-slate-800 rounded-2xl flex flex-col">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center">
            <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
              <Clock className="text-electric-cyan" size={18} /> Upcoming Renewals & Dues
            </h3>
          </div>
          <div className="p-6 flex-1 overflow-auto">
            {upcomingRenewals.length === 0 ? (
              <p className="text-slate-500 text-center py-8">No upcoming billing contracts.</p>
            ) : (
              <div className="space-y-4">
                {upcomingRenewals.map(contract => (
                  <div key={contract.id} className="flex justify-between items-center bg-void-black border border-slate-800 p-4 rounded-xl">
                    <div>
                      <h4 className="text-white font-medium mb-1">{contract.projects?.clients?.company_name || 'Unknown Client'}</h4>
                      <p className="text-xs text-slate-500">{contract.projects?.name} • {contract.billing_cycle}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-electric-cyan font-mono">${parseFloat(contract.amount).toFixed(2)}</div>
                      <div className="text-xs text-slate-400 mt-1">Due: {contract.next_billing_date ? format(new Date(contract.next_billing_date), 'MMM dd, yyyy') : 'N/A'}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Invoices */}
        <div className="bg-[#0A1128] border border-slate-800 rounded-2xl flex flex-col">
          <div className="p-6 border-b border-slate-800 flex justify-between items-center">
            <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
              <FileSpreadsheet className="text-slate-400" size={18} /> Recent Invoices
            </h3>
          </div>
          <div className="p-6 flex-1 overflow-auto">
            {recentInvoices.length === 0 ? (
              <p className="text-slate-500 text-center py-8">No recent invoices.</p>
            ) : (
              <div className="space-y-4">
                {recentInvoices.map(inv => (
                  <div key={inv.id} className="flex justify-between items-center border-b border-slate-800/50 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded bg-slate-900 border border-slate-800 flex items-center justify-center text-xs font-mono text-slate-400">
                        INV
                      </div>
                      <div>
                        <h4 className="text-slate-200 font-medium text-sm">{inv.client_name}</h4>
                        <p className="text-xs text-slate-500 mt-1">{format(new Date(inv.issue_date), 'MMM dd, yyyy')}</p>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <span className="font-mono text-sm text-white">${parseFloat(inv.total).toFixed(2)}</span>
                      <span className={`text-[10px] uppercase font-bold mt-1 px-2 py-0.5 rounded ${
                        inv.status === 'Paid' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'
                      }`}>
                        {inv.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
