import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Server, Cpu, HardDrive, MemoryStick, Thermometer, Clock, Shield, Wifi } from 'lucide-react';

type SystemMetric = {
  label: string;
  value: string;
  percent: number;
  icon: React.ReactNode;
  color: string;
};

export default function SystemPanel() {
  const [metrics, setMetrics] = useState<SystemMetric[]>([
    { label: 'CPU Usage', value: '23%', percent: 23, icon: <Cpu className="w-4 h-4" />, color: 'emerald' },
    { label: 'Memory', value: '4.2 / 16 GB', percent: 26, icon: <MemoryStick className="w-4 h-4" />, color: 'blue' },
    { label: 'Disk I/O', value: '142 MB/s', percent: 45, icon: <HardDrive className="w-4 h-4" />, color: 'purple' },
    { label: 'Network', value: '89 Mbps', percent: 67, icon: <Wifi className="w-4 h-4" />, color: 'cyan' },
    { label: 'Temperature', value: '42°C', percent: 35, icon: <Thermometer className="w-4 h-4" />, color: 'orange' },
    { label: 'Load Average', value: '1.24', percent: 18, icon: <Server className="w-4 h-4" />, color: 'emerald' },
  ]);

  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setUptime(prev => prev + 1);
      setMetrics(prev => prev.map(m => ({
        ...m,
        percent: Math.max(5, Math.min(95, m.percent + (Math.random() - 0.5) * 10)),
        value: m.label === 'CPU Usage' ? `${Math.floor(m.percent)}%` :
               m.label === 'Memory' ? `${(m.percent * 0.16).toFixed(1)} / 16 GB` :
               m.label === 'Disk I/O' ? `${Math.floor(m.percent * 3.2)} MB/s` :
               m.label === 'Network' ? `${Math.floor(m.percent * 1.3)} Mbps` :
               m.label === 'Temperature' ? `${Math.floor(35 + m.percent * 0.2)}°C` :
               `${(m.percent * 0.07).toFixed(2)}`
      })));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds: number) => {
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${d}d ${h}h ${m}m ${s}s`;
  };

  const services = [
    { name: 'sentinel-core', status: 'running', port: '3000', memory: '128MB', uptime: '14d 7h' },
    { name: 'ghostvault-proxy', status: 'running', port: '8443', memory: '64MB', uptime: '14d 7h' },
    { name: 'hmac-validator', status: 'running', port: '9090', memory: '32MB', uptime: '14d 7h' },
    { name: 'audit-logger', status: 'running', port: '5432', memory: '96MB', uptime: '14d 7h' },
    { name: 'rate-limiter', status: 'running', port: '6379', memory: '48MB', uptime: '14d 7h' },
    { name: 'cert-manager', status: 'running', port: '8080', memory: '24MB', uptime: '14d 7h' },
  ];

  const dockerConfig = `version: '3.8'
services:
  sentinel-core:
    build: .
    container_name: sovereign-sentinel
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - WEBHOOK_SECRET=\${WEBHOOK_SECRET}
    restart: unless-stopped
    security_opt:
      - no-new-privileges:true
    read_only: true
    tmpfs:
      - /tmp`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-purple-950/30 rounded-lg border border-purple-900/40">
          <Server className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-emerald-100 tracking-wide">System Core</h2>
          <p className="text-xs text-emerald-700">Infrastructure Monitoring & Docker Configuration</p>
        </div>
      </div>

      {/* Uptime Banner */}
      <div className="bg-gradient-to-r from-emerald-950/30 to-purple-950/30 border border-emerald-900/30 rounded-lg p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-emerald-400" />
          <div>
            <p className="text-[10px] text-emerald-700 uppercase tracking-widest">System Uptime</p>
            <p className="text-2xl font-bold text-emerald-300 font-mono">{formatUptime(uptime + 1234567)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-emerald-950/40 px-4 py-2 rounded-full border border-emerald-800/40">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span className="text-xs text-emerald-300 font-semibold">ZERO INCIDENTS</span>
        </div>
      </div>

      {/* System Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric, i) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-gray-950/50 border border-emerald-900/30 rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className={`${
                  metric.color === 'emerald' ? 'text-emerald-400' :
                  metric.color === 'blue' ? 'text-blue-400' :
                  metric.color === 'purple' ? 'text-purple-400' :
                  metric.color === 'cyan' ? 'text-cyan-400' :
                  metric.color === 'orange' ? 'text-orange-400' : 'text-emerald-400'
                }`}>
                  {metric.icon}
                </span>
                <span className="text-[10px] text-emerald-700 uppercase tracking-wider">{metric.label}</span>
              </div>
              <span className="text-sm font-bold text-emerald-300 font-mono">{metric.value}</span>
            </div>
            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                animate={{ width: `${metric.percent}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className={`h-full rounded-full ${
                  metric.color === 'emerald' ? 'bg-emerald-500' :
                  metric.color === 'blue' ? 'bg-blue-500' :
                  metric.color === 'purple' ? 'bg-purple-500' :
                  metric.color === 'cyan' ? 'bg-cyan-500' :
                  metric.color === 'orange' ? 'bg-orange-500' : 'bg-emerald-500'
                }`}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Docker Services */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-950/50 border border-emerald-900/30 rounded-lg overflow-hidden">
          <div className="bg-emerald-950/20 px-4 py-3 border-b border-emerald-900/30">
            <span className="text-[10px] text-emerald-600 uppercase tracking-widest font-bold">
              Docker Services
            </span>
          </div>
          <div className="p-4 space-y-2">
            {services.map((service) => (
              <div key={service.name} className="flex items-center justify-between py-2 border-b border-emerald-900/20 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-sm text-emerald-300 font-mono">{service.name}</span>
                </div>
                <div className="flex items-center gap-4 text-[10px] text-emerald-700">
                  <span>:{service.port}</span>
                  <span>{service.memory}</span>
                  <span className="text-emerald-500">{service.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Docker Config */}
        <div className="bg-gray-950/50 border border-emerald-900/30 rounded-lg overflow-hidden">
          <div className="bg-emerald-950/20 px-4 py-3 border-b border-emerald-900/30 flex justify-between items-center">
            <span className="text-[10px] text-emerald-600 uppercase tracking-widest font-bold">
              docker-compose.yml
            </span>
            <button
              onClick={() => navigator.clipboard.writeText(dockerConfig)}
              className="text-[10px] text-emerald-500 hover:text-emerald-300 transition-colors"
            >
              Copy
            </button>
          </div>
          <pre className="p-4 text-[11px] text-emerald-400/80 font-mono overflow-x-auto leading-relaxed">
            {dockerConfig}
          </pre>
        </div>
      </div>
    </div>
  );
}
