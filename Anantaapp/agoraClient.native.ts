import type { RtcEngine } from 'react-native-agora';
import Agora from 'react-native-agora';

export async function createAgoraEngine(appId: string): Promise<RtcEngine | null> {
  const engine = await Agora.create(appId);
  return engine;
}

