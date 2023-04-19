import textAspectRatio from "./text-aspect-ratio";
import GeometryUtils from "./geometry-utils";

export function textPlacementCorrection(
  x: number,
  y: number,
  width: number,
  height: number,
  rotate: number,
  alignment: string,
  size: number,
  text: string,
  font: string,
  weight: string,
  style: string,
  letterSpacing: number,
): { x: number; y: number; width: number; height: number } {
  const initialWidth = width;
  const lines = text.split("\n");
  const lineAspects = textAspectRatio(lines, font, weight, style);
  const letterSpacingAdjustments = lines.map(
    (line: string) => (line.length - 1) * letterSpacing,
  );
  const lineWidths: number[] = lineAspects.map(
    (a, index) => a * size + letterSpacingAdjustments[index],
  );
  height = lines.length * size;
  width = Math.max(...lineWidths);

  // is the calculated width different from the initial width
  // by more than a pixel rounding?
  if (Math.abs(width - initialWidth) > 1) {
    const widthDelta = initialWidth - width;
    let xOffset = 0;
    if (alignment === "center") {
      xOffset = widthDelta / 2;
    } else if (alignment === "right") {
      xOffset = widthDelta;
    }
    const localTranslationVector = { x: xOffset, y: 0 };
    const rotatedTranslationVector = GeometryUtils.rotatePoint(
      localTranslationVector,
      rotate,
    );
    x = x + rotatedTranslationVector.x;
    y = y + rotatedTranslationVector.y;
  }

  return {
    x,
    y,
    width,
    height,
  };
}

export default textPlacementCorrection;