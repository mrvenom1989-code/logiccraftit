import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Button from './Button';

const InquiryModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('inquiries')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            project_type: formData.projectType,
            message: formData.message,
            status: 'New'
          }
        ]);
        
      if (error) throw error;
      
      setIsSuccess(true);
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
        setFormData({ name: '', email: '', projectType: '', message: '' });
      }, 3000);
      
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      alert('There was an error submitting your inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-void-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#0A1128] border border-electric-cyan/30 rounded-3xl w-full max-w-lg shadow-[0_0_50px_rgba(0,229,255,0.15)] overflow-hidden relative animate-in fade-in zoom-in-95 duration-300">
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <div className="p-8">
          <h2 className="font-display font-bold text-3xl text-white mb-2">Deploy Your Logic</h2>
          <p className="font-sans text-slate-400 mb-8">Initiate the protocol. Tell us what you need to build.</p>

          {isSuccess ? (
             <div className="flex flex-col items-center justify-center py-12 text-center">
               <div className="w-16 h-16 bg-electric-cyan/10 border border-electric-cyan rounded-full flex items-center justify-center mb-6">
                 <div className="w-8 h-8 bg-electric-cyan rounded-full animate-ping"></div>
               </div>
               <h3 className="font-display text-2xl text-white font-medium mb-2">Transmission Received</h3>
               <p className="text-slate-400">Our engineering team will contact you shortly.</p>
             </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="block text-xs font-mono text-electric-cyan mb-2">IDENTIFICATION [NAME]</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-void-black border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-electric-cyan transition-colors"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-electric-cyan mb-2">CONTACT [EMAIL]</label>
                <input 
                  type="email" 
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-void-black border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-electric-cyan transition-colors"
                  placeholder="john@enterprise.com"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-electric-cyan mb-2">PROTOCOL [TYPE OF REQUEST]</label>
                <input 
                  type="text"
                  required
                  value={formData.projectType}
                  onChange={(e) => setFormData({...formData, projectType: e.target.value})}
                  className="w-full bg-void-black border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-electric-cyan transition-colors"
                  placeholder="e.g., Automation, Web App"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-electric-cyan mb-2">PARAMETERS [DETAILS]</label>
                <textarea 
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-void-black border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-electric-cyan transition-colors resize-none"
                  placeholder="Describe your operational bottleneck or project goals..."
                ></textarea>
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full mt-4 flex justify-center">
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Submit'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default InquiryModal;
