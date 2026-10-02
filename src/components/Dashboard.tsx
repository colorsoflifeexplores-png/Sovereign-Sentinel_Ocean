import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Activity, Terminal, Lock, AlertTriangle, Zap, Database, Key } from 'lucide-react';

type LogEntry = {
  id: number;
  time: string;
  type: 'SUCCESS' | 'ALERT' | 'INFO' | 'WARN';
  message: string;
  hash: string;
};

export default function Dashboard() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [totalEvents, setTotalEvents] = useState(14823);
  const [threatsBlocked, setThreatsBlocked] = useState(47);

  useEffect(() => {
    const interval = setInterval(() => {
      const types: ('SUCCESS' | 'ALERT' | 'INFO' | 'WARN')[] = ['SUCCESS', 'INFO', 'SUCCESS', 'SUCCESS', 'ALERT', 'WARN', 'SUCCESS'];
      const messages = [
        'NIBSS Settlement Confirmed — ₦2.4B routed',
        'HMAC-SHA256 Signature Verified ✓',
        'New Block Detected: #18923 — 0x7f3a...c92d',
        'Reserve Sync Complete — Delta: 0.0003%',
        'Suspicious Payload Blocked — Origin: 185.x.x.x',
        'GhostVault Key Rotation Complete',
        'ISO-20022 Message Parsed Successfully',
        'TLS 1.3 Handshake Established',
        'Rate Limit Threshold: 94.2% capacity',
        'Certificate Pinning Verified — *.sovereign.ng',
        'Zero-Day Pattern Detected — Quarantined',
        'Multi-Sig Approval: 3/5 Confirmed',
        'API Gateway Health Check: PASS',
        'Consensus Round Complete — 142 validators',
        'Audit Log Committed — Block #18924',
      ];

      const randomType = types[Math.floor(Math.random() * types.length)];
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];

      const newLog: LogEntry = {
        id: Date.now() + Math.random(),
        time: new Date().toLocaleTimeString('en-US', { hour12: false }),
        type: randomType,
        message: randomMsg,
        hash: Math.random().toString(36).substring(2, 10).toUpperCase(),
      };

      setLogs((prev) => [newLog, ...prev].slice(0, 30));
      setTotalEvents((prev) => prev + Math.floor(Math.random() * 3) + 1);
      if (randomType === 'ALERT') {
        setThreatsBlocked((prev) => prev + 1);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Lock className="w-5 h-5" />}
          label="Active Secrets"
          value="GHOSTVAULT"
          sublabel="Connected & Encrypted"
          color="text-blue-400"
          borderColor="border-blue-500/30"
        />
        <StatCard
          icon={<Activity className="w-5 h-5" />}
          label="Events Processed"
          value={totalEvents.toLocaleString()}
          sublabel="+142.5/sec avg"
          color="text-emerald-400"
          borderColor="border-emerald-500/30"
        />
        <StatCard
          icon={<Terminal className="w-5 h-5" />}
          label="Uptime"
          value="99.999%"
          sublabel="Since deployment"
          color="text-purple-400"
          borderColor="border-purple-500/30"
        />
        <StatCard
          icon={<AlertTriangle className="w-5 h-5" />}
          label="Threats Blocked"
          value={threatsBlocked.toString()}
          sublabel="Last 24h"
          color="text-red-400"
          borderColor="border-red-500/30"
        />
      </div>

      {/* Security Metrics Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SecurityMetric label="HMAC Verification Rate" value={99.97} color="emerald" />
        <SecurityMetric label="Payload Integrity Score" value={98.4} color="blue" />
        <SecurityMetric label="Network Throughput" value={87.2} color="purple" />
      </div>

      {/* Live Feed */}
      <div className="border border-emerald-900/40 rounded-lg bg-gray-950/50 overflow-hidden shadow-[0_0_30px_rgba(16,185,129,0.05)]">
        <div className="bg-emerald-950/20 px-5 py-3 border-b border-emerald-900/40 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs uppercase tracking-widest text-emerald-600 font-bold">
              Live Event Stream
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] text-emerald-700 hidden sm:inline">ISO-20022 // HMAC-SHA256 // AES-256-GCM</span>
            <span className="text-[10px] text-emerald-600 bg-emerald-950/50 px-2 py-0.5 rounded">
              {logs.length} events
            </span>
          </div>
        </div>
        <div className="p-4 space-y-1.5 h-[450px] overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-900 scrollbar-track-transparent">
          <AnimatePresence initial={false}>
            {logs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex items-start gap-3 text-sm border-l-2 pl-4 py-2 rounded-r ${
                  log.type === 'ALERT'
                    ? 'border-red-500 text-red-400 bg-red-950/10'
                    : log.type === 'WARN'
                    ? 'border-yellow-500 text-yellow-400 bg-yellow-950/10'
                    : log.type === 'SUCCESS'
                    ? 'border-emerald-500 text-emerald-300'
                    : 'border-blue-500 text-blue-300'
                }`}
              >
                <span className="opacity-50 text-[11px] w-20 shrink-0 font-mono">{log.time}</span>
                <span className="font-bold text-[10px] w-16 shrink-0 uppercase tracking-wider">
                  {log.type}
                </span>
                <span className="flex-1 text-[13px]">{log.message}</span>
                <span className="opacity-30 text-[10px] font-mono shrink-0">#{log.hash}</span>
              </motion.div>
            ))}
          </AnimatePresence>
          {logs.length === 0 && (
            <div className="flex items-center justify-center h-32 text-emerald-800 text-sm">
              Initializing event stream...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sublabel,
  color,
  borderColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sublabel: string;
  color: string;
  borderColor: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`bg-gray-950/60 border ${borderColor} p-5 rounded-lg flex items-start gap-4 hover:bg-gray-900/40 transition-all duration-300`}
    >
      <div className={`p-2.5 bg-gray-900/80 rounded-lg ${color}`}>{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-emerald-700 uppercase tracking-widest">{label}</p>
        <p className={`text-xl font-bold ${color} truncate`}>{value}</p>
        <p className="text-[10px] text-emerald-800 mt-0.5">{sublabel}</p>
      </div>
    </motion.div>
  );
}

function SecurityMetric({ label, value, color }: { label: string; value: number; color: string }) {
  const colorMap: Record<string, string> = {
    emerald: 'from-emerald-500 to-emerald-400',
    blue: 'from-blue-500 to-blue-400',
    purple: 'from-purple-500 to-purple-400',
  };

  const bgMap: Record<string, string> = {
    emerald: 'bg-emerald-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
  };

  return (
    <div className="bg-gray-950/40 border border-emerald-900/30 rounded-lg p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[10px] text-emerald-700 uppercase tracking-wider">{label}</span>
        <span className={`text-sm font-bold ${color === 'emerald' ? 'text-emerald-400' : color === 'blue' ? 'text-blue-400' : 'text-purple-400'}`}>
          {value}%
        </span>
      </div>
      <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className={`h-full rounded-full bg-gradient-to-r ${colorMap[color]}`}
        />
      </div>
    </div>
  );
}
