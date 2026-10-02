import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, Shield, Server, Zap, Lock } from 'lucide-react';

type Node = {
  id: string;
  label: string;
  x: number;
  y: number;
  type: 'core' | 'validator' | 'gateway' | 'vault';
  status: 'active' | 'syncing' | 'idle';
  latency: number;
};

type Connection = {
  from: string;
  to: string;
  strength: number;
};

export default function NetworkMap() {
  const [nodes, setNodes] = useState<Node[]>([
    { id: 'core-1', label: 'Sentinel Core', x: 50, y: 45, type: 'core', status: 'active', latency: 0 },
    { id: 'vault-1', label: 'GhostVault', x: 25, y: 25, type: 'vault', status: 'active', latency: 12 },
    { id: 'vault-2', label: 'GhostVault Mirror', x: 75, y: 25, type: 'vault', status: 'active', latency: 18 },
    { id: 'val-1', label: 'Validator α', x: 20, y: 60, type: 'validator', status: 'active', latency: 45 },
    { id: 'val-2', label: 'Validator β', x: 40, y: 75, type: 'validator', status: 'active', latency: 52 },
    { id: 'val-3', label: 'Validator γ', x: 60, y: 75, type: 'validator', status: 'syncing', latency: 89 },
    { id: 'val-4', label: 'Validator δ', x: 80, y: 60, type: 'validator', status: 'active', latency: 38 },
    { id: 'gw-1', label: 'API Gateway', x: 15, y: 42, type: 'gateway', status: 'active', latency: 8 },
    { id: 'gw-2', label: 'Webhook Relay', x: 85, y: 42, type: 'gateway', status: 'active', latency: 11 },
    { id: 'nibss', label: 'NIBSS Bridge', x: 50, y: 15, type: 'gateway', status: 'active', latency: 24 },
  ]);

  const [connections] = useState<Connection[]>([
    { from: 'core-1', to: 'vault-1', strength: 0.95 },
    { from: 'core-1', to: 'vault-2', strength: 0.92 },
    { from: 'core-1', to: 'val-1', strength: 0.88 },
    { from: 'core-1', to: 'val-2', strength: 0.91 },
    { from: 'core-1', to: 'val-3', strength: 0.76 },
    { from: 'core-1', to: 'val-4', strength: 0.94 },
    { from: 'core-1', to: 'gw-1', strength: 0.99 },
    { from: 'core-1', to: 'gw-2', strength: 0.97 },
    { from: 'core-1', to: 'nibss', strength: 0.93 },
    { from: 'vault-1', to: 'vault-2', strength: 0.98 },
    { from: 'gw-1', to: 'val-1', strength: 0.85 },
    { from: 'gw-2', to: 'val-4', strength: 0.87 },
    { from: 'nibss', to: 'vault-1', strength: 0.90 },
    { from: 'nibss', to: 'vault-2', strength: 0.89 },
  ]);

  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [pulsePhase, setPulsePhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulsePhase(prev => (prev + 1) % 100);
      setNodes(prev => prev.map(n => ({
        ...n,
        latency: n.id === 'core-1' ? 0 : Math.max(5, n.latency + (Math.random() - 0.5) * 10),
        status: Math.random() > 0.95 ? 'syncing' : 'active'
      })));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'core': return { bg: 'bg-emerald-500', ring: 'ring-emerald-400/50', text: 'text-emerald-400' };
      case 'vault': return { bg: 'bg-blue-500', ring: 'ring-blue-400/50', text: 'text-blue-400' };
      case 'validator': return { bg: 'bg-purple-500', ring: 'ring-purple-400/50', text: 'text-purple-400' };
      case 'gateway': return { bg: 'bg-cyan-500', ring: 'ring-cyan-400/50', text: 'text-cyan-400' };
      default: return { bg: 'bg-emerald-500', ring: 'ring-emerald-400/50', text: 'text-emerald-400' };
    }
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'core': return <Shield className="w-3 h-3" />;
      case 'vault': return <Lock className="w-3 h-3" />;
      case 'validator': return <Zap className="w-3 h-3" />;
      case 'gateway': return <Server className="w-3 h-3" />;
      default: return <Globe className="w-3 h-3" />;
    }
  };

  const selectedNodeData = nodes.find(n => n.id === selectedNode);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-cyan-950/30 rounded-lg border border-cyan-900/40">
          <Globe className="w-6 h-6 text-cyan-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-emerald-100 tracking-wide">Network Mesh</h2>
          <p className="text-xs text-emerald-700">Sovereign Infrastructure Topology — Real-Time</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-gray-950/50 border border-emerald-900/30 rounded-lg p-3 text-center">
          <p className="text-[10px] text-emerald-700 uppercase tracking-wider">Nodes</p>
          <p className="text-xl font-bold text-emerald-300">{nodes.length}</p>
        </div>
        <div className="bg-gray-950/50 border border-emerald-900/30 rounded-lg p-3 text-center">
          <p className="text-[10px] text-emerald-700 uppercase tracking-wider">Connections</p>
          <p className="text-xl font-bold text-blue-300">{connections.length}</p>
        </div>
        <div className="bg-gray-950/50 border border-emerald-900/30 rounded-lg p-3 text-center">
          <p className="text-[10px] text-emerald-700 uppercase tracking-wider">Avg Latency</p>
          <p className="text-xl font-bold text-purple-300">
            {Math.round(nodes.filter(n => n.id !== 'core-1').reduce((a, b) => a + b.latency, 0) / (nodes.length - 1))}ms
          </p>
        </div>
        <div className="bg-gray-950/50 border border-emerald-900/30 rounded-lg p-3 text-center">
          <p className="text-[10px] text-emerald-700 uppercase tracking-wider">Consensus</p>
          <p className="text-xl font-bold text-cyan-300">100%</p>
        </div>
      </div>

      {/* Network Visualization */}
      <div className="bg-gray-950/50 border border-emerald-900/30 rounded-lg overflow-hidden">
        <div className="bg-emerald-950/20 px-4 py-3 border-b border-emerald-900/30 flex justify-between items-center">
          <span className="text-[10px] text-emerald-600 uppercase tracking-widest font-bold">
            Topology Map
          </span>
          <span className="text-[10px] text-emerald-700">Click nodes for details</span>
        </div>

        <div className="relative w-full h-[500px] bg-[radial-gradient(ellipse_at_center,_rgba(16,185,129,0.03)_0%,_transparent_70%)]">
          {/* Grid Background */}
          <svg className="absolute inset-0 w-full h-full opacity-10">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgb(16,185,129)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          {/* Connections */}
          <svg className="absolute inset-0 w-full h-full">
            {connections.map((conn) => {
              const fromNode = nodes.find(n => n.id === conn.from);
              const toNode = nodes.find(n => n.id === conn.to);
              if (!fromNode || !toNode) return null;

              const isHighlighted = selectedNode === conn.from || selectedNode === conn.to;

              return (
                <g key={`${conn.from}-${conn.to}`}>
                  <line
                    x1={`${fromNode.x}%`}
                    y1={`${fromNode.y}%`}
                    x2={`${toNode.x}%`}
                    y2={`${toNode.y}%`}
                    stroke={isHighlighted ? 'rgb(16,185,129)' : 'rgb(16,185,129)'}
                    strokeWidth={isHighlighted ? 2 : 1}
                    strokeOpacity={isHighlighted ? 0.6 : 0.15}
                    strokeDasharray={isHighlighted ? 'none' : '4 4'}
                  />
                  {isHighlighted && (
                    <circle r="3" fill="rgb(16,185,129)" opacity="0.8">
                      <animateMotion
                        dur={`${2 + Math.random()}s`}
                        repeatCount="indefinite"
                        path={`M${fromNode.x * 7.2} ${fromNode.y * 5} L${toNode.x * 7.2} ${toNode.y * 5}`}
                      />
                    </circle>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Nodes */}
          {nodes.map((node) => {
            const colors = getNodeColor(node.type);
            const isSelected = selectedNode === node.id;

            return (
              <motion.button
                key={node.id}
                onClick={() => setSelectedNode(isSelected ? null : node.id)}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 group`}
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Pulse Ring */}
                {node.status === 'active' && (
                  <div className={`absolute inset-0 -m-2 rounded-full ${colors.bg} opacity-20 animate-ping`} style={{ animationDuration: '3s' }} />
                )}
                {node.status === 'syncing' && (
                  <div className={`absolute inset-0 -m-2 rounded-full bg-yellow-500 opacity-20 animate-ping`} style={{ animationDuration: '1.5s' }} />
                )}

                {/* Node Body */}
                <div className={`relative w-10 h-10 rounded-full ${colors.bg} flex items-center justify-center text-white shadow-lg ${
                  isSelected ? `ring-4 ${colors.ring}` : ''
                } ${node.type === 'core' ? 'w-14 h-14' : ''}`}>
                  {getNodeIcon(node.type)}
                </div>

                {/* Label */}
                <div className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap text-[9px] ${colors.text} font-bold uppercase tracking-wider opacity-70 group-hover:opacity-100 transition-opacity`}>
                  {node.label}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Node Details Panel */}
      {selectedNodeData && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-950/50 border border-emerald-900/30 rounded-lg p-5"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-8 h-8 rounded-full ${getNodeColor(selectedNodeData.type).bg} flex items-center justify-center text-white`}>
              {getNodeIcon(selectedNodeData.type)}
            </div>
            <div>
              <h3 className="text-sm font-bold text-emerald-200">{selectedNodeData.label}</h3>
              <p className="text-[10px] text-emerald-700 uppercase">{selectedNodeData.type} node</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${selectedNodeData.status === 'active' ? 'bg-emerald-400' : 'bg-yellow-400'} animate-pulse`} />
              <span className="text-[10px] text-emerald-500 uppercase">{selectedNodeData.status}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-[10px] text-emerald-700 uppercase">Node ID</p>
              <p className="text-xs text-emerald-300 font-mono">{selectedNodeData.id}</p>
            </div>
            <div>
              <p className="text-[10px] text-emerald-700 uppercase">Latency</p>
              <p className="text-xs text-emerald-300 font-mono">{selectedNodeData.latency}ms</p>
            </div>
            <div>
              <p className="text-[10px] text-emerald-700 uppercase">Connections</p>
              <p className="text-xs text-emerald-300 font-mono">
                {connections.filter(c => c.from === selectedNodeData.id || c.to === selectedNodeData.id).length}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-emerald-700 uppercase">Encryption</p>
              <p className="text-xs text-emerald-300 font-mono">AES-256-GCM</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-4 justify-center">
        {[
          { type: 'core', label: 'Core' },
          { type: 'vault', label: 'Vault' },
          { type: 'validator', label: 'Validator' },
          { type: 'gateway', label: 'Gateway' },
        ].map(item => (
          <div key={item.type} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getNodeColor(item.type).bg}`} />
            <span className="text-[10px] text-emerald-600 uppercase tracking-wider">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
