import React, { useEffect, useState } from "react";
import Videos from '../Videos/Videos'
import Controls from '../Videos/Controls'

const VideoCall = ({
  setInCall,
  channelName,
  useClient,
  useMicrophoneAndCameraTracks,
  appId,
  AgoraVideoPlayer,
  userLogInChime
}) => {
  const BASE_URL = 'https://agora-video-app-backend.herokuapp.com'

  const [users, setUsers] = useState([]);
  const [start, setStart] = useState(false);
  const client = useClient();
  const { ready, tracks } = useMicrophoneAndCameraTracks();

  useEffect(() => {
    // function to initialise the SDK
    let init = async (name) => {
      client.on("user-published", async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        // console.log("subscribe success");
        if (mediaType === "video") {
          setUsers((prevUsers) => {
            return [...prevUsers, user];
          });
        }
        if (mediaType === "audio") {
          user.audioTrack?.play();
        }
      });

      client.on("user-unpublished", (user, type) => {
        // console.log("unpublished", user, type);
        if (type === "audio") {
          user.audioTrack?.stop();
        }
        if (type === "video") {
          setUsers((prevUsers) => {
            return prevUsers.filter((User) => User.uid !== user.uid);
          });
        }
      });

      client.on("user-left", (user) => {
        // console.log("leaving", user);
        setUsers((prevUsers) => {
          return prevUsers.filter((User) => User.uid !== user.uid);
        });
      });
      try{
        const config = {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
          }
        };
        let tokenGen = await fetch(`${BASE_URL}/access_token?channelName=${name}`, config)
        tokenGen = await tokenGen.json()
        await client.join(appId, name, tokenGen.token, null);
        userLogInChime(client)
      }catch(err){
        console.log(err)
      }

      if (tracks) await client.publish([tracks[0], tracks[1]]);
      setStart(true);

    };

    if (ready && tracks) {
      // console.log("init ready");
      init(channelName);
    }

  }, [channelName, client, ready, tracks])

  return (
    <div className="App">
      {ready && tracks && (
        <Controls tracks={tracks} setStart={setStart} setInCall={setInCall} useClient={useClient}/>
      )}
      {start && tracks && <Videos users={users} tracks={tracks} AgoraVideoPlayer={AgoraVideoPlayer}/>}
    </div>
  );
};

export default VideoCall