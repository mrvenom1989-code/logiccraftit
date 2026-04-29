import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { FileText, Plus, Download, Loader2, Save, Trash2, X, Edit2 } from 'lucide-react';
import Button from '../components/Button';
import html2pdf from 'html2pdf.js';

const QuotesPage = () => {
  const [quotes, setQuotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const printRef = useRef(null);

  // Form State
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    projectTitle: '',
    issueDate: format(new Date(), 'yyyy-MM-dd'),
    validUntil: format(new Date(new Date().setDate(new Date().getDate() + 14)), 'yyyy-MM-dd'),
    items: [{ description: '', quantity: 1, rate: 0 }],
    notes: 'Quote is valid for 14 days. 50% deposit required to commence work.',
  });

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('quotes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        // If table doesn't exist, this will fail. We handle gracefully.
        console.warn('Quotes fetch error (maybe table missing):', error);
        setQuotes([]);
      } else {
        setQuotes(data || []);
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

  const resetForm = () => {
    setFormData({
      clientName: '', clientEmail: '', projectTitle: '',
      issueDate: format(new Date(), 'yyyy-MM-dd'),
      validUntil: format(new Date(new Date().setDate(new Date().getDate() + 14)), 'yyyy-MM-dd'),
      items: [{ description: '', quantity: 1, rate: 0 }],
      notes: 'Quote is valid for 14 days. 50% deposit required to commence work.',
    });
    setEditingId(null);
  };

  const handleEditQuote = (quote) => {
    setFormData({
      clientName: quote.client_name,
      clientEmail: quote.client_email || '',
      projectTitle: quote.project_title || '',
      issueDate: quote.issue_date,
      validUntil: quote.valid_until,
      items: quote.items || [{ description: '', quantity: 1, rate: 0 }],
      notes: quote.notes || '',
    });
    setEditingId(quote.id);
    setIsModalOpen(true);
  };

  const handleDeleteQuote = async (id) => {
    if (!window.confirm('Are you sure you want to delete this quote?')) return;
    try {
      const { error } = await supabase.from('quotes').delete().eq('id', id);
      if (error) throw error;
      setQuotes(quotes.filter(q => q.id !== id));
    } catch (error) {
      console.error('Error deleting quote:', error);
      alert('Failed to delete quote.');
    }
  };

  const handleSaveQuote = async () => {
    setIsSaving(true);
    try {
      const subtotal = calculateSubtotal();
      const quoteData = {
        client_name: formData.clientName,
        client_email: formData.clientEmail,
        project_title: formData.projectTitle,
        issue_date: formData.issueDate,
        valid_until: formData.validUntil,
        items: formData.items, // JSONB column required
        subtotal: subtotal,
        total: subtotal, // Assuming no tax for simplicity, add later if needed
        notes: formData.notes,
        status: 'Draft'
      };

      if (editingId) {
        const { error } = await supabase
          .from('quotes')
          .update(quoteData)
          .eq('id', editingId);

        if (error) throw error;
        setQuotes(quotes.map(q => q.id === editingId ? { ...quoteData, id: editingId } : q));
      } else {
        const { data, error } = await supabase
          .from('quotes')
          .insert([quoteData])
          .select();

        if (error) throw error;
        setQuotes([data[0], ...quotes]);
      }
      
      setIsModalOpen(false);
      resetForm();

    } catch (error) {
      console.error('Error saving quote:', error);
      alert('Failed to save quote. Ensure "quotes" table exists with correct schema.');
    } finally {
      setIsSaving(false);
    }
  };

  const generatePDF = (quoteData) => {
    const element = document.createElement('div');
    
    // We render a clean, professional, light-themed HTML for the PDF
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
            QUOTE
          </div>
        </div>

        <!-- Separator -->
        <div style="border-top: 2px solid #00E5FF; margin-bottom: 20px;"></div>

        <!-- Meta Data -->
        <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 20px; line-height: 1.6;">
          <div>
            <p style="margin: 0;"><strong>Quote No:</strong> QT-${quoteData.id?.toString().slice(0,6) || Math.floor(Math.random()*10000)}</p>
            <p style="margin: 0;"><strong>Project Title:</strong> ${quoteData.project_title || quoteData.projectTitle}</p>
          </div>
          <div style="text-align: right;">
            <p style="margin: 0;"><strong>Date:</strong> ${quoteData.issue_date || quoteData.issueDate}</p>
            <p style="margin: 0;"><strong>Valid Until:</strong> ${quoteData.valid_until || quoteData.validUntil}</p>
          </div>
        </div>

        <!-- To -->
        <div style="margin-bottom: 30px; font-size: 13px;">
          <p style="margin: 0;"><strong>To:</strong> <span style="font-weight: 600;">${quoteData.client_name || quoteData.clientName}</span></p>
          ${quoteData.client_email ? `<p style="margin: 2px 0 0 0;">${quoteData.client_email || quoteData.clientEmail}</p>` : ''}
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
            ${quoteData.items.map((item, index) => `
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 12px 10px; text-align: center; color: #64748b; border-right: 1px solid #e2e8f0; border-left: 1px solid #e2e8f0;">${index + 1}</td>
                <td style="padding: 12px 10px; color: #1e293b; border-right: 1px solid #e2e8f0;">${item.description}</td>
                <td style="padding: 12px 10px; text-align: center; color: #475569; border-right: 1px solid #e2e8f0;">${item.quantity}</td>
                <td style="padding: 12px 10px; text-align: right; color: #475569; border-right: 1px solid #e2e8f0;">$${parseFloat(item.rate).toFixed(2)}</td>
                <td style="padding: 12px 10px; text-align: right; color: #1e293b; border-right: 1px solid #e2e8f0;">$${(item.quantity * item.rate).toFixed(2)}</td>
              </tr>
            `).join('')}
            <tr style="border-bottom: 1px solid #e2e8f0; background-color: #f8fafc;">
              <td colspan="4" style="padding: 15px 10px; text-align: right; font-weight: bold; border-left: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; color: #0A1128; font-size: 14px;">TOTAL</td>
              <td style="padding: 15px 10px; text-align: right; font-weight: bold; border-right: 1px solid #e2e8f0; color: #0A1128; font-size: 15px;">$${(quoteData.total || calculateSubtotal()).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>

        <!-- Terms and Notes -->
        <div style="font-size: 12px; color: #475569; margin-bottom: 40px; max-width: 60%;">
           <strong style="color: #0A1128;">Notes / Terms:</strong><br/>
           ${quoteData.notes}
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
      </div>
    `;

    const opt = {
      margin:       0,
      filename:     `LogicCraftIT_Quote_${quoteData.client_name.replace(/\s+/g, '_')}.pdf`,
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
          <h1 className="font-display text-3xl font-bold text-white mb-2">Quote Generation</h1>
          <p className="text-slate-400">Create and manage professional IT service proposals.</p>
        </div>
        <Button onClick={() => { resetForm(); setIsModalOpen(true); }} className="px-6 py-2 text-sm flex items-center gap-2">
          <Plus size={16} /> New Quote
        </Button>
      </div>

      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="animate-spin text-electric-cyan" size={40} />
        </div>
      ) : quotes.length === 0 ? (
        <div className="flex-1 border border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-500">
          <FileText size={48} className="mb-4 opacity-50" />
          <p>No quotes generated yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quotes.map(quote => (
            <div key={quote.id} className="bg-[#0A1128] border border-slate-800 rounded-2xl p-6 hover:shadow-[0_0_20px_rgba(0,229,255,0.05)] transition-all">
               <div className="flex justify-between items-start mb-4">
                 <div className="font-mono text-xs text-electric-cyan bg-electric-cyan/10 px-2 py-1 rounded">QT-{quote.id.toString().slice(0,6)}</div>
                 <div className="text-xs text-slate-500 font-mono">{format(new Date(quote.issue_date), 'MMM dd, yyyy')}</div>
               </div>
               <h3 className="font-display text-lg font-bold text-white truncate">{quote.client_name}</h3>
               <p className="text-slate-400 text-sm mb-4 truncate">{quote.project_title}</p>
               
               <div className="flex justify-between items-center border-t border-slate-800 pt-4 mt-2">
                 <div className="font-mono text-lg text-white">${parseFloat(quote.total).toFixed(2)}</div>
                 <div className="flex items-center gap-2">
                   <button 
                     onClick={() => handleEditQuote(quote)}
                     className="text-slate-400 hover:text-electric-cyan transition-colors"
                     title="Edit Quote"
                   >
                     <Edit2 size={18} />
                   </button>
                   <button 
                     onClick={() => handleDeleteQuote(quote.id)}
                     className="text-slate-400 hover:text-red-400 transition-colors"
                     title="Delete Quote"
                   >
                     <Trash2 size={18} />
                   </button>
                   <button 
                     onClick={() => generatePDF(quote)}
                     className="text-slate-400 hover:text-electric-cyan transition-colors ml-1"
                     title="Download PDF"
                   >
                     <Download size={18} />
                   </button>
                 </div>
               </div>
            </div>
          ))}
        </div>
      )}

      {/* Quote Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-void-black/90 backdrop-blur-sm p-4 overflow-y-auto">
           <div className="bg-[#0A1128] border border-slate-800 rounded-2xl w-full max-w-4xl my-8 overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
             
             <div className="flex justify-between items-center p-6 border-b border-slate-800 bg-void-black/50">
               <h2 className="font-display text-xl font-bold text-white flex items-center gap-2">
                 <FileText className="text-electric-cyan" size={20} /> {editingId ? 'Edit Quote' : 'Build Quote'}
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
                     <label className="block text-xs font-mono text-slate-400 mb-2">VALID UNTIL</label>
                     <input type="date" value={formData.validUntil} onChange={(e) => setFormData({...formData, validUntil: e.target.value})} className="w-full bg-void-black border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-electric-cyan text-sm" />
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
                      <span>Total</span>
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
                 <FileText size={16} /> Preview PDF
               </button>
               <div className="flex gap-4">
                 <Button primary={false} onClick={() => { setIsModalOpen(false); resetForm(); }} className="py-2 text-sm">Cancel</Button>
                 <Button onClick={handleSaveQuote} disabled={isSaving} className="py-2 text-sm flex items-center gap-2">
                   {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} {editingId ? 'Update Quote' : 'Save Quote'}
                 </Button>
               </div>
             </div>

           </div>
        </div>
      )}

    </div>
  );
};

export default QuotesPage;
