import {
  ExtendedMarker,
  ExtendedTimelineRow,
} from "../player/interfaces/interfaces";

const createKeyframePairs = (
  markers: ExtendedMarker[]
): ExtendedTimelineRow[] | null => {
  if (markers.length % 2 !== 0) {
    console.log("must have an even number of items");

    return null;
  }

  // Pre define types | 3 lines of time :3
  const pairs: ExtendedTimelineRow[] = [
    {
      type: "start",
      keyframes: [],
    },
    {
      type: "main",
      keyframes: [],
    },
    {
      type: "end",
      keyframes: [],
    },
  ];

  for (let i = 0; i < markers.length - 1; i += 2) {
    const startKeyframe = markers[i].time;
    const endKeyframe = markers[i + 1].time;

    const index = pairs.findIndex((pair) => pair.type === markers[i].type);

    if (index !== -1) {
      pairs[index].keyframes!.push(
        {
          group: markers[i].title,
          val: startKeyframe * 1000,
          id: markers[i].id.toString(),
        },
        {
          group: markers[i].title,
          val: endKeyframe * 1000,
          id: markers[i + 1].id.toString(),
        }
      );
    } else {
      //  'type' doesn't match any existing 'pairs' entry
      console.log("Type not found in '🍐' array. xD");
    }
  }

  return pairs;
};

export { createKeyframePairs };
