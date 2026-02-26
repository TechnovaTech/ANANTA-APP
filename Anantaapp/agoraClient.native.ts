import {
  createAgoraRtcEngine,
  ChannelProfileType,
  ClientRoleType,
  type IRtcEngine,
  RtcSurfaceView,
} from 'react-native-agora';

export async function createAgoraEngine(appId: string): Promise<IRtcEngine | null> {
  try {
    const engine = createAgoraRtcEngine();
    engine.initialize({ appId });
    return engine;
  } catch (e) {
    console.error('Agora engine creation failed:', e);
    return null;
  }
}

export { RtcSurfaceView, ChannelProfileType, ClientRoleType };
