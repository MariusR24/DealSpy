import React from 'react';
import { Bell, Save } from './icons';

export const SignUpBanner: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-red-800 to-red-600 rounded-lg p-6 mb-8 flex flex-col md:flex-row justify-between items-center gap-4 text-white shadow-lg shadow-red-500/20">
      <div className="flex items-center gap-4 text-center md:text-left">
        <div className="flex-shrink-0 bg-white/20 p-3 rounded-full hidden sm:block">
            <Save className="w-8 h-8"/>
        </div>
        <div>
          <h3 className="text-xl font-bold">Wishlist-ul tău este salvat local!</h3>
          <p className="text-sm opacity-90">Creează un cont gratuit pentru a-l salva permanent și a primi alerte de preț.</p>
        </div>
      </div>
      <button className="bg-white text-slate-800 font-bold py-2.5 px-6 rounded-full hover:bg-slate-200 transition-colors flex-shrink-0 shadow-md">
        Înregistrează-te Acum
      </button>
    </div>
  );
};