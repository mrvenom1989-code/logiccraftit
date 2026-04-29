import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { FileSpreadsheet, Plus, Download, Loader2, Save, Trash2, X, Edit2 } from 'lucide-react';
import Button from '../components/Button';
import html2pdf from 'html2pdf.js';

const InvoicesPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    projectTitle: '',
    issueDate: format(new Date(), 'yyyy-MM-dd'),
    dueDate: format(new Date(new Date().setDate(new Date().getDate() + 30)), 'yyyy-MM-dd'),
    items: [{ description: '', quantity: 1, rate: 0 }],
    notes: 'Please make payment within 30 days. Thank you for your business.',
    status: 'Unpaid'
  });

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Invoices fetch error (maybe table missing):', error);
        setInvoices([]);
      } else {
        setInvoices(data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: '', quantity: 1, rate: 0 }]
    });
  };

  const handleRemoveItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData({ ...formData, items: newItems });
  };

  const calculateSubtotal = () => {
    return formData.items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const { error } = await supabase
        .from('invoices')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      
      setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status: newStatus } : inv));
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status.');
    }
  };

  const resetForm = () => {
    setFormData({
      clientName: '', clientEmail: '', projectTitle: '',
      issueDate: format(new Date(), 'yyyy-MM-dd'),
      dueDate: format(new Date(new Date().setDate(new Date().getDate() + 30)), 'yyyy-MM-dd'),
      items: [{ description: '', quantity: 1, rate: 0 }],
      notes: 'Please make payment within 30 days. Thank you for your business.',
      status: 'Unpaid'
    });
    setEditingId(null);
  };

  const handleEditInvoice = (invoice) => {
    setFormData({
      clientName: invoice.client_name,
      clientEmail: invoice.client_email || '',
      projectTitle: invoice.project_title || '',
      issueDate: invoice.issue_date,
      dueDate: invoice.due_date,
      items: invoice.items || [{ description: '', quantity: 1, rate: 0 }],
      notes: invoice.notes || '',
      status: invoice.status || 'Unpaid'
    });
    setEditingId(invoice.id);
    setIsModalOpen(true);
  };

  const handleDeleteInvoice = async (id) => {
    if (!window.confirm('Are you sure you want to delete this invoice?')) return;
    try {
      const { error } = await supabase.from('invoices').delete().eq('id', id);
      if (error) throw error;
      setInvoices(invoices.filter(i => i.id !== id));
    } catch (error) {
      console.error('Error deleting invoice:', error);
      alert('Failed to delete invoice.');
    }
  };

  const handleSaveInvoice = async () => {
    setIsSaving(true);
    try {
      const subtotal = calculateSubtotal();
      const invoiceData = {
        client_name: formData.clientName,
        client_email: formData.clientEmail,
        project_title: formData.projectTitle,
        issue_date: formData.issueDate,
        due_date: formData.dueDate,
        items: formData.items, // JSONB column required
        subtotal: subtotal,
        total: subtotal, 
        notes: formData.notes,
        status: formData.status
      };

      if (editingId) {
        const { error } = await supabase
          .from('invoices')
          .update(invoiceData)
          .eq('id', editingId);

        if (error) throw error;
        setInvoices(invoices.map(inv => inv.id === editingId ? { ...invoiceData, id: editingId } : inv));
      } else {
        const { data, error } = await supabase
          .from('invoices')
          .insert([invoiceData])
          .select();

        if (error) throw error;
        setInvoices([data[0], ...invoices]);
      }
      
      setIsModalOpen(false);
      resetForm();

    } catch (error) {
      console.error('Error saving invoice:', error);
      alert('Failed to save invoice. Ensure "invoices" table exists with correct schema.');
    } finally {
      setIsSaving(false);
    }
  };

  const generatePDF = (invoiceData) => {
    const element = document.createElement('div');
    
    element.innerHTML = `
      <div style="padding: 40px; font-family: 'Inter', sans-serif; color: #0A1128; max-width: 800px; margin: 0 auto; background: white; min-height: 1020px; position: relative;">
        
        <!-- Header -->
        <div style="display: flex; align-items: center; padding-bottom: 15px;">
          <div style="width: 120px;">
            <img src="/logiccraftitlogo1.png" style="width: 90px; height: 90px; object-fit: contain;" />
          </div>
          <div style="flex: 1; text-align: center;">
            <h1 style="font-size: 32px; font-weight: bold; margin: 0; color: #0A1128; font-family: 'Space Grotesk', sans-serif;">LOGIC CRAFT <span style="color: #00E5FF;">IT</span></h1>
            <p style="font-size: 13px; font-weight: 600; margin: 8px 0 0 0; color: #64748b; letter-spacing: 2px;">INNOVATE. INTEGRATE. EXCEL.</p>
          </div>
          <div style="width: 120px; text-align: right; font-family: 'Space Grotesk', sans-serif; font-size: 24px; font-weight: bold; color: #e2e8f0; letter-spacing: 2px;">
            INVOICE
          </div>
        </div>

        <!-- Separator -->
        <div style="border-top: 2px solid #00E5FF; margin-bottom: 20px;"></div>

        <!-- Meta Data -->
        <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 20px; line-height: 1.6;">
          <div>
            <p style="margin: 0;"><strong>Invoice No:</strong> INV-${invoiceData.id?.toString().slice(0,6) || Math.floor(Math.random()*10000)}</p>
            <p style="margin: 0;"><strong>Project Title:</strong> ${invoiceData.project_title || invoiceData.projectTitle}</p>
          </div>
          <div style="text-align: right;">
            <p style="margin: 0;"><strong>Date:</strong> ${invoiceData.issue_date || invoiceData.issueDate}</p>
            <p style="margin: 0;"><strong>Due Date:</strong> ${invoiceData.due_date || invoiceData.dueDate}</p>
          </div>
        </div>

        <!-- To -->
        <div style="margin-bottom: 30px; font-size: 13px;">
          <p style="margin: 0;"><strong>To:</strong> <span style="font-weight: 600;">${invoiceData.client_name || invoiceData.clientName}</span></p>
          ${invoiceData.client_email ? `<p style="margin: 2px 0 0 0;">${invoiceData.client_email || invoiceData.clientEmail}</p>` : ''}
        </div>

        <!-- Table -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 40px; font-size: 13px;">
          <thead>
            <tr style="background-color: #0A1128; color: white;">
              <th style="padding: 10px; text-align: center; width: 50px; font-weight: 600;">NO</th>
              <th style="padding: 10px; text-align: left; font-weight: 600;">DESCRIPTION</th>
              <th style="padding: 10px; text-align: center; width: 80px; font-weight: 600;">QTY</th>
              <th style="padding: 10px; text-align: right; width: 100px; font-weight: 600;">RATE</th>
              <th style="padding: 10px; text-align: right; width: 120px; font-weight: 600;">AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            ${invoiceData.items.map((item, index) => `
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 12px 10px; text-align: center; color: #64748b; border-right: 1px solid #e2e8f0; border-left: 1px solid #e2e8f0;">${index + 1}</td>
                <td style="padding: 12px 10px; color: #1e293b; border-right: 1px solid #e2e8f0;">${item.description}</td>
                <td style="padding: 12px 10px; text-align: center; color: #475569; border-right: 1px solid #e2e8f0;">${item.quantity}</td>
                <td style="padding: 12px 10px; text-align: right; color: #475569; border-right: 1px solid #e2e8f0;">$${parseFloat(item.rate).toFixed(2)}</td>
                <td style="padding: 12px 10px; text-align: right; color: #1e293b; border-right: 1px solid #e2e8f0;">$${(item.quantity * item.rate).toFixed(2)}</td>
              </tr>
            `).join('')}
            <tr style="border-bottom: 1px solid #e2e8f0; background-color: #f8fafc;">
              <td colspan="4" style="padding: 15px 10px; text-align: right; font-weight: bold; border-left: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; color: ${invoiceData.status === 'Paid' ? '#10b981' : '#0A1128'}; font-size: 14px;">
                ${invoiceData.status === 'Paid' ? 'TOTAL (PAID)' : 'TOTAL DUE'}
              </td>
              <td style="padding: 15px 10px; text-align: right; font-weight: bold; border-right: 1px solid #e2e8f0; color: ${invoiceData.status === 'Paid' ? '#10b981' : '#0A1128'}; font-size: 15px;">
                $${(invoiceData.total || calculateSubtotal()).toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Terms and Notes -->
        <div style="font-size: 12px; color: #475569; margin-bottom: 40px; max-width: 60%;">
           <strong style="color: #0A1128;">Notes / Terms:</strong><br/>
           ${invoiceData.notes}
        </div>

        <!-- Authorized Signatory -->
        <div style="display: flex; justify-content: flex-end; text-align: right;">
          <div>
            <p style="font-weight: bold; font-size: 14px; margin: 0 0 60px 0; color: #0A1128;">For Logic Craft IT</p>
            <div style="border-bottom: 1px solid #cbd5e1; width: 150px; margin-left: auto; margin-bottom: 5px;"></div>
            <p style="font-size: 11px; color: #64748b; margin: 0;">(Authorized Signatory)</p>
          </div>
        </div>

        <!-- Footer -->
        <div style="position: absolute; bottom: 40px; left: 0; right: 0; text-align: center; font-size: 11px;">
          <p style="font-weight: bold; font-size: 12px; margin: 0 0 5px 0; color: #0A1128;">For Inquiries: logiccraftit@gmail.com</p>
          <p style="margin: 0; color: #475569;">Logic Craft IT, Global Digital Operations</p>
          <p style="margin: 5px 0 0 0;"><a href="https://logiccraftit.com" style="color: #0A1128; text-decoration: none;">www.logiccraftit.com</a></p>
        </div>

        ${invoiceData.status === 'Paid' ? `
          <!-- Paid Watermark Stamp -->
          <div style="position: absolute; top: 45%; left: 50%; transform: translate(-50%, -50%) rotate(-15deg); border: 8px solid #10b981; color: #10b981; padding: 20px 60px; font-size: 80px; font-weight: bold; letter-spacing: 15px; border-radius: 20px; opacity: 0.15; pointer-events: none; z-index: 0;">
            PAID
          </div>
        ` : ''}
      </div>
    `;

    const opt = {
      margin:       0,
      filename:     `LogicCraftIT_Invoice_${invoiceData.client_name.replace(/\s+/g, '_')}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-white mb-2">Invoice Generation</h1>
          <p className="text-slate-400">Create, manage, and track professional IT invoices.</p>
        </div>
        <Button onClick={() => { resetForm(); setIsModalOpen(true); }} className="px-6 py-2 text-sm flex items-center gap-2">
          <Plus size={16} /> New Invoice
        </Button>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="animate-spin text-electric-cyan" size={40} />
        </div>
      ) : invoices.length === 0 ? (
        <div className="flex-1 border border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-500">
          <FileSpreadsheet size={48} className="mb-4 opacity-50" />
          <p>No invoices generated yet.</p>
        </div>
      ) : (
        <div className="bg-[#0A1128] border border-slate-800 rounded-[2rem] overflow-hidden shadow-2xl flex-1 flex flex-col">
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-void-black/50 border-b border-slate-800 text-xs font-mono text-slate-500 uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium">Invoice #</th>
                  <th className="px-6 py-4 font-medium">Client / Project</th>
                  <th className="px-6 py-4 font-medium">Amount</th>
                  <th className="px-6 py-4 font-medium">Dates</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-sm">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-5 align-middle">
                      <div className="font-mono text-electric-cyan bg-electric-cyan/10 px-2 py-1 rounded inline-block">INV-{inv.id.toString().slice(0,6)}</div>
                    </td>
                    <td className="px-6 py-5 align-middle">
                      <div className="font-medium text-white">{inv.client_name}</div>
                      <div className="text-slate-500 text-xs truncate max-w-[200px]">{inv.project_title}</div>
                    </td>
                    <td className="px-6 py-5 align-middle font-mono text-white">
                      ${parseFloat(inv.total).toFixed(2)}
                    </td>
                    <td className="px-6 py-5 align-middle text-xs text-slate-400">
                      <div>Issued: {format(new Date(inv.issue_date), 'MMM dd')}</div>
                      <div className="text-slate-500 mt-1">Due: {format(new Date(inv.due_date), 'MMM dd')}</div>
                    </td>
                    <td className="px-6 py-5 align-middle">
                      <select
                        value={inv.status || 'Unpaid'}
                        onChange={(e) => updateStatus(inv.id, e.target.value)}
                        className={`bg-void-black border text-xs font-mono rounded px-3 py-1.5 focus:outline-none transition-colors ${
                          inv.status === 'Paid' ? 'border-green-500/50 text-green-500' :
                          inv.status === 'Overdue' ? 'border-red-500/50 text-red-500' :
                          'border-yellow-500/50 text-yellow-500'
                        }`}
                      >
                        <option value="Unpaid">UNPAID</option>
                        <option value="Paid">PAID</option>
                        <option value="Overdue">OVERDUE</option>
                        <option value="Cancelled">CANCELLED</option>
                      </select>
                    </td>
                    <td className="px-6 py-5 align-middle text-right">
                       <div className="flex items-center justify-end gap-2">
                         <button 
                           onClick={() => handleEditInvoice(inv)}
                           className="text-slate-400 hover:text-electric-cyan transition-colors"
                           title="Edit Invoice"
                         >
                           <Edit2 size={18} />
                         </button>
                         <button 
                           onClick={() => handleDeleteInvoice(inv.id)}
                           className="text-slate-400 hover:text-red-400 transition-colors"
                           title="Delete Invoice"
                         >
                           <Trash2 size={18} />
                         </button>
                         <button 
                           onClick={() => generatePDF(inv)}
                           className="text-slate-400 hover:text-electric-cyan transition-colors ml-1"
                           title="Download PDF"
                         >
                           <Download size={18} />
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

      {/* Invoice Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-void-black/90 backdrop-blur-sm p-4 overflow-y-auto">
           <div className="bg-[#0A1128] border border-slate-800 rounded-2xl w-full max-w-4xl my-8 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
             
             <div className="flex justify-between items-center p-6 border-b border-slate-800 bg-void-black/50">
               <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
                 <FileSpreadsheet className="text-electric-cyan" size={20} /> {editingId ? 'Edit Invoice' : 'Build Invoice'}
               </h2>
               <button onClick={() => { setIsModalOpen(false); resetForm(); }} className="text-slate-400 hover:text-white transition-colors">
                 <X size={24} />
               </button>
             </div>

             <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                   <div>
                     <label className="block text-xs font-mono text-slate-400 mb-2">CLIENT NAME</label>
                     <input type="text" value={formData.clientName} onChange={(e) => setFormData({...formData, clientName: e.target.value})} className="w-full bg-void-black border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-electric-cyan text-sm" placeholder="Enterprise Corp" />
                   </div>
                   <div>
                     <label className="block text-xs font-mono text-slate-400 mb-2">CLIENT EMAIL</label>
                     <input type="email" value={formData.clientEmail} onChange={(e) => setFormData({...formData, clientEmail: e.target.value})} className="w-full bg-void-black border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-electric-cyan text-sm" placeholder="contact@enterprise.com" />
                   </div>
                   <div className="md:col-span-2">
                     <label className="block text-xs font-mono text-slate-400 mb-2">PROJECT TITLE</label>
                     <input type="text" value={formData.projectTitle} onChange={(e) => setFormData({...formData, projectTitle: e.target.value})} className="w-full bg-void-black border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-electric-cyan text-sm" placeholder="Custom ERP Development Phase 1" />
                   </div>
                   <div>
                     <label className="block text-xs font-mono text-slate-400 mb-2">ISSUE DATE</label>
                     <input type="date" value={formData.issueDate} onChange={(e) => setFormData({...formData, issueDate: e.target.value})} className="w-full bg-void-black border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-electric-cyan text-sm" />
                   </div>
                   <div>
                     <label className="block text-xs font-mono text-slate-400 mb-2">DUE DATE</label>
                     <input type="date" value={formData.dueDate} onChange={(e) => setFormData({...formData, dueDate: e.target.value})} className="w-full bg-void-black border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-electric-cyan text-sm" />
                   </div>
                </div>

                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-mono text-sm text-electric-cyan">LINE ITEMS</h3>
                  </div>
                  
                  <div className="bg-void-black border border-slate-800 rounded-xl overflow-hidden">
                     <table className="w-full text-left text-sm">
                       <thead className="bg-slate-900/50 text-slate-400 text-xs font-mono border-b border-slate-800">
                         <tr>
                           <th className="p-3 font-normal">Description</th>
                           <th className="p-3 font-normal w-24">Qty/Hrs</th>
                           <th className="p-3 font-normal w-32">Rate ($)</th>
                           <th className="p-3 font-normal w-32 text-right">Amount</th>
                           <th className="p-3 font-normal w-12"></th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-800">
                         {formData.items.map((item, index) => (
                           <tr key={index}>
                             <td className="p-2">
                               <input type="text" value={item.description} onChange={(e) => handleItemChange(index, 'description', e.target.value)} className="w-full bg-transparent border-none text-white focus:outline-none focus:ring-1 focus:ring-electric-cyan/50 rounded px-2 py-1 placeholder-slate-600" placeholder="e.g. Backend Architecture Setup" />
                             </td>
                             <td className="p-2">
                               <input type="number" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)} className="w-full bg-transparent border-none text-white focus:outline-none focus:ring-1 focus:ring-electric-cyan/50 rounded px-2 py-1 text-center" min="1" />
                             </td>
                             <td className="p-2">
                               <input type="number" value={item.rate} onChange={(e) => handleItemChange(index, 'rate', parseFloat(e.target.value) || 0)} className="w-full bg-transparent border-none text-white focus:outline-none focus:ring-1 focus:ring-electric-cyan/50 rounded px-2 py-1" />
                             </td>
                             <td className="p-2 text-right font-mono text-slate-300">
                               ${(item.quantity * item.rate).toFixed(2)}
                             </td>
                             <td className="p-2 text-center">
                               {formData.items.length > 1 && (
                                 <button onClick={() => handleRemoveItem(index)} className="text-slate-500 hover:text-red-400 transition-colors">
                                   <Trash2 size={16} />
                                 </button>
                               )}
                             </td>
                           </tr>
                         ))}
                       </tbody>
                     </table>
                     <div className="p-2 border-t border-slate-800 bg-slate-900/20">
                       <button onClick={handleAddItem} className="text-xs font-mono text-electric-cyan hover:text-white flex items-center gap-1 p-2 transition-colors">
                         <Plus size={14} /> ADD ITEM
                       </button>
                     </div>
                  </div>
                </div>

                <div className="flex justify-end mb-8">
                  <div className="w-64 bg-void-black border border-slate-800 rounded-xl p-4">
                    <div className="flex justify-between items-center text-sm mb-2 text-slate-400">
                      <span>Subtotal</span>
                      <span className="font-mono">${calculateSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-bold text-white pt-2 border-t border-slate-800">
                      <span>Total Due</span>
                      <span className="font-mono text-electric-cyan">${calculateSubtotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div>
                   <label className="block text-xs font-mono text-slate-400 mb-2">TERMS & NOTES</label>
                   <textarea value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} className="w-full bg-void-black border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-electric-cyan text-sm resize-none" rows={3}></textarea>
                </div>
             </div>

             <div className="p-6 border-t border-slate-800 bg-void-black/50 flex justify-between items-center">
               <button 
                 onClick={() => generatePDF({ ...formData, id: 'PREVIEW' })} 
                 className="text-slate-400 hover:text-white font-mono text-sm flex items-center gap-2 transition-colors"
               >
                 <FileSpreadsheet size={16} /> Preview PDF
               </button>
               <div className="flex gap-4">
                 <Button primary={false} onClick={() => { setIsModalOpen(false); resetForm(); }} className="py-2 text-sm">Cancel</Button>
                 <Button onClick={handleSaveInvoice} disabled={isSaving} className="py-2 text-sm flex items-center gap-2">
                   {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} {editingId ? 'Update Invoice' : 'Save Invoice'}
                 </Button>
               </div>
             </div>

           </div>
        </div>
      )}

    </div>
  );
};

export default InvoicesPage;
