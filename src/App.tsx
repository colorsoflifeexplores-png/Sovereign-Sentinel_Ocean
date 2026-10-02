import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Activity, Terminal, Lock, AlertTriangle, Radio, Globe, Server } from 'lucide-react';
import Dashboard from './components/Dashboard';
import WebhookTester from './components/WebhookTester';
import SystemPanel from './components/SystemPanel';
import NetworkMap from './components/NetworkMap';

type Page = 'dashboard' | 'webhook' | 'system' | 'network';

export default function App() {
  const [activePage, setActivePage] = useState<Page>('dashboard');

  const navItems: { id: Page; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Command Center', icon: <Activity className="w-4 h-4" /> },
    { id: 'webhook', label: 'Webhook Forge', icon: <Radio className="w-4 h-4" /> },
    { id: 'network', label: 'Network Mesh', icon: <Globe className="w-4 h-4" /> },
    { id: 'system', label: 'System Core', icon: <Server className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-emerald-500 font-mono selection:bg-emerald-900 selection:text-white">
      {/* Ambient Background Effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/3 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/3 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/2 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-emerald-900/30 bg-black/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <ShieldCheck className="w-8 h-8 text-emerald-400" />
                <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse" />
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-wider uppercase text-emerald-100">
                  Sovereign Sentinel
                </h1>
                <p className="text-[10px] text-emerald-700 tracking-widest uppercase">Zero-Trust Operations Center</p>
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 bg-emerald-950/30 px-4 py-1.5 rounded-full border border-emerald-900/50">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-semibold text-emerald-300">ALL SYSTEMS NOMINAL</span>
              </div>
              <div className="text-xs text-emerald-700 hidden md:block">
                {new Date().toISOString().split('T')[0]}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex gap-1 -mb-px overflow-x-auto pb-0">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${
                  activePage === item.id
                    ? 'border-emerald-400 text-emerald-300 bg-emerald-950/20'
                    : 'border-transparent text-emerald-700 hover:text-emerald-400 hover:border-emerald-900'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activePage === 'dashboard' && <Dashboard />}
            {activePage === 'webhook' && <WebhookTester />}
            {activePage === 'network' && <NetworkMap />}
            {activePage === 'system' && <SystemPanel />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-emerald-900/20 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-[10px] text-emerald-800 tracking-wider uppercase">
            Sovereign Sentinel v2.1.0 // HMAC-SHA256 // Zero-Trust Architecture
          </p>
          <p className="text-[10px] text-emerald-800 tracking-wider">
            ISO-20022 Compliant • End-to-End Encrypted
          </p>
        </div>
      </footer>
    </div>
  );
}
