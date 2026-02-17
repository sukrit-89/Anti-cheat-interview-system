/**
 * Code Editor Component with real-time sync
 */
import React, { useCallback, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { codingApi } from '@/lib/api';
import { Button } from './Button';
import { Play, CheckCircle, XCircle } from 'lucide-react';

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
    const [output, setOutput] = React.useState<string>('');
    const [error, setError] = React.useState<string>('');
    const typingTimeoutRef = useRef<number | undefined>(undefined);

    const handleChange = useCallback(
        (newValue: string | undefined) => {
            if (newValue !== undefined) {
                onChange(newValue);

                // Debounce coding event tracking
                if (typingTimeoutRef.current) {
                    clearTimeout(typingTimeoutRef.current);
                }

                typingTimeoutRef.current = window.setTimeout(() => {
                    // Send keystroke event to backend
                    codingApi
                        .createEvent({
                            session_id: sessionId,
                            event_type: 'keystroke',
                            code_snapshot: newValue,
                            language,
                        })
                        .catch((err: unknown) => console.error('Failed to track coding event:', err));
                }, 1000);
            }
        },
        [sessionId, onChange, language]
    );

    const handleExecute = async () => {
        setIsExecuting(true);
        setOutput('');
        setError('');

        try {
            const result = await codingApi.executeCode(sessionId, value, language);
            
            if (result.error) {
                setError(result.error);
            } else {
                setOutput(result.output || 'Code executed successfully');
            }

            // Track execution event
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
        <div className="h-full flex flex-col">
            <div className="flex-1 relative">
                <Editor
                    height="100%"
                    language={getMonacoLanguage(language)}
                    value={value}
                    onChange={handleChange}
                    theme="vs-dark"
                    options={{
                        minimap: { enabled: false },
                        fontSize: 14,
                        fontFamily: 'JetBrains Mono, Consolas, monospace',
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
            <div className="flex-shrink-0 border-t border-neural-border bg-neural-surface/50">
                <div className="px-4 py-2 border-b border-neural-border flex items-center justify-between">
                    <span className="text-sm font-medium text-neural-text-secondary">
                        Output
                    </span>
                    <Button
                        size="sm"
                        variant="primary"
                        onClick={handleExecute}
                        disabled={isExecuting || !value}
                        className="flex items-center gap-2"
                    >
                        <Play className="w-3 h-3" />
                        {isExecuting ? 'Running...' : 'Run Code'}
                    </Button>
                </div>

                <div className="p-4 h-32 overflow-y-auto font-mono text-sm">
                    {output && (
                        <div className="flex items-start gap-2 text-green-400">
                            <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <pre className="whitespace-pre-wrap">{output}</pre>
                        </div>
                    )}
                    {error && (
                        <div className="flex items-start gap-2 text-red-400">
                            <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <pre className="whitespace-pre-wrap">{typeof error === 'string' ? error : String(error)}</pre>
                        </div>
                    )}
                    {!output && !error && (
                        <div className="text-neural-text-tertiary">
                            Click "Run Code" to execute your code
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

function getMonacoLanguage(lang: string): string {
    const languageMap: Record<string, string> = {
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
    return languageMap[lang] || 'typescript';
}
