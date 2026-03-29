/*
 * ADAPTA — Parser de SVG paths
 * Extrai <path> e <circle> de strings SVG e retorna objetos tipados.
 */

export interface SvgPath {
  type: "path";
  d: string;
  fill: string;
  stroke?: string;
  strokeWidth?: number;
}

export interface SvgCircle {
  type: "circle";
  cx: number;
  cy: number;
  r: number;
  fill: string;
}

export type SvgElement = SvgPath | SvgCircle;

export function parseSvgElements(svg: string): SvgElement[] {
  const elements: SvgElement[] = [];
  const parser = new DOMParser();
  const doc = parser.parseFromString(
    `<svg xmlns="http://www.w3.org/2000/svg">${svg}</svg>`,
    "image/svg+xml"
  );

  const parseError = doc.querySelector("parsererror");
  if (parseError) {
    console.error("SVG parse error:", parseError.textContent);
    return elements;
  }

  doc.querySelectorAll("path, circle").forEach((el) => {
    if (el.tagName.toLowerCase() === "path") {
      const d = el.getAttribute("d");
      if (d) {
        const pathEl: SvgPath = {
          type: "path",
          d,
          fill: el.getAttribute("fill") || "none",
        };
        const stroke = el.getAttribute("stroke");
        if (stroke) pathEl.stroke = stroke;
        const sw = el.getAttribute("stroke-width");
        if (sw) {
          const parsed = parseFloat(sw);
          if (!isNaN(parsed)) pathEl.strokeWidth = parsed;
        }
        elements.push(pathEl);
      }
    } else if (el.tagName.toLowerCase() === "circle") {
      const cx = parseFloat(el.getAttribute("cx") || "0");
      const cy = parseFloat(el.getAttribute("cy") || "0");
      const r = parseFloat(el.getAttribute("r") || "0");
      elements.push({
        type: "circle",
        cx,
        cy,
        r,
        fill: el.getAttribute("fill") || "none",
      });
    }
  });

  return elements;
}
