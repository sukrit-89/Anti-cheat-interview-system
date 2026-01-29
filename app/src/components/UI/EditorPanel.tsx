import { useState, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { GlassCard } from './GlassCard';
import { motion } from 'framer-motion';

interface EditorPanelProps {
  onTyping: (isTyping: boolean) => void;
}

const defaultCode = `// Welcome to InterGEN Neural Constellation
// Start coding to activate the CodingAgent

interface AgentConfig {
  id: string;
  name: string;
  capabilities: string[];
}

class CodingAgent {
  private complexity: number = 0;
  private isAnalyzing: boolean = false;

  public analyzeCode(code: string): void {
    this.isAnalyzing = true;
    this.complexity = this.calculateComplexity(code);
    
    // Neural processing...
    console.log(\`Code complexity: \${this.complexity}\`);
  }

  private calculateComplexity(code: string): number {
    const lines = code.split('\\n').length;
    const functions = (code.match(/function|=>/g) || []).length;
    return Math.min(10, (lines + functions) / 10);
  }
}

const agent = new CodingAgent();
export default agent;`;

export function EditorPanel({ onTyping }: EditorPanelProps) {
  const [code, setCode] = useState(defaultCode);
  const [typingTimeout, setTypingTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = useCallback(
    (value: string | undefined) => {
      if (value !== undefined) {
        setCode(value);
        onTyping(true);

        // Clear existing timeout
        if (typingTimeout) {
          clearTimeout(typingTimeout);
        }

        // Set new timeout to detect when typing stops
        const timeout = setTimeout(() => {
          onTyping(false);
        }, 1000);

        setTypingTimeout(timeout);
      }
    },
    [onTyping, typingTimeout]
  );

  return (
    <GlassCard className="w-full h-full flex flex-col" delay={0.2}>
      <motion.div
        className="flex items-center justify-between px-4 py-3 border-b border-[rgba(255,255,255,0.08)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
          </div>
          <span className="ml-3 text-sm text-white/60 font-mono">
            interview.tsx
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/40 font-mono">TypeScript</span>
          <span className="text-xs text-white/40 font-mono">UTF-8</span>
        </div>
      </motion.div>

      <div className="flex-1 relative">
        <Editor
          height="100%"
          defaultLanguage="typescript"
          value={code}
          onChange={handleChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: 'JetBrains Mono, monospace',
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            readOnly: false,
            automaticLayout: true,
            padding: { top: 16, bottom: 16 },
            wordWrap: 'on',
            tabSize: 2,
          }}
          loading={
            <div className="flex items-center justify-center h-full text-white/60 font-mono">
              Loading editor...
            </div>
          }
        />
      </div>
    </GlassCard>
  );
}
