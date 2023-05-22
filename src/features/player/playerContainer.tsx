import { useEffect, useState } from "react";
import { PlayerView } from "./playerView";
import { ProgressProps } from "react-video-player-extended";
import { Root, Track } from "../analyzer/analytical.entity";
import { Marker } from "react-video-player-extended/dist/marker";
import { TimelineComponent } from "../timeline/timelineContainer";
import {
  TimelineKeyframe,
  TimelineOptions,
  TimelineRow,
  TimelineRowStyle,
} from "animation-timeline-js";
import { createKeyframePairs } from "../timeline/timelineutils";


// no touchy touchy , will breaky breaky  -_-

interface PlayerProps {
  url: string;
  isPlaying: boolean;
  volume: number;
  fps: number;
  markers: Marker[];

  onPlay: () => void;
  onPause: () => void;
  onVolume: (volume: number) => void;
  onProgress: (e: Event, progress: ProgressProps) => void | null;
  onMetaReady: (event: React.SyntheticEvent<HTMLVideoElement, Event>) => void;
  onMarkerAdded: (marker: Marker) => void;
}

export interface ExtendedTimelineKeyframe extends TimelineKeyframe {
  id: string;
}

export type keyTypes = "start" | "main" | "end";

export interface ExtendedTimelineRow extends TimelineRow {
  type: keyTypes;
  keyframes: ExtendedTimelineKeyframe[] | null;
}

export interface ExtendedMarker extends Marker {
  type: keyTypes;
}

const PlayerContainer = (): JSX.Element => {
  const [url, _setUrl] = useState<string>(
    "https://media.w3.org/2010/05/bunny/trailer.mp4"
  );
  const [play, setPlay] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.7);
  const [fps, setFps] = useState<number>(30);
  const [video, setVideo] = useState<HTMLVideoElement | null>();
  const [frame, setFrame] = useState<number>(30);
  const [frames, setFrames] = useState<number | null>(null);
  const [meta, setMeta] = useState<Track | null>(null);
  const [markers, setMarkers] = useState<ExtendedMarker[]>();
  const [id, _setId] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);

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

  const handleOnProgress = (_e: Event, _progress: ProgressProps): void => {
    setCT(_progress.currentTime * 1000);
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
      //console.log(`keyFranes changed ${JSON.stringify(keyframes)}`);

      // setRows((prev) => [...prev, ...(keyframes || [])]);

      setRows(keyframes || []);

      console.log(`Rows : ${JSON.stringify(rows)}`);
    } else {
      console.log("failed");
    }
  }, [markers]);

  const removeMarkers = () => {
    setMarkers((prev) => prev?.filter((marker) => marker.id !== id));
  };

  const options = {
    id: "timeline",
    rowsStyle: {
      height: 100,
    } as TimelineRowStyle,
    snapEnabled: false,
  } as TimelineOptions;

  useEffect(() => {}, [meta]);

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

  const handleTimelineDrag = (keyframe: ExtendedTimelineKeyframe) => {
    const { id, val } = keyframe;

    setMarkers((prevState) =>
      prevState?.map((marker) =>
        marker.id.toString() === id ? { ...marker, time: val / 1000 } : marker
      )
    );

    console.log(`Rows : ${JSON.stringify(rows)}`);
    console.log(`Rows : ${JSON.stringify(markers)}`);

    // console.log(id);

    setPosition(val);
  };

  return (
    <>
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
      />

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
      />
    </>
  );
};

export { PlayerContainer };
export type { PlayerProps };
