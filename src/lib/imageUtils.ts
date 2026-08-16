/**
 * Dynamically removes light/studio/sky background from car images using edge flood-fill
 * and returns a transparent PNG Data URL.
 */
export function removeBackgroundFromImage(img: HTMLImageElement): string {
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return img.src;

  ctx.drawImage(img, 0, 0);

  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;
  const w = canvas.width;
  const h = canvas.height;

  // Sample corner pixel (0,0) as target background color
  const bgR = data[0];
  const bgG = data[1];
  const bgB = data[2];

  const visited = new Uint8Array(w * h);
  const queue: number[] = [];

  // Seed all border pixels
  for (let x = 0; x < w; x++) {
    queue.push(x, 0);
    queue.push(x, h - 1);
  }
  for (let y = 0; y < h; y++) {
    queue.push(0, y);
    queue.push(w - 1, y);
  }

  const colorThreshold = 55; // Color tolerance distance

  let head = 0;
  while (head < queue.length) {
    const x = queue[head++];
    const y = queue[head++];
    const idx = y * w + x;

    if (visited[idx]) continue;
    visited[idx] = 1;

    const pIdx = idx * 4;
    const r = data[pIdx];
    const g = data[pIdx + 1];
    const b = data[pIdx + 2];

    const dist = Math.sqrt(
      (r - bgR) ** 2 +
      (g - bgG) ** 2 +
      (b - bgB) ** 2
    );

    // Check if pixel matches background or is light studio background
    const isLightBackground = (r > 195 && g > 195 && b > 195 && Math.abs(r - g) < 25 && Math.abs(g - b) < 25);

    if (dist < colorThreshold || isLightBackground) {
      data[pIdx + 3] = 0; // Set Alpha to 0 (Transparent)

      // Queue 4-way neighbors
      if (x > 0 && !visited[idx - 1]) queue.push(x - 1, y);
      if (x < w - 1 && !visited[idx + 1]) queue.push(x + 1, y);
      if (y > 0 && !visited[idx - w]) queue.push(x, y - 1);
      if (y < h - 1 && !visited[idx + w]) queue.push(x, y + 1);
    }
  }

  ctx.putImageData(imgData, 0, 0);
  return canvas.toDataURL('image/png');
}
