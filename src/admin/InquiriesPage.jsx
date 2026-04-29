import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { Loader2, Mail, User, Clock, AlertCircle, Inbox, Trash2 } from 'lucide-react';

const InquiriesPage = () => {
  const [inquiries, setInquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInquiries(data || []);
    } catch (err) {
      console.error('Error fetching inquiries:', err);
      setError('Failed to load inquiries.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const { error } = await supabase
        .from('inquiries')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      
      setInquiries(prev => prev.map(inq => inq.id === id ? { ...inq, status: newStatus } : inq));
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status.');
    }
  };

  const deleteInquiry = async (id) => {
    if (!window.confirm('Are you sure you want to delete this inquiry?')) return;
    try {
      const { error } = await supabase.from('inquiries').delete().eq('id', id);
      if (error) throw error;
      setInquiries(prev => prev.filter(inq => inq.id !== id));
    } catch (err) {
      console.error('Error deleting inquiry:', err);
      alert('Failed to delete inquiry.');
    }
  };

  if (isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Loader2 className="animate-spin text-electric-cyan" size={40} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-white mb-2">Incoming Transmissions</h1>
          <p className="text-slate-400">Manage client inquiries and project requests.</p>
        </div>
      </div>

      {error ? (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl flex items-center gap-3">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      ) : inquiries.length === 0 ? (
        <div className="flex-1 border border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-500">
          <Inbox size={48} className="mb-4 opacity-50" />
          <p>No active transmissions found in the database.</p>
        </div>
      ) : (
        <div className="bg-[#0A1128] border border-slate-800 rounded-[2rem] overflow-hidden shadow-2xl flex-1 flex flex-col">
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-void-black/50 border-b border-slate-800 text-xs font-mono text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Contact Info</th>
                  <th className="px-6 py-4 font-medium">Protocol / Details</th>
                  <th className="px-6 py-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-sm">
                {inquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-5 align-top w-40">
                      <div className="flex items-center gap-2 text-slate-400 font-mono text-xs">
                        <Clock size={14} />
                        {format(new Date(inq.created_at), 'MMM dd, yyyy')}
                      </div>
                    </td>
                    <td className="px-6 py-5 align-top w-64">
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-white flex items-center gap-2"><User size={14} className="text-electric-cyan"/> {inq.name}</span>
                        <span className="text-slate-400 text-xs flex items-center gap-2"><Mail size={14} className="text-slate-500"/> {inq.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 align-top max-w-md">
                      <div className="inline-block px-2 py-1 rounded-md bg-electric-cyan/10 text-electric-cyan border border-electric-cyan/20 text-xs font-mono mb-2">
                        {inq.project_type}
                      </div>
                      <p className="text-slate-300 leading-relaxed text-sm">
                        {inq.message}
                      </p>
                    </td>
                    <td className="px-6 py-5 align-top w-56">
                      <div className="flex items-center gap-2">
                        <select
                          value={inq.status || 'New'}
                          onChange={(e) => updateStatus(inq.id, e.target.value)}
                          className={`bg-void-black border text-xs font-mono rounded px-3 py-1.5 w-full focus:outline-none transition-colors ${
                            inq.status === 'New' ? 'border-electric-cyan/50 text-electric-cyan' :
                            inq.status === 'In Progress' ? 'border-yellow-500/50 text-yellow-500' :
                            inq.status === 'Completed' ? 'border-green-500/50 text-green-500' :
                            'border-slate-700 text-slate-400'
                          }`}
                        >
                          <option value="New">NEW</option>
                          <option value="In Progress">IN PROGRESS</option>
                          <option value="Completed">COMPLETED</option>
                          <option value="Archived">ARCHIVED</option>
                        </select>
                        <button onClick={() => deleteInquiry(inq.id)} className="p-1.5 bg-void-black border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded transition-colors" title="Delete Inquiry">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default InquiriesPage;
