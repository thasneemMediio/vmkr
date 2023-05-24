import { TimelineDragEvent } from "animation-timeline-js";
import { TimelineElementDragState } from "animation-timeline-js/lib/utils/timelineElementDragState";
import { ExtendedTimelineKeyframe } from "../../player/interfaces/interfaces";

interface ExtendedTimelineDragEvent extends TimelineDragEvent {
  target: ExtendedTimelineElementDragState | null;
}

interface ExtendedTimelineElementDragState extends TimelineElementDragState {
  keyframe: ExtendedTimelineKeyframe;
  keyframes:ExtendedTimelineKeyframe[];
}

export type { ExtendedTimelineDragEvent, ExtendedTimelineElementDragState };
