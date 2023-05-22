import {
  Timeline,
  TimelineDragEvent,
  TimelineElementDragState,
  TimelineModel,
  TimelineOptions,
  TimelineScrollEvent,
  TimelineTimeChangedEvent,
} from "animation-timeline-js";
import { useEffect, useRef, useState } from "react";
import "./VideoTimeline.css";
import { ExtendedTimelineKeyframe, keyTypes } from "../player/playerContainer";

interface TimelineProps {
  time: number;
  model: TimelineModel;
  options: TimelineOptions;
  rows: keyTypes[];
  item: string;
  onRowSelected: (item: keyTypes) => void;
  onTimeChange: (time: number) => void;
  onTimelineDrag: (keyframe: ExtendedTimelineKeyframe) => void;
}

interface ExtendedTimelineDragEvent extends TimelineDragEvent {
  target: ExtendedTimelineElementDragState | null;
}

interface ExtendedTimelineElementDragState extends TimelineElementDragState {
  keyframe: ExtendedTimelineKeyframe;
}

const TimelineComponent = (props: TimelineProps): JSX.Element => {
  const timelineElRef = useRef<HTMLDivElement>(null);
  const [timeline, setTimeline] = useState<Timeline>();

  const handleTimelineEvent = (event: ExtendedTimelineDragEvent) => {
    props.onTimelineDrag(event.target!.keyframe);
    console.log(`Dragging Id : ${event.target!.keyframe.id}`);
  };
  const handleScrollEvent = (event: TimelineScrollEvent) => {
    console.log("Timeline Scroll event:", event.scrollHeight);
  };

  const handleTimeEvent = (event: TimelineTimeChangedEvent) =>
    props.onTimeChange(event.val);

  useEffect(() => {
    let newTimeline: Timeline | null = null;

    if (timelineElRef.current) {
      newTimeline = new Timeline({
        id: timelineElRef.current,
        headerHeight: 30,
        rowsStyle: { height: 25 },
      });

      newTimeline.onTimeChanged((args: TimelineTimeChangedEvent) => {
        if (args) {
          handleTimeEvent(args);
        }
      });

      // newTimeline.onDrag((args: ExtendedTimelineDragEvent) => {
      //   if (args) {
      //     handleTimelineEvent(args);
      //   }
      // });

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

  // const listItems = rows.map((row ,index) => <div style={{ marginBottom: '5px',color: 'white' }} key={index} > {row}</div>);
  //  const listItems = rows.map((row, index) => (
  //   <div key={index}>
  //     <div style={{ marginBottom: '2px', color: 'white' }}>{row}</div>
  //     {index !== rows.length - 1 && <hr style={{ margin: '0', border: 'none', borderTop: '1px solid white' }} />}
  //   </div>
  // ));

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

  return (
    <div style={{ display: "flex" }}>
      <div className="outline">{listItems}</div>
      <div className="tl-div" ref={timelineElRef} />;
    </div>
  );
};

export { TimelineComponent };
export type { TimelineProps };
