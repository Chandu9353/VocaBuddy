import React from 'react';

export default function AudioWaveVisualizer({ active = false, color = 'bg-brand-500' }) {
  if (!active) return null;

  return (
    <div className="flex items-center justify-center gap-1 h-6 px-2">
      <span className={`w-1 rounded-full animate-wave ${color}`} style={{ height: '18px', animationDelay: '0.1s' }}></span>
      <span className={`w-1 rounded-full animate-wave ${color}`} style={{ height: '24px', animationDelay: '0.3s' }}></span>
      <span className={`w-1 rounded-full animate-wave ${color}`} style={{ height: '14px', animationDelay: '0.5s' }}></span>
      <span className={`w-1 rounded-full animate-wave ${color}`} style={{ height: '22px', animationDelay: '0.2s' }}></span>
      <span className={`w-1 rounded-full animate-wave ${color}`} style={{ height: '16px', animationDelay: '0.4s' }}></span>
    </div>
  );
}

