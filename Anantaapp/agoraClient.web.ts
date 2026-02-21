type Noop = (...args: any[]) => void | Promise<void>;

type WebAgoraEngine = {
  enableVideo?: Noop;
  enableAudio?: Noop;
  setChannelProfile?: Noop;
  setClientRole?: Noop;
  joinChannel?: Noop;
  leaveChannel?: Noop;
  destroy?: Noop;
  muteLocalAudioStream?: Noop;
  enableLocalVideo?: Noop;
  switchCamera?: Noop;
  addListener?: (event: string, handler: () => void) => void;
};

export async function createAgoraEngine(appId: string): Promise<WebAgoraEngine> {
  const noop: Noop = async () => {};

  const engine: WebAgoraEngine = {
    enableVideo: noop,
    enableAudio: noop,
    setChannelProfile: noop,
    setClientRole: noop,
    joinChannel: async () => {},
    leaveChannel: noop,
    destroy: noop,
    muteLocalAudioStream: noop,
    enableLocalVideo: noop,
    switchCamera: noop,
    addListener: (event: string, handler: () => void) => {
      if (event === 'JoinChannelSuccess') {
        handler();
      }
    },
  };

  return engine;
}
