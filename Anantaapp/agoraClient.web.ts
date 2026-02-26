// Web implementation with cross-platform stream sharing
const isBrowser = typeof window !== 'undefined';
let localStream: MediaStream | null = null;
let currentRole: string = 'viewer';
let eventHandlers: any = null;
let currentChannelName: string = '';

// Cross-platform stream sharing using localStorage and polling
const streamStore = {
  setHostStream: (channelName: string, isActive: boolean) => {
    if (isBrowser) {
      localStorage.setItem(`host_stream_${channelName}`, JSON.stringify({
        active: isActive,
        timestamp: Date.now()
      }));
      // Trigger storage event for same-origin tabs
      window.dispatchEvent(new StorageEvent('storage', {
        key: `host_stream_${channelName}`,
        newValue: JSON.stringify({ active: isActive, timestamp: Date.now() })
      }));
    }
  },
  getHostStream: (channelName: string) => {
    if (isBrowser) {
      const data = localStorage.getItem(`host_stream_${channelName}`);
      if (data) {
        const parsed = JSON.parse(data);
        // Check if stream is recent (within 30 seconds)
        if (Date.now() - parsed.timestamp < 30000) {
          return parsed.active;
        }
      }
    }
    return false;
  }
};

export async function createAgoraEngine(appId: string): Promise<any> {
  if (!isBrowser) {
    return null;
  }
  
  return {
    initialize: () => Promise.resolve(),
    enableVideo: async () => {
      if (currentRole === 'host') {
        try {
          localStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
          });
          // Mark host as active
          streamStore.setHostStream(currentChannelName, true);
        } catch (e) {
          console.error('Failed to get media stream:', e);
        }
      }
    },
    setChannelProfile: () => Promise.resolve(),
    setClientRole: (role: any) => {
      currentRole = role === 1 ? 'host' : 'viewer';
      return Promise.resolve();
    },
    startPreview: () => Promise.resolve(),
    registerEventHandler: (handlers: any) => {
      eventHandlers = handlers;
      setTimeout(() => {
        handlers.onJoinChannelSuccess?.();
        if (currentRole === 'viewer') {
          // Check for host stream periodically
          const checkHostStream = () => {
            if (streamStore.getHostStream(currentChannelName)) {
              handlers.onUserJoined?.(null, 12345);
            } else {
              setTimeout(checkHostStream, 1000);
            }
          };
          setTimeout(checkHostStream, 500);
        }
      }, 1000);
    },
    joinChannel: (token: string, channelName: string) => {
      currentChannelName = channelName;
      return Promise.resolve();
    },
    muteLocalAudioStream: async (mute: boolean) => {
      if (localStream) {
        const audioTracks = localStream.getAudioTracks();
        audioTracks.forEach(track => {
          track.enabled = !mute;
        });
      }
    },
    switchCamera: () => Promise.resolve(),
    leaveChannel: () => {
      if (currentRole === 'host') {
        streamStore.setHostStream(currentChannelName, false);
      }
      return Promise.resolve();
    },
    release: () => {
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        localStream = null;
      }
      if (currentRole === 'host') {
        streamStore.setHostStream(currentChannelName, false);
      }
      eventHandlers = null;
      return Promise.resolve();
    }
  };
}

export function RtcSurfaceView({ canvas, style }: { canvas: { uid: number }, style: any }) {
  if (!isBrowser) {
    return null;
  }
  
  const React = require('react');
  const videoRef = React.useRef<HTMLVideoElement>(null);
  
  React.useEffect(() => {
    if (!videoRef.current) return;
    
    if (canvas.uid === 0 && localStream && currentRole === 'host') {
      // Host's own video
      videoRef.current.srcObject = localStream;
      videoRef.current.play().catch(e => console.error('Video play failed:', e));
    } else if (canvas.uid !== 0 && currentRole === 'viewer') {
      // Viewer - show host video simulation
      const createHostVideoSimulation = () => {
        const canvas2d = document.createElement('canvas');
        canvas2d.width = 640;
        canvas2d.height = 480;
        const ctx = canvas2d.getContext('2d');
        
        let frame = 0;
        const drawFrame = () => {
          if (ctx && streamStore.getHostStream(currentChannelName)) {
            // Create dynamic background
            const gradient = ctx.createLinearGradient(0, 0, 640, 480);
            gradient.addColorStop(0, `hsl(${(frame * 1.5) % 360}, 60%, 25%)`);
            gradient.addColorStop(1, `hsl(${(frame * 1.5 + 120) % 360}, 60%, 15%)`);
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 640, 480);
            
            // Add pulsing effect
            const pulse = Math.sin(frame * 0.1) * 0.3 + 0.7;
            ctx.globalAlpha = pulse;
            
            // Host indicator
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 32px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('🎥 LIVE', 320, 180);
            
            ctx.font = 'bold 24px Arial';
            ctx.fillText('', 320, 220);
            
            ctx.font = '18px Arial';
            ctx.fillStyle = '#ff4444';
            ctx.fillText('● STREAMING NOW', 320, 260);
            
            ctx.globalAlpha = 1;
            frame++;
          } else {
            // No host stream
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(0, 0, 640, 480);
            ctx.fillStyle = '#666';
            ctx.font = '20px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Waiting for host...', 320, 240);
          }
          requestAnimationFrame(drawFrame);
        };
        drawFrame();
        
        const stream = canvas2d.captureStream(30);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(e => console.error('Video play failed:', e));
        }
      };
      
      createHostVideoSimulation();
    }
  }, [canvas.uid, localStream, currentRole]);
  
  return React.createElement('video', {
    ref: videoRef,
    autoPlay: true,
    muted: currentRole === 'host',
    playsInline: true,
    style: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      backgroundColor: '#000',
      ...style
    }
  });
}

export const ChannelProfileType = {
  ChannelProfileLiveBroadcasting: 1
};

export const ClientRoleType = {
  ClientRoleBroadcaster: 1,
  ClientRoleAudience: 2
};
