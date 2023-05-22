import VideoPlayer from "react-video-player-extended";
import { PlayerProps } from "./playerContainer";

const PlayerView = (props: PlayerProps): JSX.Element => {
  return (
    <VideoPlayer
      onMarkerClick={() => {}}
      onMarkerAdded={props.onMarkerAdded}
      markerConfiguration={{ color: "#800000", selectionColor: "#FFFF00" }}
      markers={props.markers}
      fps={props.fps}
      url={props.url}
      timeStart={0}
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
