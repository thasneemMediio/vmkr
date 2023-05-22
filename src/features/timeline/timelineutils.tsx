import { ExtendedMarker, ExtendedTimelineRow } from "../player/playerContainer";

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

    const group = "default";

    const index = pairs.findIndex((pair) => pair.type === markers[i].type);

    console.log(`index : ${index}`);

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

const getKeyframesByPair = (
  pairNumber: number,
  startKeyframe: number,
  endKeyframe: number
): [number, number] => {
  if (pairNumber < 1) {
    throw new Error("Invalid pair number.");
  }

  const keyframes: [number, number][] = [];
  let currentStart = startKeyframe;
  let currentEnd = endKeyframe;

  for (let i = 1; i <= pairNumber; i++) {
    keyframes.push([currentStart, currentEnd]);
    const nextEnd = currentEnd - currentStart + currentEnd;
    currentStart = currentEnd;
    currentEnd = nextEnd;
  }

  return keyframes[pairNumber - 1];
};

export { createKeyframePairs };

////

// pairs.push(
//     {
//       type: "start",
//       keyframes: [
//         {
//           group: markers[i].title,
//           val: getKeyframesByPair(1, startKeyframe, endKeyframe)[0] * 1000,
//           id: markers[i].id.toString(),
//         },
//         {
//           group: markers[i].title,
//           val: getKeyframesByPair(1, startKeyframe, endKeyframe)[1] * 1000,
//           id: markers[i].id.toString(),
//         },
//       ],
//     },
//     {
//       type: "main",
//       keyframes: [
//         {
//           group: markers[i].title,
//           val: getKeyframesByPair(2, startKeyframe, endKeyframe)[0] * 1000,
//           id: markers[i].id.toString(),
//         },
//         {
//           group: markers[i].title,
//           val: getKeyframesByPair(2, startKeyframe, endKeyframe)[1] * 1000,
//           id: markers[i].id.toString(),
//         },
//       ],
//     },
//     {
//       type: "end",
//       keyframes: [
//         {
//           group: markers[i].title,
//           val: getKeyframesByPair(3, startKeyframe, endKeyframe)[0] * 1000,
//           id: markers[i].id.toString(),
//         },
//         {
//           group: markers[i].title,
//           val: getKeyframesByPair(3, startKeyframe, endKeyframe)[1] * 1000,
//           id: markers[i].id.toString(),
//         },
//       ],
//     }
//   );
