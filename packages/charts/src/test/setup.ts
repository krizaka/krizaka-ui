// happy-dom lays nothing out: give every element a width, so the charts draw as in a browser.
export function mockWidth(width = 640, height = 280) {
  const rect = { width, height, top: 0, left: 0, right: width, bottom: height, x: 0, y: 0, toJSON: () => ({}) };
  HTMLElement.prototype.getBoundingClientRect = function getBoundingClientRect() {
    return rect as DOMRect;
  };
  SVGElement.prototype.getBoundingClientRect = function getBoundingClientRect() {
    return rect as DOMRect;
  };
}
