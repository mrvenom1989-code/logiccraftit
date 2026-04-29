import React from 'react';

const Button = ({ children, className = '', primary = true, ...props }) => {
  return (
    <button 
      className={`relative group overflow-hidden ${primary ? 'bg-deep-navy border border-electric-cyan/30' : 'bg-transparent border border-slate-700'} px-8 py-3 rounded-full text-ice-white font-sans font-medium magnetic-btn ${className}`}
      {...props}
    >
      <span className={`absolute inset-0 ${primary ? 'bg-electric-cyan' : 'bg-white'} translate-y-[101%] group-hover:translate-y-0 transition-transform duration-400 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] z-0`}></span>
      <span className="relative z-10 group-hover:text-void-black transition-colors duration-300 flex items-center gap-2">
        {children}
      </span>
    </button>
  );
};

export default Button;
