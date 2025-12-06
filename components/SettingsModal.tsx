
import React from 'react';
import { XMarkIcon, TrashIcon, UserIcon, CheckBadgeIcon, ShieldCheckIcon } from './icons';

interface SettingsModalProps {
  onClose: () => void;
  onClearData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose, onClearData }) => {
  return (
    <div
      className="fixed inset-0 bg-dark/80 backdrop-blur-md flex items-center justify-center p-4 z-[100]"
      onClick={onClose}
    >
      <div
        className="bg-charcoal border border-glass-border rounded-2xl shadow-glass-xl w-full max-w-md relative animate-fade-in-up overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-surface/50">
           <h2 className="text-xl font-bold font-display text-white flex items-center">
             <UserIcon className="w-5 h-5 mr-3 text-accent" />
             Account & Settings
           </h2>
           <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
             <XMarkIcon className="w-5 h-5" />
           </button>
        </div>

        <div className="p-6 space-y-8">
            {/* User Profile Stub */}
            <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-amber-700 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    ME
                </div>
                <div>
                    <h3 className="text-white font-semibold">User</h3>
                    <div className="flex items-center text-xs text-green-400 bg-green-900/20 px-2 py-0.5 rounded border border-green-500/20 w-fit mt-1">
                        <CheckBadgeIcon className="w-3 h-3 mr-1"/> Enterprise Beta
                    </div>
                </div>
            </div>

            {/* Data Management */}
            <div>
                <h4 className="text-xs font-bold text-subtle uppercase tracking-widest mb-3">Data Management</h4>
                <div className="bg-white/5 border border-white/5 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                         <span className="text-sm text-platinum font-medium">Clear Application Data</span>
                         <button 
                            onClick={() => {
                                if(window.confirm("Are you sure? This will delete your current resume draft and reset the application.")) {
                                    onClearData();
                                }
                            }}
                            className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-3 py-1.5 rounded transition-colors flex items-center"
                         >
                            <TrashIcon className="w-3 h-3 mr-1.5"/> Reset
                         </button>
                    </div>
                    <p className="text-[10px] text-subtle leading-relaxed">
                        This removes locally stored drafts and resets the editor.
                    </p>
                </div>
            </div>

            {/* Legal */}
            <div>
                <h4 className="text-xs font-bold text-subtle uppercase tracking-widest mb-3">Legal & Compliance</h4>
                <div className="flex space-x-4">
                     <button onClick={() => alert("Privacy Policy Mock: We value your privacy.")} className="flex items-center text-xs text-slate-400 hover:text-white transition-colors">
                        <ShieldCheckIcon className="w-4 h-4 mr-1.5"/> Privacy Policy
                     </button>
                     <button onClick={() => alert("Terms of Service Mock: Standard SaaS terms.")} className="flex items-center text-xs text-slate-400 hover:text-white transition-colors">
                        <ShieldCheckIcon className="w-4 h-4 mr-1.5"/> Terms of Service
                     </button>
                </div>
            </div>
        </div>

        <div className="bg-obsidian/50 p-4 border-t border-white/5 text-center">
            <p className="text-[10px] text-slate-600">AI Resume Artisan v1.1.0 (Enterprise Build)</p>
        </div>

      </div>
    </div>
  );
};
