/**
 * SVG Path Flattening — Transform nested SVG viewBox coords to absolute canvas coords
 */

export interface PathTransform {
  scaleX: number;
  scaleY: number;
  translateX: number;
  translateY: number;
}

function transformPoint(x: number, y: number, t: PathTransform): [number, number] {
  return [
    x * t.scaleX + t.translateX,
    y * t.scaleY + t.translateY,
  ];
}

export function transformPath(pathData: string, transform: PathTransform): string {
  const commands = pathData.match(/[MmLlHhVvCcSsQqTtAaZz][^MmLlHhVvCcSsQqTtAaZz]*/g) || [];
  
  let currentX = 0;
  let currentY = 0;
  let result = "";

  for (const cmd of commands) {
    const type = cmd[0];
    const coords = cmd.slice(1).trim().split(/[\s,]+/).map(Number).filter(n => !isNaN(n));

    switch (type) {
      case 'M': {
        const [x, y] = transformPoint(coords[0], coords[1], transform);
        result += `M${x.toFixed(2)},${y.toFixed(2)}`;
        currentX = x;
        currentY = y;
        break;
      }
      case 'm': {
        const [dx, dy] = [coords[0] * transform.scaleX, coords[1] * transform.scaleY];
        result += `m${dx.toFixed(2)},${dy.toFixed(2)}`;
        currentX += dx;
        currentY += dy;
        break;
      }
      case 'L': {
        const [x, y] = transformPoint(coords[0], coords[1], transform);
        result += `L${x.toFixed(2)},${y.toFixed(2)}`;
        currentX = x;
        currentY = y;
        break;
      }
      case 'l': {
        const [dx, dy] = [coords[0] * transform.scaleX, coords[1] * transform.scaleY];
        result += `l${dx.toFixed(2)},${dy.toFixed(2)}`;
        currentX += dx;
        currentY += dy;
        break;
      }
      case 'H': {
        const [x] = transformPoint(coords[0], currentY, transform);
        result += `H${x.toFixed(2)}`;
        currentX = x;
        break;
      }
      case 'h': {
        const dx = coords[0] * transform.scaleX;
        result += `h${dx.toFixed(2)}`;
        currentX += dx;
        break;
      }
      case 'V': {
        const [, y] = transformPoint(currentX, coords[0], transform);
        result += `V${y.toFixed(2)}`;
        currentY = y;
        break;
      }
      case 'v': {
        const dy = coords[0] * transform.scaleY;
        result += `v${dy.toFixed(2)}`;
        currentY += dy;
        break;
      }
      case 'C': {
        const [x1, y1] = transformPoint(coords[0], coords[1], transform);
        const [x2, y2] = transformPoint(coords[2], coords[3], transform);
        const [x, y] = transformPoint(coords[4], coords[5], transform);
        result += `C${x1.toFixed(2)},${y1.toFixed(2)} ${x2.toFixed(2)},${y2.toFixed(2)} ${x.toFixed(2)},${y.toFixed(2)}`;
        currentX = x;
        currentY = y;
        break;
      }
      case 'c': {
        const dx1 = coords[0] * transform.scaleX;
        const dy1 = coords[1] * transform.scaleY;
        const dx2 = coords[2] * transform.scaleX;
        const dy2 = coords[3] * transform.scaleY;
        const dx = coords[4] * transform.scaleX;
        const dy = coords[5] * transform.scaleY;
        result += `c${dx1.toFixed(2)},${dy1.toFixed(2)} ${dx2.toFixed(2)},${dy2.toFixed(2)} ${dx.toFixed(2)},${dy.toFixed(2)}`;
        currentX += dx;
        currentY += dy;
        break;
      }
      case 'Q': {
        const [x1, y1] = transformPoint(coords[0], coords[1], transform);
        const [x, y] = transformPoint(coords[2], coords[3], transform);
        result += `Q${x1.toFixed(2)},${y1.toFixed(2)} ${x.toFixed(2)},${y.toFixed(2)}`;
        currentX = x;
        currentY = y;
        break;
      }
      case 'q': {
        const dx1 = coords[0] * transform.scaleX;
        const dy1 = coords[1] * transform.scaleY;
        const dx = coords[2] * transform.scaleX;
        const dy = coords[3] * transform.scaleY;
        result += `q${dx1.toFixed(2)},${dy1.toFixed(2)} ${dx.toFixed(2)},${dy.toFixed(2)}`;
        currentX += dx;
        currentY += dy;
        break;
      }
      case 'Z':
      case 'z': {
        result += 'Z';
        break;
      }
      default: {
        result += cmd;
      }
    }
  }

  return result;
}

export function calculateTransform(
  viewBoxWidth: number,
  viewBoxHeight: number,
  targetX: number,
  targetY: number,
  targetWidth: number,
  targetHeight: number,
): PathTransform {
  return {
    scaleX: targetWidth / viewBoxWidth,
    scaleY: targetHeight / viewBoxHeight,
    translateX: targetX,
    translateY: targetY,
  };
}
