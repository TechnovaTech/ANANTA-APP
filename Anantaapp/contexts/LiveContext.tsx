import React, { createContext, useContext, useState } from 'react';

export type LiveSession = {
  type: 'video' | 'audio';
  title: string;
  hostUsername: string;
  sessionId: string;
  routeParams: Record<string, string>;
  endLive: () => Promise<void>;
};

type LiveContextType = {
  liveSession: LiveSession | null;
  isMinimized: boolean;
  startLive: (session: LiveSession) => void;
  minimizeLive: () => void;
  expandLive: () => void;
  clearLive: () => void;
};

const LiveContext = createContext<LiveContextType>({
  liveSession: null,
  isMinimized: false,
  startLive: () => {},
  minimizeLive: () => {},
  expandLive: () => {},
  clearLive: () => {},
});

export const useLive = () => useContext(LiveContext);

export function LiveProvider({ children }: { children: React.ReactNode }) {
  const [liveSession, setLiveSession] = useState<LiveSession | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);

  const startLive = (session: LiveSession) => {
    setLiveSession(session);
    setIsMinimized(false);
  };
  const minimizeLive = () => setIsMinimized(true);
  const expandLive = () => setIsMinimized(false);
  const clearLive = () => {
    setLiveSession(null);
    setIsMinimized(false);
  };

  return (
    <LiveContext.Provider value={{ liveSession, isMinimized, startLive, minimizeLive, expandLive, clearLive }}>
      {children}
    </LiveContext.Provider>
  );
}
