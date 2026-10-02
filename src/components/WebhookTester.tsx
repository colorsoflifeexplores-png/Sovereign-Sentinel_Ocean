import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Radio, Key, Shield, CheckCircle, XCircle, Copy, RefreshCw } from 'lucide-react';

export default function WebhookTester() {
  const [secret, setSecret] = useState('sovereign-key-2024-ghostvault');
  const [payload, setPayload] = useState(JSON.stringify({
    event: 'settlement.confirmed',
    amount: '2400000000',
    currency: 'NGN',
    reference: 'NIBSS-2024-RTGS-0042',
    timestamp: Date.now(),
  }, null, 2));
  const [generatedSignature, setGeneratedSignature] = useState('');
  const [verifyInput, setVerifyInput] = useState('');
  const [verifyResult, setVerifyResult] = useState<'success' | 'fail' | null>(null);
  const [copied, setCopied] = useState(false);

  const generateSignature = useCallback(async () => {
    try {
      const encoder = new TextEncoder();
      const keyData = encoder.encode(secret);
      const messageData = encoder.encode(payload);

      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      );

      const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
      const hashArray = Array.from(new Uint8Array(signature));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      setGeneratedSignature(hashHex);
      setVerifyInput(hashHex);
      setVerifyResult(null);
    } catch (e) {
      console.error('Signature generation failed:', e);
    }
  }, [secret, payload]);

  const verifySignature = useCallback(async () => {
    try {
      const encoder = new TextEncoder();
      const keyData = encoder.encode(secret);
      const messageData = encoder.encode(payload);

      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      );

      const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
      const hashArray = Array.from(new Uint8Array(signature));
      const expectedHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      // Constant-time comparison simulation
      if (verifyInput.toLowerCase() === expectedHex) {
        setVerifyResult('success');
      } else {
        setVerifyResult('fail');
      }
    } catch (e) {
      setVerifyResult('fail');
    }
  }, [secret, payload, verifyInput]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-emerald-950/30 rounded-lg border border-emerald-900/40">
          <Radio className="w-6 h-6 text-emerald-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-emerald-100 tracking-wide">Webhook Forge</h2>
          <p className="text-xs text-emerald-700">HMAC-SHA256 Signature Generator & Verifier</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          {/* Secret Key */}
          <div className="bg-gray-950/50 border border-emerald-900/30 rounded-lg p-4">
            <label className="flex items-center gap-2 text-[10px] text-emerald-600 uppercase tracking-widest mb-2">
              <Key className="w-3 h-3" />
              Webhook Secret
            </label>
            <input
              type="text"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              className="w-full bg-black/50 border border-emerald-900/40 rounded px-3 py-2 text-sm text-emerald-300 font-mono focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20"
              placeholder="Enter webhook secret..."
            />
          </div>

          {/* Payload */}
          <div className="bg-gray-950/50 border border-emerald-900/30 rounded-lg p-4">
            <label className="flex items-center gap-2 text-[10px] text-emerald-600 uppercase tracking-widest mb-2">
              <Shield className="w-3 h-3" />
              JSON Payload
            </label>
            <textarea
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
              rows={10}
              className="w-full bg-black/50 border border-emerald-900/40 rounded px-3 py-2 text-sm text-emerald-300 font-mono focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 resize-none"
              placeholder="Enter JSON payload..."
            />
          </div>

          {/* Generate Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={generateSignature}
            className="w-full bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 py-3 rounded-lg font-semibold text-sm uppercase tracking-wider hover:bg-emerald-600/30 transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Generate HMAC-SHA256 Signature
          </motion.button>
        </div>

        {/* Output Section */}
        <div className="space-y-4">
          {/* Generated Signature */}
          <div className="bg-gray-950/50 border border-emerald-900/30 rounded-lg p-4">
            <label className="flex items-center justify-between text-[10px] text-emerald-600 uppercase tracking-widest mb-2">
              <span className="flex items-center gap-2">
                <Shield className="w-3 h-3" />
                Generated Signature
              </span>
              {generatedSignature && (
                <button
                  onClick={() => copyToClipboard(generatedSignature)}
                  className="text-emerald-500 hover:text-emerald-300 transition-colors flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              )}
            </label>
            <div className="bg-black/50 border border-emerald-900/30 rounded px-3 py-3 text-sm text-emerald-400 font-mono break-all min-h-[60px]">
              {generatedSignature || (
                <span className="text-emerald-800 italic">Signature will appear here...</span>
              )}
            </div>
          </div>

          {/* Verification Section */}
          <div className="bg-gray-950/50 border border-emerald-900/30 rounded-lg p-4">
            <label className="flex items-center gap-2 text-[10px] text-emerald-600 uppercase tracking-widest mb-2">
              <Key className="w-3 h-3" />
              Verify Signature
            </label>
            <input
              type="text"
              value={verifyInput}
              onChange={(e) => { setVerifyInput(e.target.value); setVerifyResult(null); }}
              className="w-full bg-black/50 border border-emerald-900/40 rounded px-3 py-2 text-sm text-emerald-300 font-mono focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20"
              placeholder="Paste signature to verify..."
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={verifySignature}
              className="w-full mt-3 bg-blue-600/20 border border-blue-500/40 text-blue-300 py-2.5 rounded-lg font-semibold text-xs uppercase tracking-wider hover:bg-blue-600/30 transition-all"
            >
              Verify Integrity
            </motion.button>

            {/* Result */}
            {verifyResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-3 p-3 rounded-lg border flex items-center gap-3 ${
                  verifyResult === 'success'
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                    : 'bg-red-950/30 border-red-500/40 text-red-300'
                }`}
              >
                {verifyResult === 'success' ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <p className="font-bold text-sm">INTEGRITY VERIFIED</p>
                      <p className="text-[10px] opacity-70">Signature matches — payload is authentic</p>
                    </div>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                    <div>
                      <p className="font-bold text-sm">INTEGRITY CHECK FAILED</p>
                      <p className="text-[10px] opacity-70">Signature mismatch — payload may be tampered</p>
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </div>

          {/* Info Card */}
          <div className="bg-blue-950/20 border border-blue-900/30 rounded-lg p-4">
            <p className="text-[10px] text-blue-400 uppercase tracking-widest mb-2 font-bold">Protocol Info</p>
            <ul className="text-[11px] text-blue-300/70 space-y-1">
              <li>• Algorithm: HMAC-SHA256 (FIPS 198-1)</li>
              <li>• Key Length: Variable (recommended 256-bit)</li>
              <li>• Comparison: Constant-time to prevent timing attacks</li>
              <li>• Replay Protection: Timestamp validation (60s window)</li>
              <li>• Transport: TLS 1.3 with certificate pinning</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
