import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Building, Mail, Phone, Server, CreditCard, Plus, ArrowLeft, Loader2, Calendar, FileText, X, Save, Trash2, Edit3 } from 'lucide-react';
import Button from '../components/Button';
import { format } from 'date-fns';

const ClientDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [projects, setProjects] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modals state
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [isEditClientModalOpen, setIsEditClientModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editClientForm, setEditClientForm] = useState(null);

  const [projectForm, setProjectForm] = useState({ name: '', type: 'Automation', status: 'Development' });
  const [contractForm, setContractForm] = useState({ project_id: '', charge_type: 'Maintenance', billing_cycle: 'Monthly', amount: '', next_billing_date: format(new Date(), 'yyyy-MM-dd'), status: 'Active' });

  useEffect(() => {
    fetchClientData();
  }, [id]);

  const fetchClientData = async () => {
    setIsLoading(true);
    try {
      // Fetch Client
      const { data: clientData, error: clientErr } = await supabase.from('clients').select('*').eq('id', id).single();
      if (clientErr) throw clientErr;
      setClient(clientData);

      // Fetch Projects
      const { data: projData, error: projErr } = await supabase.from('projects').select('*').eq('client_id', id).order('created_at', { ascending: false });
      if (!projErr) setProjects(projData || []);

      // Fetch Contracts
      // We need contracts for this client's projects. We can fetch them by project_id in projData.
      if (projData && projData.length > 0) {
        const projectIds = projData.map(p => p.id);
        const { data: conData, error: conErr } = await supabase.from('billing_contracts').select('*').in('project_id', projectIds).order('next_billing_date', { ascending: true });
        if (!conErr) setContracts(conData || []);
      }
    } catch (err) {
      console.error('Error fetching client data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProject = async () => {
    setIsSaving(true);
    try {
      const { data, error } = await supabase.from('projects').insert([{ ...projectForm, client_id: id }]).select();
      if (error) throw error;
      setProjects([data[0], ...projects]);
      setIsProjectModalOpen(false);
      setProjectForm({ name: '', type: 'Automation', status: 'Development' });
    } catch (err) {
      alert('Failed to save project. Ensure table exists.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveContract = async () => {
    setIsSaving(true);
    try {
      const { data, error } = await supabase.from('billing_contracts').insert([contractForm]).select();
      if (error) throw error;
      setContracts([...contracts, data[0]].sort((a,b) => new Date(a.next_billing_date) - new Date(b.next_billing_date)));
      setIsContractModalOpen(false);
      setContractForm({ project_id: '', charge_type: 'Maintenance', billing_cycle: 'Monthly', amount: '', next_billing_date: format(new Date(), 'yyyy-MM-dd'), status: 'Active' });
    } catch (err) {
      alert('Failed to save contract. Ensure table exists.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateClient = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase.from('clients').update(editClientForm).eq('id', id);
      if (error) throw error;
      setClient(editClientForm);
      setIsEditClientModalOpen(false);
    } catch (err) {
      alert('Failed to update client.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClient = async () => {
    if (!window.confirm('Are you sure you want to delete this client? This will delete all associated projects and contracts.')) return;
    try {
      const { error } = await supabase.from('clients').delete().eq('id', id);
      if (error) throw error;
      navigate('/admin/clients');
    } catch (err) {
      alert('Failed to delete client.');
    }
  };

  if (isLoading) {
    return <div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-electric-cyan" size={40} /></div>;
  }

  if (!client) {
    return <div className="h-full flex flex-col items-center justify-center text-slate-500">Client not found.</div>;
  }

  return (
    <div className="flex flex-col h-full relative space-y-8">
      {/* Header */}
      <div>
        <Link to="/admin/clients" className="text-slate-500 hover:text-white flex items-center gap-1 text-sm mb-4 transition-colors">
          <ArrowLeft size={16} /> Back to Clients
        </Link>
        <div className="flex justify-between items-end">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-void-black border border-slate-700 flex items-center justify-center text-electric-cyan font-bold text-3xl">
              {client.company_name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold text-white mb-1 flex items-center gap-3">
                {client.company_name}
                <span className={`text-xs px-2 py-0.5 rounded font-mono border ${client.status === 'Active' ? 'bg-electric-cyan/10 text-electric-cyan border-electric-cyan/30' : 'bg-slate-800 text-slate-400 border-slate-700'}`}>
                  {client.status.toUpperCase()}
                </span>
              </h1>
              <div className="flex items-center gap-4 text-sm text-slate-400">
                <span className="flex items-center gap-1"><Building size={14} /> {client.contact_name}</span>
                <span className="flex items-center gap-1"><Mail size={14} /> {client.email}</span>
                {client.phone && <span className="flex items-center gap-1"><Phone size={14} /> {client.phone}</span>}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={() => { setEditClientForm(client); setIsEditClientModalOpen(true); }} primary={false} className="py-2 text-sm flex items-center gap-2 border-slate-700 hover:border-electric-cyan/50 text-slate-300">
              <Edit3 size={16} /> Edit
            </Button>
            <Button onClick={handleDeleteClient} primary={false} className="py-2 text-sm flex items-center gap-2 border-red-900/50 hover:bg-red-500/10 text-red-400 hover:text-red-300 transition-colors">
              <Trash2 size={16} /> Delete
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Projects Column */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
             <h2 className="font-display text-xl font-bold text-white flex items-center gap-2"><Server size={20} className="text-slate-400" /> Active Projects</h2>
             <Button onClick={() => setIsProjectModalOpen(true)} className="py-1.5 px-4 text-xs flex items-center gap-2"><Plus size={14}/> New Project</Button>
          </div>
          
          {projects.length === 0 ? (
            <div className="border border-dashed border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center text-slate-500 bg-void-black/30">
              <Server size={32} className="mb-2 opacity-50" />
              <p className="text-sm">No projects assigned to this client yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map(project => (
                <div key={project.id} className="bg-[#0A1128] border border-slate-800 p-5 rounded-xl">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">{project.type}</span>
                    <span className={`text-xs font-bold ${project.status === 'Completed' ? 'text-green-500' : 'text-yellow-500'}`}>{project.status}</span>
                  </div>
                  <h3 className="font-display font-bold text-white text-lg">{project.name}</h3>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Billing Contracts Column */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
             <h2 className="font-display text-xl font-bold text-white flex items-center gap-2"><CreditCard size={20} className="text-electric-cyan" /> Billing Contracts</h2>
             <Button onClick={() => setIsContractModalOpen(true)} className="py-1.5 px-4 text-xs flex items-center gap-2" disabled={projects.length === 0}><Plus size={14}/> Add Contract</Button>
          </div>

          {contracts.length === 0 ? (
            <div className="border border-dashed border-slate-800 rounded-2xl p-8 flex flex-col items-center justify-center text-slate-500 bg-void-black/30 text-center">
              <CreditCard size={32} className="mb-2 opacity-50" />
              <p className="text-sm">No billing contracts found. Add a project first to attach a contract.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {contracts.map(contract => {
                const project = projects.find(p => p.id === contract.project_id);
                return (
                  <div key={contract.id} className="bg-void-black border border-slate-700 p-4 rounded-xl border-l-4 border-l-electric-cyan">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded mr-2">{contract.charge_type}</span>
                        <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">{contract.billing_cycle}</span>
                      </div>
                      <span className="text-sm font-bold text-white font-mono">${parseFloat(contract.amount).toFixed(2)}</span>
                    </div>
                    <p className="text-sm text-slate-300 font-medium mb-2 truncate">{project?.name}</p>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-2 border-t border-slate-800 pt-2">
                       <Calendar size={12} /> Next Due: <span className="text-electric-cyan font-medium">{format(new Date(contract.next_billing_date), 'MMM dd, yyyy')}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Project Modal */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-void-black/90 backdrop-blur-sm p-4">
           <div className="bg-[#0A1128] border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
             <div className="p-6 border-b border-slate-800 bg-void-black/50 flex justify-between items-center">
               <h2 className="font-display font-bold text-white">Create Project</h2>
               <button onClick={() => setIsProjectModalOpen(false)} className="text-slate-400 hover:text-white"><X size={20}/></button>
             </div>
             <div className="p-6 space-y-4">
               <div>
                 <label className="block text-xs font-mono text-slate-400 mb-2">PROJECT NAME</label>
                 <input type="text" value={projectForm.name} onChange={(e) => setProjectForm({...projectForm, name: e.target.value})} className="w-full bg-void-black border border-slate-700 rounded-lg px-4 py-3 text-white text-sm" placeholder="e.g. ERP System Phase 1" />
               </div>
               <div>
                 <label className="block text-xs font-mono text-slate-400 mb-2">PROJECT TYPE</label>
                 <select value={projectForm.type} onChange={(e) => setProjectForm({...projectForm, type: e.target.value})} className="w-full bg-void-black border border-slate-700 rounded-lg px-4 py-3 text-white text-sm">
                   <option>Automation</option>
                   <option>Custom Software</option>
                   <option>IT Infrastructure</option>
                 </select>
               </div>
               <div>
                 <label className="block text-xs font-mono text-slate-400 mb-2">STATUS</label>
                 <select value={projectForm.status} onChange={(e) => setProjectForm({...projectForm, status: e.target.value})} className="w-full bg-void-black border border-slate-700 rounded-lg px-4 py-3 text-white text-sm">
                   <option>Development</option>
                   <option>Maintenance</option>
                   <option>Completed</option>
                 </select>
               </div>
             </div>
             <div className="p-6 border-t border-slate-800 bg-void-black/50 flex justify-end gap-3">
               <Button primary={false} onClick={() => setIsProjectModalOpen(false)} className="py-2">Cancel</Button>
               <Button onClick={handleSaveProject} disabled={isSaving || !projectForm.name} className="py-2 flex items-center gap-2">
                 {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Save Project
               </Button>
             </div>
           </div>
        </div>
      )}

      {/* Contract Modal */}
      {isContractModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-void-black/90 backdrop-blur-sm p-4">
           <div className="bg-[#0A1128] border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
             <div className="p-6 border-b border-slate-800 bg-void-black/50 flex justify-between items-center">
               <h2 className="font-display font-bold text-white">Create Billing Contract</h2>
               <button onClick={() => setIsContractModalOpen(false)} className="text-slate-400 hover:text-white"><X size={20}/></button>
             </div>
             <div className="p-6 space-y-4">
               <div>
                 <label className="block text-xs font-mono text-slate-400 mb-2">LINK TO PROJECT</label>
                 <select value={contractForm.project_id} onChange={(e) => setContractForm({...contractForm, project_id: e.target.value})} className="w-full bg-void-black border border-slate-700 rounded-lg px-4 py-3 text-white text-sm">
                   <option value="">-- Select Project --</option>
                   {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                 </select>
               </div>
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <label className="block text-xs font-mono text-slate-400 mb-2">CHARGE TYPE</label>
                   <select value={contractForm.charge_type} onChange={(e) => setContractForm({...contractForm, charge_type: e.target.value})} className="w-full bg-void-black border border-slate-700 rounded-lg px-4 py-3 text-white text-sm">
                     <option>Implementation</option>
                     <option>Maintenance</option>
                   </select>
                 </div>
                 <div>
                   <label className="block text-xs font-mono text-slate-400 mb-2">BILLING CYCLE</label>
                   <select value={contractForm.billing_cycle} onChange={(e) => setContractForm({...contractForm, billing_cycle: e.target.value})} className="w-full bg-void-black border border-slate-700 rounded-lg px-4 py-3 text-white text-sm">
                     <option>One-Time</option>
                     <option>Monthly</option>
                     <option>Quarterly</option>
                     <option>Bi-Annually</option>
                     <option>Annually</option>
                   </select>
                 </div>
               </div>
               <div>
                 <label className="block text-xs font-mono text-slate-400 mb-2">AMOUNT ($)</label>
                 <input type="number" value={contractForm.amount} onChange={(e) => setContractForm({...contractForm, amount: e.target.value})} className="w-full bg-void-black border border-slate-700 rounded-lg px-4 py-3 text-white text-sm font-mono" placeholder="1000.00" />
               </div>
               <div>
                 <label className="block text-xs font-mono text-slate-400 mb-2">NEXT BILLING DATE</label>
                 <input type="date" value={contractForm.next_billing_date} onChange={(e) => setContractForm({...contractForm, next_billing_date: e.target.value})} className="w-full bg-void-black border border-slate-700 rounded-lg px-4 py-3 text-white text-sm" />
               </div>
             </div>
             <div className="p-6 border-t border-slate-800 bg-void-black/50 flex justify-end gap-3">
               <Button primary={false} onClick={() => setIsContractModalOpen(false)} className="py-2">Cancel</Button>
               <Button onClick={handleSaveContract} disabled={isSaving || !contractForm.project_id || !contractForm.amount} className="py-2 flex items-center gap-2">
                 {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Save Contract
               </Button>
             </div>
           </div>
        </div>
      )}
      {/* Edit Client Modal */}
      {isEditClientModalOpen && editClientForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-void-black/90 backdrop-blur-sm p-4">
           <div className="bg-[#0A1128] border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
             <div className="p-6 border-b border-slate-800 bg-void-black/50 flex justify-between items-center">
               <h2 className="font-display font-bold text-white">Edit Client Profile</h2>
               <button onClick={() => setIsEditClientModalOpen(false)} className="text-slate-400 hover:text-white"><X size={20}/></button>
             </div>
             <div className="p-6 space-y-4">
               <div>
                 <label className="block text-xs font-mono text-slate-400 mb-2">COMPANY NAME *</label>
                 <input type="text" value={editClientForm.company_name} onChange={(e) => setEditClientForm({...editClientForm, company_name: e.target.value})} className="w-full bg-void-black border border-slate-700 rounded-lg px-4 py-3 text-white text-sm" />
               </div>
               <div>
                 <label className="block text-xs font-mono text-slate-400 mb-2">CONTACT PERSON *</label>
                 <input type="text" value={editClientForm.contact_name} onChange={(e) => setEditClientForm({...editClientForm, contact_name: e.target.value})} className="w-full bg-void-black border border-slate-700 rounded-lg px-4 py-3 text-white text-sm" />
               </div>
               <div>
                 <label className="block text-xs font-mono text-slate-400 mb-2">EMAIL ADDRESS *</label>
                 <input type="email" value={editClientForm.email} onChange={(e) => setEditClientForm({...editClientForm, email: e.target.value})} className="w-full bg-void-black border border-slate-700 rounded-lg px-4 py-3 text-white text-sm" />
               </div>
               <div>
                 <label className="block text-xs font-mono text-slate-400 mb-2">PHONE NUMBER</label>
                 <input type="text" value={editClientForm.phone || ''} onChange={(e) => setEditClientForm({...editClientForm, phone: e.target.value})} className="w-full bg-void-black border border-slate-700 rounded-lg px-4 py-3 text-white text-sm" />
               </div>
               <div>
                 <label className="block text-xs font-mono text-slate-400 mb-2">STATUS</label>
                 <select value={editClientForm.status} onChange={(e) => setEditClientForm({...editClientForm, status: e.target.value})} className="w-full bg-void-black border border-slate-700 rounded-lg px-4 py-3 text-white text-sm">
                   <option>Active</option>
                   <option>Inactive</option>
                 </select>
               </div>
             </div>
             <div className="p-6 border-t border-slate-800 bg-void-black/50 flex justify-end gap-3">
               <Button primary={false} onClick={() => setIsEditClientModalOpen(false)} className="py-2">Cancel</Button>
               <Button onClick={handleUpdateClient} disabled={isSaving || !editClientForm.company_name || !editClientForm.email} className="py-2 flex items-center gap-2">
                 {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Save Changes
               </Button>
             </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ClientDetailPage;
