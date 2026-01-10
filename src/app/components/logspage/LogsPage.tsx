'use client';

import { useState, useEffect, useCallback } from 'react';
import { Terminal, RefreshCw, Server, Globe, Database, Bot, AlertCircle, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const APP_CONFIG: Record<string, { name: string; icon: LucideIcon; type: string }> = {
  "1764820069800": { name: "Bot TRP", icon: Bot, type: "bot" },
  "a-p-i-trindade": { name: "API", icon: Server, type: "api" },
  "trindadep": { name: "Site", icon: Globe, type: "site" },
  "trplavalink": { name: "Lavalink", icon: Database, type: "lavalink" },
  "postgres": { name: "PostgreSQL", icon: Database, type: "database" },
};

interface LogData {
  id: string;
  terminal: {
    big: string;
    small: string;
    url?: string; 
  };
}

interface LogsResponse {
  status: string;
  message: string;
  apps: LogData | LogData[] | Record<string, LogData>;
}

export default function LogsPage() {
  const [logs, setLogs] = useState<LogData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/logs');
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data: LogsResponse = await response.json();

      if (data.status === 'error') {
        throw new Error(data.message || 'Failed to fetch logs');
      }

      let parsedLogs: LogData[] = [];

      if (Array.isArray(data.apps)) {
        parsedLogs = data.apps;
      } else if (data.apps && typeof data.apps === 'object') {
        const appsObj = data.apps as Record<string, unknown>;
        if ('id' in appsObj && typeof appsObj.id === 'string') {
           parsedLogs = [data.apps as LogData];
        } else {
           parsedLogs = Object.values(data.apps) as LogData[];
        }
      }
      setLogs(parsedLogs);
      if (!selectedAppId && parsedLogs.length > 0) {
        const knownApp = parsedLogs.find(log => APP_CONFIG[log.id]);
        setSelectedAppId(knownApp ? knownApp.id : parsedLogs[0].id);
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [selectedAppId]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const selectedLog = logs.find(log => log.id === selectedAppId);

  const getAppInfo = (id: string) => {
    return APP_CONFIG[id] || { name: `App ${id}`, icon: Terminal, type: 'unknown' };
  };

  const renderColoredLogs = (logText: string) => {
    if (!logText) return <span className="text-zinc-500 italic">No logs available.</span>;

    return logText.split('\n').map((line, index) => {
      let className = "text-zinc-300";
      
      const lowerLine = line.toLowerCase();
      if (lowerLine.match(/error|fail|exception|fatal/)) {
        className = "text-red-400";
      } else if (lowerLine.match(/warn|warning/)) {
        className = "text-yellow-400";
      } else if (lowerLine.match(/success|connected|started|ready|listening/)) {
        className = "text-emerald-400";
      } else if (lowerLine.match(/info|debug/)) {
        className = "text-blue-400";
      }

      const timestampRegex = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z|\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2})(.*)/;
      const match = line.match(timestampRegex);

      if (match) {
        return (
          <div key={index} className={cn("whitespace-pre-wrap font-mono text-sm leading-relaxed", selectedAppId === "1764820069800" ? "break-all" : "wrap-break-word")}>
            <span className="text-zinc-500 select-none mr-2">{match[1]}</span>
            <span className={className}>{match[2]}</span>
          </div>
        );
      }

      return (
        <div key={index} className={cn("whitespace-pre-wrap font-mono text-sm leading-relaxed", className, selectedAppId === "1764820069800" ? "break-all" : "wrap-break-word")}>
          {line}
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] w-full bg-zinc-950 text-zinc-100 p-4 rounded-lg border border-zinc-800">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Terminal className="w-5 h-5 text-emerald-500" />
          System Logs
        </h2>
        <button
          onClick={fetchLogs}
          disabled={loading}
          className="p-2 hover:bg-zinc-800 rounded-full transition-colors disabled:opacity-50"
          title="Refresh Logs"
        >
          <RefreshCw className={cn("w-5 h-5", loading && "animate-spin")} />
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-md mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      <div className="flex flex-1 gap-4 overflow-hidden">
        <div className="w-64 flex flex-col gap-2 overflow-y-auto pr-2 border-r border-zinc-800 custom-scrollbar">
          {logs.length === 0 && !loading && !error && (
            <div className="text-zinc-500 text-sm text-center py-4">No apps found</div>
          )}
          
          {logs.map((log) => {
            const info = getAppInfo(log.id);
            const Icon = info.icon;
            const isSelected = selectedAppId === log.id;

            return (
              <button
                key={log.id}
                onClick={() => setSelectedAppId(log.id)}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-md text-left transition-all",
                  isSelected 
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                    : "hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200"
                )}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <div className="flex flex-col overflow-hidden">
                  <span className="font-medium truncate">{info.name}</span>
                  <span className="text-xs opacity-60 truncate">{log.id}</span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex-1 bg-zinc-900/50 rounded-md border border-zinc-800 overflow-hidden flex flex-col">
          {selectedLog ? (
            <>
              <div className="bg-zinc-900 border-b border-zinc-800 p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-zinc-400">
                    {getAppInfo(selectedLog.id).name}
                  </span>
                  {selectedLog.terminal.url && (
                    <span className="text-xs bg-zinc-800 px-2 py-0.5 rounded text-zinc-500">
                      {selectedLog.terminal.url}
                    </span>
                  )}
                </div>
                <span className="text-xs text-zinc-600">
                  Last updated: {new Date().toLocaleTimeString()}
                </span>
              </div>
              <div className="flex-1 overflow-auto p-4 bg-zinc-950/50 custom-scrollbar">
                {renderColoredLogs(selectedLog.terminal.big || selectedLog.terminal.small)}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-zinc-500 flex-col gap-2">
              <Terminal className="w-12 h-12 opacity-20" />
              <p>Select an application to view logs</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
