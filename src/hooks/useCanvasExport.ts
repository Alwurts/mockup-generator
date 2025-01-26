import { useCallback } from "react";

interface DrawWindowOptions {
	width: number;
	height: number;
	backgroundColor: string;
	showTitleBar: boolean;
	xPadding: number; // percentage of width (0-100)
	useTransparency: boolean;
}

export const useCanvasExport = () => {
	const drawWindow = useCallback(
		(ctx: CanvasRenderingContext2D, options: DrawWindowOptions) => {
			const { width, height, backgroundColor, showTitleBar, xPadding, useTransparency } =
				options;

			// Clear the canvas with transparency
			ctx.clearRect(0, 0, width, height);

			// Draw background
			ctx.fillStyle = backgroundColor;
			ctx.fillRect(0, 0, width, height);

			// Calculate window dimensions with padding
			const paddingX = (width * xPadding) / 100;
			const windowWidth = width - paddingX * 2;

			// Calculate height to maintain 16:9 aspect ratio for the green screen area
			const titleBarHeight = showTitleBar ? 32 : 0;
			const greenScreenAspectRatio = 16 / 9;
			const greenScreenHeight = windowWidth / greenScreenAspectRatio;
			const windowHeight = greenScreenHeight + titleBarHeight;

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
			if (!useTransparency) {
				ctx.fillStyle = "#00ff00";
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
				ctx.globalCompositeOperation = 'destination-out';
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
