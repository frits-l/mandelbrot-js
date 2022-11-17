const mandelFunc = (a, b, x, y) => {
  return [a * a - b * b + x, 2 * a * b + y];
};

// const mandel = (a, b, x, y, count = 0) => {
//   const [aResult, bResult] = mandelFunc(a, b, x, y);
//   const distance = Math.sqrt(Math.hypot(aResult - x, bResult - y));

//   console.log("**distance", distance);
//   if (distance < 20) {
//     console.log("**count", count);
//     return mandel(aResult, bResult, x, y, count + 1);
//   } else {
//     return count;
//   }

// return distance < 2 ? mandel(aResult, bResult, x, y, count + 1) : count;
// };

const mandelJs = (a, b, x, y, count = 0) => {
  const [aResult, bResult] = mandelFunc(a, b, x, y);
  const distance = Math.sqrt(Math.hypot(aResult - x, bResult - y));

  if (distance < 20 && count < 20) {
    return mandelJs(aResult, bResult, x, y, count + 1);
  } else {
    return count;
  }
};
import { mandel } from "./build/debug.js";

class MandelFigure {
  width = 500;
  height = 500;

  canvas = document.getElementById("canvas");
  time = document.getElementById("time");
  ctx = this.canvas.getContext("2d");

  tickTimeout;

  data = [];

  camera = { x: -250, y: -250, scale: 1 };

  constructor() {
    this.canvas.height = this.height;
    this.canvas.width = this.width;
    this.tick();

    document.onkeydown = (e) => {
      e = e || window.event;

      if (e.key == "ArrowUp") {
        this.camera.y += 40;
        this.tick();
      } else if (e.key == "ArrowDown") {
        this.camera.y -= 40;
        this.tick();
      } else if (e.key == "ArrowLeft") {
        this.camera.x -= 40;
        this.tick();
      } else if (e.key == "ArrowRight") {
        this.camera.x += 40;
        this.tick();
      } else if (e.key == "=") {
        this.camera.scale += 1;
        this.tick();
      } else if (e.key == "-") {
        this.camera.scale -= 1;
        this.tick();
      }

      console.log("**e.key", e.key);
    };
  }

  fillData() {
    for (let i = 1; i < this.width; i++) {
      for (let z = 1; z < this.height; z++) {
        const mandelResult = mandelJs(
          0,
          0,
          (i + this.camera.x) / (this.camera.scale * 100),
          (z + this.camera.y) / (this.camera.scale * 100),
          0
        );
        if (mandelResult % 2 == 0) {
          this.setPixel(i, z);
        }
      }
    }
  }

  getFirstIndexOfPixel(x, y) {
    return (this.width * y + x) * 4;
  }

  setPixel(x, y) {
    const index = this.getFirstIndexOfPixel(x, y);
    this.data[index] = 0; // Red
    this.data[index + 1] = 0; // Green
    this.data[index + 2] = 0; // Blue
    this.data[index + 3] = 255; // Alpha
  }

  renderData() {
    const newImageData = this.ctx.createImageData(this.width, this.height);
    newImageData.data.set(this.data);
    this.ctx.putImageData(newImageData, 0, 0);

    console.log("**this.data", this.data);
    // clear data after render
    this.data = [];
  }

  tick() {
    clearTimeout(this.tickTimeout);
    this.tickTimeout = setTimeout(() => {
      const before = new Date();
      this.fillData();
      // this.data = getMandelImageData(this.height, this.width);
      this.time.textContent = `${
        (new Date().getTime() - before.getTime()) / 1000
      } s, Scale: ${this.camera.scale}`;
      this.renderData();
    }, 200);
  }
}

new MandelFigure();
