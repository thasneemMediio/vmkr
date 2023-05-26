import {
  Timeline,
  TimelineModel,
  TimelineOptions,
  TimelineScrollEvent,
  TimelineSelectedEvent,
  TimelineTimeChangedEvent,
} from "animation-timeline-js";
import { useEffect, useRef, useState } from "react";
import "./VideoTimeline.css";
import {
  keyTypes,
  ExtendedTimelineKeyframe,
} from "../player/interfaces/interfaces";
import { ExtendedTimelineDragEvent } from "./interfaces/interfaces";

interface TimelineProps {
  time: number;
  model: TimelineModel;
  options: TimelineOptions;
  rows: keyTypes[];
  item: string;
  onRowSelected: (item: keyTypes) => void;
  onTimeChange: (time: number) => void;
  onTimelineDrag: (keyframe: ExtendedTimelineKeyframe[]) => void;
  onTimelineSelected: (keyframe: ExtendedTimelineKeyframe[]) => void;
}

const TimelineComponent = (props: TimelineProps): JSX.Element => {
  const timelineElRef = useRef<HTMLDivElement>(null);
  const [timeline, setTimeline] = useState<Timeline>();

  const handleTimelineEvent = (event: ExtendedTimelineDragEvent) =>
    props.onTimelineDrag(event.target!.keyframes);
  const handleScrollEvent = (event: TimelineScrollEvent) => {
    console.log("Timeline Scroll event:", event.scrollHeight);
  };

  const handleTimeEvent = (event: TimelineTimeChangedEvent) =>
    props.onTimeChange(event.val);

  const handleSelected = (event: TimelineSelectedEvent): void => {
    const selected = event.selected;

    console.log(`Selected : ${JSON.stringify(selected)}`);

    props.onTimelineSelected(selected as ExtendedTimelineKeyframe[]);
  };

  useEffect(() => {
    let newTimeline: Timeline | null = null;

    if (timelineElRef.current) {
      newTimeline = new Timeline({
        id: timelineElRef.current,
        headerHeight: 30,
        rowsStyle: { height: 25 },
        scrollContainerClass: "scrollar",
      });

      newTimeline.onTimeChanged((args: TimelineTimeChangedEvent) => {
        if (args) {
          handleTimeEvent(args);
        }
      });

      newTimeline.onDrag(
        (data) => {
          return handleTimelineEvent(data as ExtendedTimelineDragEvent);
        }
        // handleTimelineEvent(data as ExtendedTimelineDragEvent)
      );

      newTimeline.onScroll((args: TimelineScrollEvent) => {
        console.log("scrolling");
        if (args) {
          handleScrollEvent(args);
        }
      });

      newTimeline.onSelected((args: TimelineSelectedEvent) => {
        if (args) {
          handleSelected(args);
        }
      });

      setTimeline(newTimeline);
    }

    return () => {
      timeline?.dispose();
    };
  }, []);

  useEffect(() => {
    if (timeline) {
      timeline.setModel(props.model);
    }
  }, [props.model, timeline]);

  useEffect(() => {
    if (timeline) {
      timeline.setTime(props.time);
    }
  }, [props.time, timeline]);

  const listItems = props.rows.map((row, index) => {
    return (
      <div
        key={index}
        onClick={() => props.onRowSelected(row)}
        className={`listItem ${props.item === row ? "selected" : ""}`}
      >
        {row}
      </div>
    );
  });

  // Key handlers

  const handleCtrl = (ev: KeyboardEvent): void => {
    if (ev.key == "Control") {
      const index = props.rows.findIndex((type) => type === props.item);
      const nextIndex = (index + 1) % props.rows.length;

      props.onRowSelected(props.rows[nextIndex]);
    }
  };

  // Key Events

  useEffect(() => {
    document.addEventListener("keydown", handleCtrl);

    return () => {
      document.removeEventListener("keydown", handleCtrl);
    };
  }, [handleCtrl]);

  return (
    <div  className="container" >
      <div className="outline">{listItems}</div>
      <div className="tl-div" ref={timelineElRef} />
    </div>
  );
};

export { TimelineComponent };
export type { TimelineProps };
