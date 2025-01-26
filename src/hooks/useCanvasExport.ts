import { useCallback } from "react";

interface DrawWindowOptions {
	width: number;
	height: number;
	backgroundColor: string;
	backgroundImage?: string | null;
	showTitleBar: boolean;
	xMargin: number; // percentage of width (0-100)
	windowIsTransparent: boolean;
	aspectRatio: number; // aspect ratio for the content area (e.g., 16/9, 4/3)
}

export const useCanvasExport = () => {
	const drawWindow = useCallback(
		(ctx: CanvasRenderingContext2D, options: DrawWindowOptions) => {
			const {
				width,
				height,
				backgroundColor,
				backgroundImage,
				showTitleBar,
				xMargin,
				windowIsTransparent,
				aspectRatio,
			} = options;

			// Clear the canvas with transparency
			ctx.clearRect(0, 0, width, height);

			// Draw background
			if (backgroundImage) {
				const img = new Image();
				img.onload = () => {
					// Calculate scaling to cover the canvas while maintaining aspect ratio
					const scale = Math.max(width / img.width, height / img.height);
					const scaledWidth = img.width * scale;
					const scaledHeight = img.height * scale;
					const x = (width - scaledWidth) / 2;
					const y = (height - scaledHeight) / 2;

					ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
					drawWindowContent();
				};
				img.src = backgroundImage;
			} else {
				ctx.fillStyle = backgroundColor;
				ctx.fillRect(0, 0, width, height);
				drawWindowContent();
			}

			function drawWindowContent() {
				// Calculate window dimensions with padding
				const paddingX = (width * xMargin) / 100;
				const windowWidth = width - paddingX * 2;

				// Calculate height to maintain the specified aspect ratio for the content area
				const titleBarHeight = showTitleBar ? 32 : 0;
				const contentHeight = windowWidth / aspectRatio;
				const windowHeight = contentHeight + titleBarHeight;

				const windowX = paddingX;
				const windowY = (height - windowHeight) / 2;

				if (showTitleBar) {
					// Draw window background (only for title bar)
					ctx.fillStyle = "#ffffff";
					ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
					ctx.shadowBlur = 20;
					ctx.shadowOffsetX = 0;
					ctx.shadowOffsetY = 4;

					// Draw title bar with rounded corners at top
					ctx.beginPath();
					ctx.roundRect(
						windowX,
						windowY,
						windowWidth,
						titleBarHeight,
						[8, 8, 0, 0],
					);
					ctx.fill();

					// Reset shadow
					ctx.shadowColor = "transparent";

					// Draw window controls
					const controlsY = windowY + titleBarHeight / 2;
					const controlSize = 12;
					const controlGap = 8;
					const controlsX = windowX + 16;

					// Close button (red)
					ctx.fillStyle = "#ff5f57";
					ctx.beginPath();
					ctx.arc(controlsX, controlsY, controlSize / 2, 0, Math.PI * 2);
					ctx.fill();

					// Minimize button (yellow)
					ctx.fillStyle = "#ffbd2e";
					ctx.beginPath();
					ctx.arc(
						controlsX + controlSize + controlGap,
						controlsY,
						controlSize / 2,
						0,
						Math.PI * 2,
					);
					ctx.fill();

					// Maximize button (green)
					ctx.fillStyle = "#28c940";
					ctx.beginPath();
					ctx.arc(
						controlsX + (controlSize + controlGap) * 2,
						controlsY,
						controlSize / 2,
						0,
						Math.PI * 2,
					);
					ctx.fill();
				}

				// Draw content area with rounded corners
				if (!windowIsTransparent) {
					ctx.fillStyle = "#ccc";
					ctx.beginPath();
					ctx.roundRect(
						windowX,
						windowY + titleBarHeight,
						windowWidth,
						windowHeight - titleBarHeight,
						showTitleBar ? [0, 0, 8, 8] : [8, 8, 8, 8],
					);
					ctx.fill();
				} else {
					// For transparency, we need to clear the area
					ctx.save();
					ctx.globalCompositeOperation = "destination-out";
					ctx.beginPath();
					ctx.roundRect(
						windowX,
						windowY + titleBarHeight,
						windowWidth,
						windowHeight - titleBarHeight,
						showTitleBar ? [0, 0, 8, 8] : [8, 8, 8, 8],
					);
					ctx.fill();
					ctx.restore();
				}
			}
		},
		[],
	);

	const exportImage = useCallback((canvas: HTMLCanvasElement) => {
		const link = document.createElement("a");
		link.download = "obs-overlay.png";
		link.href = canvas.toDataURL("image/png");
		link.click();
	}, []);

	return { drawWindow, exportImage };
};
