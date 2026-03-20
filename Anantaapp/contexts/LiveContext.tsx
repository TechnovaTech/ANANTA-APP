import React, { createContext, useContext, useState } from 'react';

export type LiveSession = {
  type: 'video' | 'audio';
  title: string;
  hostUsername: string;
  sessionId: string;
  routeParams: Record<string, string>;
  endLive: () => Promise<void>;
  startedAt: number;
};

type LiveContextType = {
  liveSession: LiveSession | null;
  isMinimized: boolean;
  liveEngine: any | null;
  startLive: (session: LiveSession) => void;
  minimizeLive: () => void;
  expandLive: () => void;
  clearLive: () => void;
  setLiveEngine: (engine: any | null) => void;
};

const LiveContext = createContext<LiveContextType>({
  liveSession: null,
  isMinimized: false,
  liveEngine: null,
  startLive: () => {},
  minimizeLive: () => {},
  expandLive: () => {},
  clearLive: () => {},
  setLiveEngine: () => {},
});

export const useLive = () => useContext(LiveContext);

export function LiveProvider({ children }: { children: React.ReactNode }) {
  const [liveSession, setLiveSession] = useState<LiveSession | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [liveEngine, setLiveEngine] = useState<any | null>(null);

  const startLive = (session: LiveSession) => {
    setLiveSession(prev => {
      if (prev && prev.sessionId === session.sessionId && prev.startedAt) {
        return { ...session, startedAt: prev.startedAt };
      }
      return { ...session, startedAt: session.startedAt || Date.now() };
    });
    setIsMinimized(false);
  };
  const minimizeLive = () => setIsMinimized(true);
  const expandLive = () => setIsMinimized(false);
  const clearLive = () => {
    setLiveSession(null);
    setIsMinimized(false);
  };

  return (
    <LiveContext.Provider value={{ liveSession, isMinimized, liveEngine, startLive, minimizeLive, expandLive, clearLive, setLiveEngine }}>
      {children}
    </LiveContext.Provider>
  );
}
