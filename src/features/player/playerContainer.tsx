import { useEffect, useState, useRef } from "react";
import { PlayerView } from "./playerView";
import { ProgressProps } from "react-video-player-extended";
import { Root, Track } from "../analyzer/analytical.entity";
import { Marker } from "react-video-player-extended/dist/marker";
import { TimelineComponent } from "../timeline/timelineContainer";
import { TimelineOptions, TimelineRowStyle } from "animation-timeline-js";
import { createKeyframePairs } from "../timeline/timelineutils";
import {
  ExtendedMarker,
  ExtendedTimelineRow,
  ExtendedTimelineKeyframe,
  keyTypes,
} from "./interfaces/interfaces";
import { downloadAttachment } from "./utils.tsx/downloader";

// no touchy touchy , will breaky breaky  -_-

const PlayerContainer = (): JSX.Element => {
  const [url, _setUrl] = useState<string>(
    "https://media.w3.org/2010/05/bunny/trailer.ogv"
  );
  const [play, setPlay] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.7);
  const [fps, setFps] = useState<number>(30);
  const [video, setVideo] = useState<HTMLVideoElement | null>();
  const [frame, setFrame] = useState<number>(30);
  const [frames, setFrames] = useState<number | null>(null);
  const [meta, setMeta] = useState<Track | null>(null);
  const [markers, setMarkers] = useState<ExtendedMarker[]>();
  const [ids, setIds] = useState<number[]>([]);
  const [duration, setDuration] = useState<number>(0);
  const [selectedClip, setSelectedClip] = useState();
  const [clips, setClips] = useState([]);

  // Position of Time Dragger | ms
  const [position, setPosition] = useState<number>(0); // in ms
  // Current position of player
  const [ct, setCT] = useState<number>(0); // in ms

  // Sync timeline with player
  const [sync, setSync] = useState<boolean>(false);

  // Timeline keys
  const [rows, setRows] = useState<ExtendedTimelineRow[]>([]);

  // Callback helpers
  const handlePlay = (): void => setPlay(true);
  const handlePause = (): void => setPlay(false);
  const handleVolume = (value: number): void => setVolume(value);
  //const handleFps = (value: number): void => setFps(value);

  const handleByFrame = (frame: number) => {
    video && (video.currentTime = frame * (1 / fps));
  };

  // time : milliSeconds
  const handleTimeDragger = (time: number) => {
    setPosition(time);
  };

  // ms / 1000
  useEffect(() => {
    video && (video.currentTime = position / 1000);
  }, [position]);

  const selectedClipRef = useRef(null);
  selectedClipRef.current = selectedClip;

  const handleOnProgress = (_e: Event, _progress: ProgressProps): void => {
    // setCT(_progress.currentTime * 1000);

    if (
      selectedClipRef.current &&
      !!(_progress?.currentTime >= selectedClipRef.current?.to?.time)
    ) {
      setPlay(false);
    }
  };

  const handleSync = () => setSync(!sync);

  const handleVideo = (event: React.SyntheticEvent<HTMLVideoElement, Event>) =>
    setVideo(event.currentTarget);

  const handleMeta = async () => {
    const res = await fetch("http://localhost:3000/", {
      method: "POST",
      headers: { "Content-Type": "application/json", mode: "cors" },
      body: JSON.stringify({ url: url }),
    });

    const data: Root = await res.json();

    setMeta(data.media.track[1]);
    data.media.track[1].FrameRate &&
      setFps(parseInt(data.media.track[1].FrameRate));
    data.media.track[1].FrameRate &&
      setFrames(parseInt(data.media.track[1].FrameCount));

    setDuration(parseFloat(data.media.track[1].Duration));
  };

  const handleMarkers = (marker: Marker) => {
    const extendedMarker: ExtendedMarker = {
      type: item,
      ...marker,
    };

    setMarkers((prev) => [...(prev || []), extendedMarker]);
  };

  useEffect(() => {
    // prep for timeline

    if (markers) {
      const keyframes = createKeyframePairs(markers);

      setRows(keyframes || []);
    }
  }, [markers]);

  const removeMarkers = () => {
    ids.forEach((id) => {
      setMarkers((prev) => prev?.filter((marker) => marker.id !== id));
    });
  };

  const handleSelection = (frames: ExtendedTimelineKeyframe[]): void => {
    const idsAr: number[] = frames.map((obj) => parseInt(obj.id));

    setIds(idsAr);
  };

  const options = {
    id: "timeline",
    rowsStyle: {
      height: 100,
    } as TimelineRowStyle,
    snapEnabled: false,
  } as TimelineOptions;

  // pulling metadata n sets when video is loaded
  useEffect(() => {
    handleMeta();
  }, [video]);

  // timeline

  const sideBar: keyTypes[] = ["start", "main", "end"];

  const handleItemSelection = (item: keyTypes) => {
    setItem(item);
  };

  const [item, setItem] = useState<keyTypes>("start");

  const handleTimelineDrag = (keyframes: ExtendedTimelineKeyframe[]) => {
    keyframes.forEach((key) => {
      const { id, val } = key;

      setMarkers((prevState) =>
        prevState?.map((marker) =>
          marker.id.toString() === id ? { ...marker, time: val / 1000 } : marker
        )
      );
      setPosition(val);
    });
  };

  const handleExports = (): void => {
    // setSelectedClip({...markers})
    // downloadAttachment(JSON.stringify(markers, null, 2), "export.json");
    console.log(JSON.stringify(markers, null, 2));

    const result = [];

    for (let i = 0; i < markers.length - 1; i += 2) {
      const fromObj = markers[i];
      const toObj = markers[i + 1];

      result.push({ from: fromObj, to: toObj });
    }
    setClips(result);
    console.log(JSON.stringify(result, null, 2));
  };

  const onPlayClip = (clip) => {
    console.log("cilp", clip.from.time);
    setSelectedClip({
      ...clip,
      from: {
        ...clip?.from,
        time: clip?.from?.time + Math.random() / 1000000,
      },
    });
    setPlay(true);
    // setMarkers([clip?.from, clip?.to]);
  };

  // Key handlers

  const handleMarkRemoval = (ev: KeyboardEvent): void => {
    if (ev.code == "Delete") removeMarkers();
  };

  // Key Events

  useEffect(() => {
    document.addEventListener("keydown", handleMarkRemoval);

    return () => {
      document.removeEventListener("keydown", handleMarkRemoval);
    };
  }, [handleMarkRemoval]);

  return (
    <>
      {/* <PlayerView
        url={url}
        isPlaying={play}
        volume={volume}
        markers={markers ?? []}
        onPlay={handlePlay}
        onPause={handlePause}
        onVolume={handleVolume}
        fps={fps}
        onMetaReady={handleVideo}
        onProgress={handleOnProgress}
        onMarkerAdded={handleMarkers}
        timeStart={selectedClip?.from?.time}
      /> */}

      <div style={{ display: "flex", flexDirection: "row" }}>
        <PlayerView
          url={url}
          isPlaying={play}
          volume={volume}
          markers={markers ?? []}
          onPlay={handlePlay}
          onPause={handlePause}
          onVolume={handleVolume}
          fps={fps}
          onMetaReady={handleVideo}
          onProgress={handleOnProgress}
          onMarkerAdded={handleMarkers}
          timeStart={selectedClip?.from?.time}
        />

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "50px",
          }}
        >
          {clips.map((clip, index) => (
            <div key={clip?.from?.id} style={{ marginBottom: "8px" }}>
              <label>{`clipe ${index + 1}`}</label>
              <button onClick={() => onPlayClip(clip)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 3l14 9-14 9V3z" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      <input
        type="text"
        value={frame}
        onChange={(data) => setFrame(parseInt(data.currentTarget.value))}
      />
      <div>{meta?.FrameRate}</div>
      <span> {`/ ${frames}`}</span>
      <span> {`duration :  ${duration}`}</span>
      <button onClick={() => handleByFrame(frame)}>{`shift`}</button>
      <button onClick={() => handleMeta()}>{"get meta"}</button>

      <button onClick={() => removeMarkers()}>{"remove"}</button>
      <button onClick={() => handleExports()}>{"save"}</button>
      <input type="checkbox" onChange={handleSync} />

      <TimelineComponent
        time={sync ? ct : position}
        model={{ rows: rows }}
        options={options}
        onTimeChange={handleTimeDragger}
        rows={sideBar}
        item={item}
        onRowSelected={handleItemSelection}
        onTimelineDrag={handleTimelineDrag}
        onTimelineSelected={handleSelection}
      />

      {/* {clips.map((clip, index) => {
        return (
          <div key={clip?.from?.id}>
            <label style={{ marginRight: "8px" }}>{`clipe ${index + 1}`}</label>
            <button onClick={() => onPlayClip(clip)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 3l14 9-14 9V3z" />
              </svg>
            </button>
          </div>
        );
      })} */}
      <div>{JSON.stringify(clips, null, 2)}</div>
    </>
  );
};

export { PlayerContainer };
