// Real Agora Web SDK implementation
const isBrowser = typeof window !== 'undefined';
let agoraClient: any = null;
let localVideoTrack: any = null;
let localAudioTrack: any = null;
let remoteUsers: Map<number, { videoTrack?: any, audioTrack?: any }> = new Map();
let eventHandlers: any = null;
let AgoraRTC: any = null;
let storedAppId: string = '';

export async function createAgoraEngine(appId: string): Promise<any> {
  if (!isBrowser) return null;
  
  console.log('=== CREATE AGORA ENGINE ===');
  console.log('Received appId:', appId);
  console.log('appId type:', typeof appId);
  console.log('appId length:', appId?.length);
  console.log('===========================');
  
  // Handle string "undefined" or "null"
  if (!appId || appId === 'undefined' || appId === 'null' || appId.trim() === '') {
    console.error('INVALID APP ID:', appId);
    throw new Error(`Invalid Agora App ID: "${appId}". Please check backend configuration.`);
  }
  
  storedAppId = appId.trim();
  console.log('Stored appId:', storedAppId);
  
  if (!AgoraRTC) {
    AgoraRTC = (await import('agora-rtc-sdk-ng')).default;
  }
  
  agoraClient = AgoraRTC.createClient({ mode: 'live', codec: 'vp8' });
  
  agoraClient.on('user-published', async (user, mediaType) => {
    await agoraClient!.subscribe(user, mediaType);
    
    if (mediaType === 'video') {
      remoteUsers.set(user.uid as number, { 
        ...remoteUsers.get(user.uid as number), 
        videoTrack: user.videoTrack 
      });
      eventHandlers?.onUserJoined?.(null, user.uid);
    }
    if (mediaType === 'audio' && user.audioTrack) {
      remoteUsers.set(user.uid as number, { 
        ...remoteUsers.get(user.uid as number), 
        audioTrack: user.audioTrack 
      });
      user.audioTrack.play();
    }
  });
  
  agoraClient.on('user-unpublished', (user) => {
    remoteUsers.delete(user.uid as number);
    eventHandlers?.onUserOffline?.(user.uid);
  });
  
  return {
    initialize: () => Promise.resolve(),
    enableVideo: async () => {
      try {
        localVideoTrack = await AgoraRTC.createCameraVideoTrack();
        localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
      } catch (error: any) {
        console.error('Camera/Mic access error:', error);
        if (error.code === 'NOT_READABLE') {
          throw new Error('Camera is in use by another app. Please close other apps using camera and try again.');
        }
        throw error;
      }
    },
    setChannelProfile: () => Promise.resolve(),
    setClientRole: async (role: any) => {
      await agoraClient?.setClientRole(role === 1 ? 'host' : 'audience');
    },
    startPreview: () => Promise.resolve(),
    registerEventHandler: (handlers: any) => {
      eventHandlers = handlers;
    },
    joinChannel: async (token: string, channelName: string, uid?: number, options?: any) => {
      try {
        const finalAppId = storedAppId || appId;
        console.log('Joining channel:', { appId: finalAppId, channelName, token: token?.substring(0, 20), uid });
        
        if (!finalAppId || finalAppId === 'undefined' || finalAppId === 'null') {
          throw new Error('App ID is not set. Cannot join channel.');
        }
        
        await agoraClient?.join(finalAppId, channelName, token || null, uid || null);
        if (localVideoTrack && localAudioTrack) {
          await agoraClient?.publish([localVideoTrack, localAudioTrack]);
        }
        eventHandlers?.onJoinChannelSuccess?.();
      } catch (error: any) {
        console.error('Join channel error:', error);
        
        // Check if it's an invalid App ID error
        if (error?.message?.includes('invalid vendor key') || error?.message?.includes('can not find appid')) {
          const helpMessage = 'Invalid Agora App ID. Please:\n' +
            '1. Go to https://console.agora.io/\n' +
            '2. Get your App ID and Certificate\n' +
            '3. Update backend/src/main/resources/application.properties\n' +
            '4. Restart the backend server';
          console.error('\n' + helpMessage);
          eventHandlers?.onError?.(new Error(helpMessage));
        } else {
          eventHandlers?.onError?.(error);
        }
        throw error;
      }
    },
    muteLocalAudioStream: async (mute: boolean) => {
      await localAudioTrack?.setEnabled(!mute);
    },
    switchCamera: () => Promise.resolve(),
    leaveChannel: async () => {
      await agoraClient?.leave();
    },
    release: async () => {
      localVideoTrack?.close();
      localAudioTrack?.close();
      localVideoTrack = null;
      localAudioTrack = null;
      remoteUsers.clear();
      eventHandlers = null;
    }
  };
}

export function RtcSurfaceView({ canvas, style }: { canvas: { uid: number }, style: any }) {
  if (!isBrowser) return null;
  
  const React = require('react');
  const containerRef = React.useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    if (!containerRef.current) return;
    
    if (canvas.uid === 0 && localVideoTrack) {
      localVideoTrack.play(containerRef.current);
    } else if (canvas.uid !== 0) {
      const remoteUser = remoteUsers.get(canvas.uid);
      if (remoteUser?.videoTrack) {
        remoteUser.videoTrack.play(containerRef.current);
      }
    }
    
    return () => {
      if (canvas.uid === 0) {
        localVideoTrack?.stop();
      } else {
        const remoteUser = remoteUsers.get(canvas.uid);
        remoteUser?.videoTrack?.stop();
      }
    };
  }, [canvas.uid, localVideoTrack, remoteUsers]);
  
  return React.createElement('div', {
    ref: containerRef,
    style: {
      width: '100%',
      height: '100%',
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
