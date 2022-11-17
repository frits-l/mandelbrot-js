// The entry file of your WebAssembly module.

export function mandelFunc(a: f32, b: f32, x: f32, y: f32): f32[] {
  return [a * a - b * b + x, 2 * a * b + y];
}

export function mandel(a: f32, b: f32, x: f32, y: f32, count: i16): i16 {
  const result = mandelFunc(a, b, x, y);
  const aResult = result[0];
  const bResult = result[1];
  const distance = Math.sqrt(Math.hypot(aResult - x, bResult - y));

  if (distance < 20 && count < 20) {
    return mandel(aResult, bResult, x, y, count + 1);
  } else {
    return count;
  }
}

function getFirstIndexOfPixel(x: i16, y: i16, width: i16): i16 {
  return (width * y + x) * 4;
}

export function getMandelImageData(height: i16, width: i16): StaticArray<i16> {
  const data = new StaticArray<i16>(width * height);

  for (let i = 1; i < width; i++) {
    for (let z = 1; z < height; z++) {
      const mandelResult = mandel(0, 0, (i as f32) / 100, (z as f32) / 100, 0);
      if (mandelResult % 2 == 0) {
        const index = getFirstIndexOfPixel(i as i16, z as i16, width);
        data[index] = 0; // Red
        data[index + 1] = 0; // Green
        data[index + 2] = 0; // Blue
        data[index + 3] = 255; // Alpha
      }
    }
  }

  return data;
}
