import VideoPlayer, { ChildRef } from "react-video-player-extended";
import { PlayerProps } from "./interfaces/interfaces";
import { useRef, useEffect } from "react";

const PlayerView = (props: PlayerProps): JSX.Element => {
  ///////////KEY-EVENTS/////////////////////

  // Key handler

  const childRef = useRef<ChildRef | null>(null);

  const handleMarkerByKeyDown = (ev: KeyboardEvent) => {
    if (ev.code == "Space") {
      childRef.current?.onManualMarkerAdd();
    }
  };

  // Key event
  useEffect(() => {
    document.addEventListener("keydown", handleMarkerByKeyDown);

    return () => {
      document.removeEventListener("keydown", handleMarkerByKeyDown);
    };
  }, [handleMarkerByKeyDown]);

  //////////////////////////////////////////

  return (
    <VideoPlayer
      ref={childRef}
      onMarkerClick={() => {}}
      onMarkerAdded={props.onMarkerAdded}
      markerConfiguration={{ color: "#800000", selectionColor: "#FFFF00" }}
      markers={props.markers}
      fps={props.fps}
      url={props.url}
      timeStart={props.timeStart}
      isPlaying={props.isPlaying}
      volume={props.volume}
      onPlay={props.onPlay}
      onPause={props.onPause}
      onVolume={props.onVolume}
      onProgress={props.onProgress}
      onLoadedMetadata={(data) => props.onMetaReady(data)}
      controls={[
        "Play",
        "Time",
        "Progress",
        "Volume",
        "FullScreen",
        "AddMarker",
        "ExportMarkers",
      ]}
      viewSettings={["Title", "FPS", "Repeat", "StartTime", "Volume"]}
    />
  );
};

export { PlayerView };
