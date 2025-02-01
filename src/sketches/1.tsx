import React, { useRef, useEffect } from 'react';
import p5 from 'p5';

const Sketch: React.FC = () => {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		// p5 sketch converted from @1.sketch.ts
		const sketch = (p: p5) => {
			// Halved tile dimensions: now 40×20 to produce smaller cells.
			const tileW: number = 40;
			const tileH: number = 20;

			// Animation parameters.
			const period: number = 2; // Period of the color oscillation (in seconds)
			const delayFactor: number = 0.05; // Reduced delay per grid-unit from the center for broader wave peaks

			// This variable will determine how many cells are needed to cover the page.
			let gridExtent: number;

			// Pre-computed diamond vertex offsets.
			const top = { x: 0, y: -tileH / 2 };
			const right = { x: tileW / 2, y: 0 };
			const bottom = { x: 0, y: tileH / 2 };
			const left = { x: -tileW / 2, y: 0 };

			p.setup = () => {
				p.createCanvas(p.windowWidth, p.windowHeight);
				p.angleMode(p.RADIANS);
				// Compute grid extent based on canvas dimensions.
				gridExtent = Math.ceil((p.windowWidth + p.windowHeight) / tileH);
			};

			p.draw = () => {
				p.background(245);

				// Center the grid on the canvas.
				const offsetX: number = p.width / 2;
				const offsetY: number = p.height / 2;

				// Iterate over a grid covering the entire canvas.
				for (let i = -gridExtent; i <= gridExtent; i++) {
					for (let j = -gridExtent; j <= gridExtent; j++) {
						// Compute the diamond center position using isometric mapping:
						//   x = offsetX + (i - j) * (tileW / 2)
						//   y = offsetY + (i + j) * (tileH / 2)
						const x: number = offsetX + (i - j) * (tileW / 2);
						const y: number = offsetY + (i + j) * (tileH / 2);

						// Culling: If the diamond (with margin) is off-canvas, skip drawing.
						if (
							x + tileW / 2 < 0 ||
							x - tileW / 2 > p.width ||
							y + tileH / 2 < 0 ||
							y - tileH / 2 > p.height
						) {
							continue;
						}

						// Compute a phase delay based on distance from grid center (0,0).
						const d: number = p.dist(i, j, 0, 0);
						const t: number = p.millis() / 1000;
						const val: number = p.sin(p.TWO_PI * ((t - d * delayFactor) / period));
						// Map the sine value [-1, 1] to a normalized value [0, 1].
						const norm: number = p.map(val, -1, 1, 0, 1);
						// Interpolate between a light tone and a dark tone.
						const col = p.lerpColor(p.color(240), p.color(60), norm);

						// Draw the diamond cell.
						p.fill(col);
						p.stroke(200); // faint gridline color
						p.strokeWeight(1);

						p.beginShape();
						p.vertex(x + top.x, y + top.y); // Top vertex
						p.vertex(x + right.x, y + right.y); // Right vertex
						p.vertex(x + bottom.x, y + bottom.y); // Bottom vertex
						p.vertex(x + left.x, y + left.y); // Left vertex
						p.endShape(p.CLOSE);

						// Draw a divider line inside the diamond to reveal two triangular cells.
						// This line is drawn from the left vertex to the right vertex.
						p.line(x + left.x, y + left.y, x + right.x, y + right.y);
					}
				}
			};

			p.windowResized = () => {
				p.resizeCanvas(p.windowWidth, p.windowHeight);
				gridExtent = Math.ceil((p.windowWidth + p.windowHeight) / tileH);
			};
		};

		// Create a new p5 instance and attach it to the container.
		let p5Instance: p5;
		if (containerRef.current) {
			p5Instance = new p5(sketch, containerRef.current);
		}

		// Cleanup the p5 instance on unmount.
		return () => {
			p5Instance?.remove();
		};
	}, []);

	return <div ref={containerRef} />;
};

export default Sketch;
