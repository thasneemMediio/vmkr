import { TimelineKeyframe, TimelineRow } from "animation-timeline-js";
import { ProgressProps } from "react-video-player-extended";
import { Marker } from "react-video-player-extended/dist/marker";

interface PlayerProps {
  url: string;
  isPlaying: boolean;
  volume: number;
  fps: number;
  markers: Marker[];
  timeStart: number;

  onPlay: () => void;
  onPause: () => void;
  onVolume: (volume: number) => void;
  onProgress: (e: Event, progress: ProgressProps) => void | null;
  onMetaReady: (event: React.SyntheticEvent<HTMLVideoElement, Event>) => void;
  onMarkerAdded: (marker: Marker) => void;
}

interface ExtendedTimelineKeyframe extends TimelineKeyframe {
  id: string;
}

type keyTypes = "start" | "main" | "end";

interface ExtendedTimelineRow extends TimelineRow {
  type: keyTypes;
  keyframes: ExtendedTimelineKeyframe[] | null;
}

interface ExtendedMarker extends Marker {
  type: keyTypes;
}

export type {
  PlayerProps,
  ExtendedTimelineKeyframe,
  ExtendedTimelineRow,
  ExtendedMarker,
  keyTypes,
};
