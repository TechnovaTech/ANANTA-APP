import { Platform } from 'react-native';

// Platform-specific imports
let agoraClient: any;

if (Platform.OS === 'web') {
  agoraClient = require('./agoraClient.web');
} else {
  agoraClient = require('./agoraClient.native');
}

export const createAgoraEngine = agoraClient.createAgoraEngine;
export const RtcSurfaceView = agoraClient.RtcSurfaceView;
export const ChannelProfileType = agoraClient.ChannelProfileType;
export const ClientRoleType = agoraClient.ClientRoleType;