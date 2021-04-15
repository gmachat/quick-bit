
import React, { useEffect, useState } from "react";
import {
  ClientConfig,
  IAgoraRTCRemoteUser,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
} from "agora-rtc-sdk-ng";
import {
  
  AgoraVideoPlayer,
  createClient,
  createMicrophoneAndCameraTracks,
} from "agora-rtc-react";

import VideoCall from './components/VideoCall/VideoCall'
import ChannelForm from './components/ChannelForm/ChannelForm'


const config = { 
  mode: "rtc", codec: "vp8",
};


const appId = process.env.APP_ID; 


const App = () => {
  const [inCall, setInCall] = useState(false);
  const [channelName, setChannelName] = useState("");
  const useClient = createClient(config);
  const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();


  const userLogInChime = (client) => {

  }

  return (
    <div>
      VideoChatApp
      <h1 className="heading">Connectify</h1>
      {inCall ? (
        <VideoCall setInCall={setInCall} channelName={channelName} useClient={useClient} useMicrophoneAndCameraTracks={useMicrophoneAndCameraTracks} appId={appId} AgoraVideoPlayer={AgoraVideoPlayer} userLogInChime={userLogInChime}/>
      ) : (
        <ChannelForm appId={appId} setInCall={setInCall} setChannelName={setChannelName} />
      )}
    </div>
  );
};

export default App;
