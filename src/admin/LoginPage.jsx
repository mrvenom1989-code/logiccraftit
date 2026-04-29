import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Loader2, Lock, User } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Button from '../components/Button';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Query the 'users' table
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .single();

      if (error || !data) {
        throw new Error('Invalid credentials');
      }

      // Very simple local session for this specific build
      localStorage.setItem('logiccraft_admin_session', JSON.stringify({
        id: data.id,
        username: data.username,
        timestamp: new Date().getTime()
      }));

      navigate('/admin/inquiries');
    } catch (err) {
      console.error(err);
      setError('Access Denied. Invalid credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-void-black flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(ellipse_at_center,rgba(0,229,255,0.15)_0%,rgba(5,5,10,1)_70%)]"></div>

      <div className="w-full max-w-md bg-[#0A1128] border border-slate-800 rounded-[2rem] p-8 md:p-10 relative z-10 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-void-black border border-slate-700 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
            <Shield className="text-electric-cyan" size={32} />
          </div>
          <h1 className="font-display text-3xl text-ice-white font-bold tracking-tight">Admin Portal</h1>
          <p className="text-slate-500 font-mono text-sm mt-2">SECURE LOGIC CORE</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-lg text-center font-mono">
              {error}
            </div>
          )}

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User size={18} className="text-slate-500" />
            </div>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-void-black border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-electric-cyan transition-colors font-mono text-sm"
              placeholder="USERNAME"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock size={18} className="text-slate-500" />
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-void-black border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-electric-cyan transition-colors font-mono text-sm"
              placeholder="PASSWORD"
            />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full mt-4 flex justify-center">
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Authenticate'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
