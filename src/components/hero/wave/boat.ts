/**
 * The tugboat, drawn as canvas paths. Local coordinates: the origin is the
 * middle of the hull at the waterline, +x is the bow, +y is down. Roughly
 * 76 × 52 px at scale 1.
 */

/** Half the distance between the two points the hull rests on. */
export const HULL_HALF_SPAN = 24;

/** Top of the smokestack, where puffs start. */
export const STACK_TOP = { x: -21.5, y: -38 } as const;

/** How far the hull's bottom sits below the waterline. The water is drawn over it. */
const WATERLINE_SINK = 6;

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, radius);
  ctx.fill();
  ctx.stroke();
}

export function drawBoat(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  scale: number,
  fill: string,
  stroke: string,
  lineWidth: number,
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.scale(scale, scale);

  ctx.fillStyle = fill;
  ctx.strokeStyle = stroke;
  ctx.lineWidth = lineWidth;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  // Smokestack with a band
  roundedRect(ctx, -26, -37, 9, 30, 1.5);
  ctx.beginPath();
  ctx.moveTo(-26, -31);
  ctx.lineTo(-17, -31);
  ctx.stroke();

  // Mast and pennant (trails behind, since she sails to the right)
  ctx.beginPath();
  ctx.moveTo(4, -30);
  ctx.lineTo(4, -43);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(4, -43);
  ctx.lineTo(-4, -40.5);
  ctx.lineTo(4, -38);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Wheelhouse, roof and two windows
  roundedRect(ctx, -13, -28, 25, 22, 3);
  roundedRect(ctx, -16, -31, 31, 4, 2);
  roundedRect(ctx, -8, -23, 6, 7, 1.5);
  roundedRect(ctx, 2, -23, 6, 7, 1.5);

  // Hull: low stern, sheer rising to the bow
  ctx.beginPath();
  ctx.moveTo(-35, -10);
  ctx.quadraticCurveTo(0, -5, 38, -14);
  ctx.quadraticCurveTo(35, 3, 23, WATERLINE_SINK);
  ctx.lineTo(-27, WATERLINE_SINK);
  ctx.quadraticCurveTo(-36, WATERLINE_SINK, -35, -10);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Tyre fenders
  for (const fenderX of [-14, 6]) {
    ctx.beginPath();
    ctx.arc(fenderX, -2.5, 2.75, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }

  ctx.restore();
}
