import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Sketch: React.FC = () => {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		let renderer: THREE.WebGLRenderer;
		let scene: THREE.Scene;
		let camera: THREE.OrthographicCamera;
		let animationId: number;
		const cells: THREE.Mesh[] = [];

		// Halved tile dimensions: now 40×20 to produce smaller cells.
		const tileW: number = 40;
		const tileH: number = 20;

		// Animation parameters.
		const period: number = 2; // Period of the color oscillation (in seconds)
		const delayFactor: number = 0.05; // Delay per grid-unit from the center for broader wave peaks

		// Compute grid extent based on canvas dimensions.
		const updateGridExtent = (width: number, height: number): number => {
			return Math.ceil((width + height) / tileH);
		};

		// Create the common diamond shape geometry.
		const diamondShape = new THREE.Shape();
		diamondShape.moveTo(0, -tileH / 2);
		diamondShape.lineTo(tileW / 2, 0);
		diamondShape.lineTo(0, tileH / 2);
		diamondShape.lineTo(-tileW / 2, 0);
		diamondShape.lineTo(0, -tileH / 2);
		const diamondGeometry = new THREE.ShapeGeometry(diamondShape);

		// Create an edges geometry for the outline.
		const edgesGeometry = new THREE.EdgesGeometry(diamondGeometry);
		const lineMaterial = new THREE.LineBasicMaterial({ color: 0xc8c8c8, linewidth: 1 });

		// Set up scene.
		scene = new THREE.Scene();
		scene.background = new THREE.Color(0xf5f5f5); // Similar to p5 background 245.

		// Set up camera using an orthographic projection.
		const width = window.innerWidth;
		const height = window.innerHeight;
		camera = new THREE.OrthographicCamera(-width / 2, width / 2, height / 2, -height / 2, -1000, 1000);
		camera.position.z = 10;

		// Set up renderer.
		renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize(width, height);
		if (containerRef.current) {
			containerRef.current.appendChild(renderer.domElement);
		}

		// Create the grid of cells.
		const gridExtent = updateGridExtent(width, height);
		for (let i = -gridExtent; i <= gridExtent; i++) {
			for (let j = -gridExtent; j <= gridExtent; j++) {
				// Compute the diamond center position using isometric mapping:
				//   x = (i - j) * (tileW / 2)
				//   y = (i + j) * (tileH / 2)
				const x = (i - j) * (tileW / 2);
				const y = (i + j) * (tileH / 2);

				// Culling: if the diamond is off-camera, skip it.
				if (
					x + tileW / 2 < -width / 2 ||
					x - tileW / 2 > width / 2 ||
					y + tileH / 2 < -height / 2 ||
					y - tileH / 2 > height / 2
				) {
					continue;
				}

				// Create a material for this cell.
				const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
				const mesh = new THREE.Mesh(diamondGeometry, material);
				mesh.position.set(x, y, 0);

				// Add an outline using edges geometry.
				const line = new THREE.LineSegments(edgesGeometry, lineMaterial);
				mesh.add(line);

				// Create a divider line from the left vertex to the right vertex.
				const dividerGeometry = new THREE.BufferGeometry().setFromPoints([
					new THREE.Vector3(-tileW / 2, 0, 0),
					new THREE.Vector3(tileW / 2, 0, 0)
				]);
				const dividerLine = new THREE.Line(dividerGeometry, lineMaterial);
				mesh.add(dividerLine);

				// Save grid coordinates for animation.
				mesh.userData = { gridI: i, gridJ: j };
				scene.add(mesh);
				cells.push(mesh);
			}
		}

		// Animation loop.
		const animate = () => {
			animationId = requestAnimationFrame(animate);
			const t = performance.now() / 1000; // Current time in seconds

			// Update the color of each cell.
			cells.forEach((cell) => {
				const i = cell.userData.gridI;
				const j = cell.userData.gridJ;
				const d = Math.hypot(i, j); // Distance from grid center.
				const val = Math.sin(2 * Math.PI * ((t - d * delayFactor) / period));
				// Normalize sine value from [-1, 1] to [0, 1]
				const norm = (val + 1) / 2;
				// Interpolate between 240 (light value) and 60 (dark value).
				const grayVal = THREE.MathUtils.lerp(240, 60, norm) / 255;
				(cell.material as THREE.MeshBasicMaterial).color.setRGB(grayVal, grayVal, grayVal);
			});

			renderer.render(scene, camera);
		};

		animate();

		// Handle window resize.
		const onWindowResize = () => {
			const width = window.innerWidth;
			const height = window.innerHeight;
			camera.left = -width / 2;
			camera.right = width / 2;
			camera.top = height / 2;
			camera.bottom = -height / 2;
			camera.updateProjectionMatrix();
			renderer.setSize(width, height);
		};
		window.addEventListener('resize', onWindowResize);

		return () => {
			cancelAnimationFrame(animationId);
			window.removeEventListener('resize', onWindowResize);
			if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
				containerRef.current.removeChild(renderer.domElement);
			}
			renderer.dispose();
		};
	}, []);

	return <div ref={containerRef} />;
};

export default Sketch;
