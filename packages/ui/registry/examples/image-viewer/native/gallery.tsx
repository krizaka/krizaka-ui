import { Button, ImageViewer } from "@krizaka/ui/native";
import { useState } from "react";

// Stand-in photos (an app passes its CDN's URIs): tiny PNGs, so the example runs offline.
const png = (data: string) => `data:image/png;base64,${data}`;
const PHOTOS = [
  { uri: png("iVBORw0KGgoAAAANSUhEUgAAABgAAAAQCAIAAACDRijCAAAB90lEQVR42nVU247TMBCdGU/s3CilhdXy0C28sRLfwf//BLtspV6gbZzYjoeHdFOnLNI82Nbo6Nxk/P7xB5EwwesIEzACM2iFRa4Ko0xGKFFCkNATRobpMgEhsCIhAnUZGQ6MoBVWZbb8UCwWRZlnvffnP4092t55kjhuDkMorBVQgj3Q0Qx1yXd39Xq9WK3m72rT2W7ztN/83B33x945upIChUIEA5CMEAPh0qjlovj6ZfHt8f5hvawq3Vo3n+VGwbOE8yFI3w8QF2kErJXQFUWYQDNWOX9alKvV/GG9vP/83hh2LigQb607nqS1oYsEcSRFNEjDiXNaQa6xKnhWm7rSxmRZRohYVaauTJmz0UhBEnWDNIJpaqAJFIgE79qus513noCDC67tQttJ7xkiKiBIUptIu5IS7EN7ara/9puZUYRlqZ1126ftYbN3pwZjYBROnB3NnjaIQEnfnezueZsrCbarau2sO7zsDi9b3zRKeqXSfG5Sw4QXinh/Ppw2Errjucg5+tCezu7cgPcZpvsylYa3ZWWM4p39HaRtG0aEiH3AGBljGnHiEU2lJTVjEIoxdn0IwChEwjghMk3t32YnTWMCpnjli7ebTDKanaZ2A5EqfYPI+H5lpC7b8gbE/4lMmq1oABJFoPD2G7gMptfXM16vRPAXAU4Dl1f5CK8AAAAASUVORK5CYII="), alt: "Elena on stage, backlit", caption: "Sunset session · Lisbon" },
  { uri: png("iVBORw0KGgoAAAANSUhEUgAAABgAAAAQCAIAAACDRijCAAAB6klEQVR42o2T3W4TQQyF7eOZnexmq2wiaLmgrbgB2ifgjvd/AwrlCokmNEXpNtn/8XCR5q/dApIvrNGx9dnjw6PzzwSwCEQYAhGIEIRYWIQYDGEIi2wTwrNHwDCwDiPiXDRwxlirxI3nVtkzmLHVbEIOAwQYNoYBa0yauNfj5GScDOOobMPtspsvu6INSo+VdMi1l4ABA7Fikcbu9Pjo4ix7/zbLjlxe+G/T1Zeb8ud9UzRBaVtw0IX2R4MxA2ePJ8OL88mnj68uz8ajYZQX3WQUs31ofzxM77vaM/WD7HIjNooH0ckk/XCaXZ6N371JE2fKxhNkUdFsqYu66poQCD0gh0TWRFGSuCx1ozRKnHFWiHk0tFnqkjiykYduNtU34CMRiwSWynNeaV5q2SgTl63mteZVqD0rG5YAQi/IJocJkEZ5vvTXv6rJqCAgi21e+6tZ9X1ez1ehURD4BRCh3R2JbQl3hV5NK5blogrZMMorvZ43X2/b3yV1W5YeENkRQUxglB3f5F1L5WwVhgNbepqv9K7Q0nOA4CWQTRcGDBvLgDKKDrOlX7SNNeoZjXKnrPx3kINlr10iCqlV2obZE4MJIP4XyMH3rxttnsLasfhPkK1y47Ve0Ra776yfLxt7UqAvnnp9bfcnsj/xIr3biGqZngAAAABJRU5ErkJggg=="), alt: "The crowd at the front" },
  { uri: png("iVBORw0KGgoAAAANSUhEUgAAABgAAAAQCAIAAACDRijCAAABrklEQVR42o1Ty3LbMAwEFiCpR5vY1iVOT+2pP9H//5lOHfklmc8ebDmexEpyIQEMZrmLBfnXn98Aq7CAFSy3sUyVmeI1BljPF6b8zSlgAeSTBgZYjQKYfW2OwpWgCiYgYdxvwnuZc9pfGX2RiBFMDRCQTLgAq5WL2k+JGIUzWhk1KqBSKDMV5qKTNOALE7EitbOPbbNo2sqZnOLgx5Mfc44MOks7z+ijiRhB4+zq+8Nz1z0tlk3lQvD/dv1mvzkMh1wiM6m9YTRnTWV00bY/uu7n03q97GpnQ/APTe0M/nIZ/DGXfMf+NyhG0Ti7/NauV8vnVdc9PFrRmCKAlH0IA1EIKX5g/2VHjMCpNM62VdU4a9UowMy1s42ramsGL0zp1f65HTHKIlRKitH7EGKKzJJyCjHE5Imzgkjx3v4LkVtcpuTD0B/6za4W4crYmML28LI/bkMcmbMKXey/8yevuGBw8fHUH3qrSDnUzsXkt4ft/tindBIuLLjazyK4a9w5oJLG03GzKzGO1hgqyccxhBOVbIQZrAJg/ltfU2bKOY6noeSoCmEiSkwZYAAA/wd2L6cjlMdGoAAAAABJRU5ErkJggg=="), alt: "The band packing up" },
];

// Full screen: pinch or double tap to zoom, swipe between photos, swipe down to close.
export default function NativeImageViewerGallery({ defaultOpen = false }: { defaultOpen?: boolean }) {
  const [index, setIndex] = useState<number | null>(defaultOpen ? 0 : null);
  return (
    <>
      <Button label="Open the photos" onPress={() => setIndex(0)} />
      <ImageViewer images={PHOTOS} index={index} onIndexChange={setIndex} closeLabel="Close" positionLabel={(n, total) => `${n} of ${total}`} />
    </>
  );
}
