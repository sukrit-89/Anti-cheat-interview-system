'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Play, RotateCcw } from 'lucide-react'

const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

interface CodeEditorProps {
  language?: string
  onChange?: (value: string) => void
  defaultValue?: string
}

export function CodeEditor({ language = 'python', onChange, defaultValue = '' }: CodeEditorProps) {
  const [code, setCode] = useState(defaultValue || getDefaultCode(language))
  const [output, setOutput] = useState('')

  const handleEditorChange = (value: string | undefined) => {
    const newCode = value || ''
    setCode(newCode)
    onChange?.(newCode)
  }

  const handleRun = () => {
    // Simulate code execution
    setOutput('>>> Code execution simulated\n>>> In production, this would execute in a sandbox\n>>> Output: Hello, World!')
  }

  const handleReset = () => {
    setCode(getDefaultCode(language))
    setOutput('')
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Code Editor</span>
          <select
            className="rounded bg-white/10 px-2 py-1 text-sm"
            value={language}
            onChange={(e) => {
              const newLang = e.target.value
              setCode(getDefaultCode(newLang))
            }}
          >
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </Button>
          <Button size="sm" onClick={handleRun}>
            <Play className="h-4 w-4 mr-1" />
            Run Code
          </Button>
        </div>
      </div>

      <div className="flex-1">
        <Editor
          height="100%"
          defaultLanguage={language}
          language={language}
          value={code}
          onChange={handleEditorChange}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            wordWrap: 'on',
          }}
        />
      </div>

      {output && (
        <div className="border-t border-white/10 bg-black/50 p-4">
          <div className="text-xs text-white/40 mb-1">Output:</div>
          <pre className="text-sm font-mono text-green-400">{output}</pre>
        </div>
      )}
    </div>
  )
}

function getDefaultCode(language: string): string {
  const templates: Record<string, string> = {
    python: `# Write your Python code here
def solution():
    # Your implementation
    return "Hello, World!"

if __name__ == "__main__":
    print(solution())`,
    
    javascript: `// Write your JavaScript code here
function solution() {
    // Your implementation
    return "Hello, World!";
}

console.log(solution());`,
    
    typescript: `// Write your TypeScript code here
function solution(): string {
    // Your implementation
    return "Hello, World!";
}

console.log(solution());`,
    
    java: `// Write your Java code here
public class Solution {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
    
    cpp: `// Write your C++ code here
#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`
  }
  
  return templates[language] || templates.python
}
