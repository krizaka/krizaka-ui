// Export a chart as a file: CSV (the data table, as the reader sees it), SVG (the drawing, its colours resolved — a
// file has no --kz-* variables) and PNG (the SVG rasterised at twice the size).

/** One CSV line per row; cells quoted when they hold a separator, a quote or a line break. */
export function toCsv(rows: readonly (readonly string[])[]): string {
  const cell = (value: string) => (/[",\n;]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value);
  return rows.map((row) => row.map(cell).join(",")).join("\n");
}

/** A file name from a title: `Earnings, last 6 months` → `earnings-last-6-months`. */
export function fileName(title: string | undefined, extension: string): string {
  const base =
    (title ?? "chart")
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "chart";
  return `${base}.${extension}`;
}

export function download(name: string, content: Blob | string): void {
  const url = typeof content === "string" ? content : URL.createObjectURL(content);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  if (typeof content !== "string") setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const PROPS = ["fill", "stroke", "stroke-width", "stroke-dasharray", "opacity", "fill-opacity", "font-size", "font-weight", "font-family"] as const;

/** A standalone copy of a drawn SVG: every colour and text style the CSS gave it, written on the element. */
export function serializeSvg(svg: SVGSVGElement, background?: string): string {
  const clone = svg.cloneNode(true) as SVGSVGElement;
  const source = [svg, ...svg.querySelectorAll("*")];
  const target = [clone, ...clone.querySelectorAll("*")];
  source.forEach((el, i) => {
    const style = getComputedStyle(el);
    const out = target[i] as SVGElement;
    for (const prop of PROPS) {
      const value = style.getPropertyValue(prop);
      if (value) out.style.setProperty(prop, value);
    }
    // The entrance animation's dash would export a line half drawn.
    out.style.removeProperty("stroke-dasharray");
    if (el.getAttribute("stroke-dasharray")) out.style.setProperty("stroke-dasharray", el.getAttribute("stroke-dasharray")!);
  });
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  if (background) clone.style.setProperty("background", background);
  return new XMLSerializer().serializeToString(clone);
}

/** The SVG drawn on a canvas at `scale` × its size, as a PNG data URL. */
export function svgToPng(markup: string, width: number, height: number, background: string, scale = 2): Promise<string> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width * scale;
      canvas.height = height * scale;
      const context = canvas.getContext("2d");
      if (!context) return reject(new Error("No 2D canvas"));
      context.fillStyle = background;
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/png"));
      return undefined;
    };
    image.onerror = () => reject(new Error("The SVG could not be rasterised"));
    image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(markup)}`;
  });
}
