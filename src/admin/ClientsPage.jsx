import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Users, Plus, Loader2, Building, Mail, Phone, ChevronRight, X, Save } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';

const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    company_name: '',
    contact_name: '',
    email: '',
    phone: '',
    status: 'Active'
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Clients fetch error (table missing):', error);
        setClients([]);
      } else {
        setClients(data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveClient = async () => {
    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from('clients')
        .insert([formData])
        .select();

      if (error) throw error;
      
      setClients([data[0], ...clients]);
      setIsModalOpen(false);
      setFormData({ company_name: '', contact_name: '', email: '', phone: '', status: 'Active' });
    } catch (error) {
      console.error('Error saving client:', error);
      alert('Failed to create client. Ensure "clients" table exists.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-white mb-2">Client Hub</h1>
          <p className="text-slate-400">Manage your enterprise partners and their operations.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="px-6 py-2 text-sm flex items-center gap-2">
          <Plus size={16} /> New Client
        </Button>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="animate-spin text-electric-cyan" size={40} />
        </div>
      ) : clients.length === 0 ? (
        <div className="flex-1 border border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-500">
          <Users size={48} className="mb-4 opacity-50" />
          <p>No clients established yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map(client => (
            <Link key={client.id} to={`/admin/clients/${client.id}`} className="bg-[#0A1128] border border-slate-800 rounded-2xl p-6 hover:shadow-[0_0_20px_rgba(0,229,255,0.05)] hover:border-electric-cyan/30 transition-all group">
               <div className="flex justify-between items-start mb-4">
                 <div className="w-12 h-12 rounded-xl bg-void-black border border-slate-800 flex items-center justify-center text-electric-cyan font-bold text-xl">
                   {client.company_name.charAt(0).toUpperCase()}
                 </div>
                 <div className={`text-xs px-2 py-1 rounded font-mono ${client.status === 'Active' ? 'bg-electric-cyan/10 text-electric-cyan' : 'bg-slate-800 text-slate-400'}`}>
                   {client.status.toUpperCase()}
                 </div>
               </div>
               <h3 className="font-display text-xl font-bold text-white mb-1 group-hover:text-electric-cyan transition-colors">{client.company_name}</h3>
               <p className="text-slate-400 text-sm mb-6 flex items-center gap-2"><Building size={14} /> {client.contact_name}</p>
               
               <div className="space-y-2 mb-6">
                 <div className="flex items-center gap-3 text-sm text-slate-500">
                   <Mail size={14} className="text-slate-600" />
                   <span className="truncate">{client.email}</span>
                 </div>
                 {client.phone && (
                   <div className="flex items-center gap-3 text-sm text-slate-500">
                     <Phone size={14} className="text-slate-600" />
                     <span>{client.phone}</span>
                   </div>
                 )}
               </div>

               <div className="flex justify-end border-t border-slate-800 pt-4 mt-2">
                 <div className="text-electric-cyan text-sm font-medium flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                   View Profile <ChevronRight size={16} />
                 </div>
               </div>
            </Link>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-void-black/90 backdrop-blur-sm p-4">
           <div className="bg-[#0A1128] border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
             <div className="flex justify-between items-center p-6 border-b border-slate-800 bg-void-black/50">
               <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
                 <Building className="text-electric-cyan" size={20} /> Establish Client
               </h2>
               <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                 <X size={24} />
               </button>
             </div>

             <div className="p-6 space-y-4">
               <div>
                 <label className="block text-xs font-mono text-slate-400 mb-2">COMPANY NAME *</label>
                 <input type="text" value={formData.company_name} onChange={(e) => setFormData({...formData, company_name: e.target.value})} className="w-full bg-void-black border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-electric-cyan text-sm" placeholder="Enterprise Corp Ltd" />
               </div>
               <div>
                 <label className="block text-xs font-mono text-slate-400 mb-2">CONTACT PERSON *</label>
                 <input type="text" value={formData.contact_name} onChange={(e) => setFormData({...formData, contact_name: e.target.value})} className="w-full bg-void-black border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-electric-cyan text-sm" placeholder="John Doe" />
               </div>
               <div>
                 <label className="block text-xs font-mono text-slate-400 mb-2">EMAIL ADDRESS *</label>
                 <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-void-black border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-electric-cyan text-sm" placeholder="john@enterprise.com" />
               </div>
               <div>
                 <label className="block text-xs font-mono text-slate-400 mb-2">PHONE NUMBER</label>
                 <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-void-black border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-electric-cyan text-sm" placeholder="+1 (555) 000-0000" />
               </div>
             </div>

             <div className="p-6 border-t border-slate-800 bg-void-black/50 flex justify-end gap-4">
               <Button primary={false} onClick={() => setIsModalOpen(false)} className="py-2 text-sm">Cancel</Button>
               <Button onClick={handleSaveClient} disabled={isSaving || !formData.company_name || !formData.email} className="py-2 text-sm flex items-center gap-2">
                 {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Save Client
               </Button>
             </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ClientsPage;
