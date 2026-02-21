/**
 * Code Editor — Monaco with real-time keystroke tracking
 */
import React, { useCallback, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { codingApi } from '@/lib/api';
import { Button } from './Button';
import { Play, CheckCircle, XCircle, Terminal } from 'lucide-react';

interface CodeEditorProps {
  sessionId: number;
  language: string;
  value: string;
  onChange: (value: string) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  sessionId,
  language,
  value,
  onChange,
}) => {
  const [isExecuting, setIsExecuting] = React.useState(false);
  const [output, setOutput] = React.useState('');
  const [error, setError] = React.useState('');
  const typingTimeout = useRef<number | undefined>(undefined);

  const handleChange = useCallback(
    (newValue: string | undefined) => {
      if (newValue === undefined) return;
      onChange(newValue);

      if (typingTimeout.current) clearTimeout(typingTimeout.current);
      typingTimeout.current = window.setTimeout(() => {
        codingApi
          .createEvent({
            session_id: sessionId,
            event_type: 'keystroke',
            code_snapshot: newValue,
            language,
          })
          .catch((err: unknown) =>
            console.error('Failed to track coding event:', err)
          );
      }, 1000);
    },
    [sessionId, onChange, language]
  );

  const handleExecute = async () => {
    setIsExecuting(true);
    setOutput('');
    setError('');

    try {
      const result = await codingApi.executeCode(sessionId, value, language);
      if (result.error) setError(result.error);
      else setOutput(result.output || 'Code executed successfully');

      await codingApi.createEvent({
        session_id: sessionId,
        event_type: 'execute',
        code_snapshot: value,
        language,
        execution_output: result.output,
        execution_error: result.error,
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Execution failed');
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="h-full flex flex-col rounded-lg overflow-hidden border border-neeti-border">
      {/* Editor */}
      <div className="flex-1 relative min-h-0">
        <Editor
          height="100%"
          language={getMonacoLanguage(language)}
          value={value}
          onChange={handleChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "'IBM Plex Mono', Consolas, monospace",
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 16, bottom: 16 },
            wordWrap: 'on',
            tabSize: 2,
            quickSuggestions: true,
            suggestOnTriggerCharacters: true,
          }}
        />
      </div>

      {/* Output Panel */}
      <div className="flex-shrink-0 border-t border-neeti-border bg-neeti-surface/60">
        <div className="px-4 py-2 border-b border-neeti-border flex items-center justify-between">
          <span className="inline-flex items-center gap-2 text-sm font-medium text-ink-secondary">
            <Terminal className="w-3.5 h-3.5" />
            Output
          </span>
          <Button
            size="sm"
            variant="primary"
            onClick={handleExecute}
            disabled={isExecuting || !value}
          >
            <Play className="w-3 h-3" />
            {isExecuting ? 'Running…' : 'Run Code'}
          </Button>
        </div>

        <div className="p-4 h-32 overflow-y-auto font-mono text-sm">
          {output && (
            <div className="flex items-start gap-2 text-status-success">
              <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <pre className="whitespace-pre-wrap">{output}</pre>
            </div>
          )}
          {error && (
            <div className="flex items-start gap-2 text-status-critical">
              <XCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <pre className="whitespace-pre-wrap">
                {typeof error === 'string' ? error : String(error)}
              </pre>
            </div>
          )}
          {!output && !error && (
            <p className="text-ink-ghost">Click "Run Code" to execute your code</p>
          )}
        </div>
      </div>
    </div>
  );
};

function getMonacoLanguage(lang: string): string {
  const map: Record<string, string> = {
    typescript: 'typescript',
    javascript: 'javascript',
    python: 'python',
    java: 'java',
    cpp: 'cpp',
    go: 'go',
    rust: 'rust',
    csharp: 'csharp',
    ruby: 'ruby',
    php: 'php',
  };
  return map[lang] || 'typescript';
}
