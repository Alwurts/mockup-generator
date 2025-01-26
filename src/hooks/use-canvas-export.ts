import { useCallback } from "react";

interface DrawWindowOptions {
	width: number;
	height: number;
	backgroundColor: string;
	backgroundImage?: string | null;
	bgGradient: {
		enabled: boolean;
		startColor: string;
		endColor: string;
		direction: "to right" | "to bottom" | "to bottom right" | "to bottom left";
	};
	showTitleBar: boolean;
	xMargin: number; // percentage of width (0-100)
	windowIsTransparent: boolean;
	aspectRatio: number; // aspect ratio for the content area (e.g., 16/9, 4/3)
	windowTitle: string;
	theme: "light" | "dark";
	shadowType: "none" | "subtle" | "medium" | "large";
	windowRoundness: number;
}

export const useCanvasExport = () => {
	const drawWindow = useCallback(
		(ctx: CanvasRenderingContext2D, options: DrawWindowOptions) => {
			const {
				width,
				height,
				backgroundColor,
				backgroundImage,
				bgGradient,
				showTitleBar,
				xMargin,
				windowIsTransparent,
				aspectRatio,
				windowTitle,
				theme,
				shadowType,
				windowRoundness,
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
			} else if (bgGradient.enabled) {
				// Create gradient based on direction
				let gradient: CanvasGradient;
				switch (bgGradient.direction) {
					case "to right":
						gradient = ctx.createLinearGradient(0, 0, width, 0);
						break;
					case "to bottom":
						gradient = ctx.createLinearGradient(0, 0, 0, height);
						break;
					case "to bottom right":
						gradient = ctx.createLinearGradient(0, 0, width, height);
						break;
					case "to bottom left":
						gradient = ctx.createLinearGradient(width, 0, 0, height);
						break;
					default:
						gradient = ctx.createLinearGradient(0, 0, width, 0);
				}

				gradient.addColorStop(0, bgGradient.startColor);
				gradient.addColorStop(1, bgGradient.endColor);

				ctx.fillStyle = gradient;
				ctx.fillRect(0, 0, width, height);
				drawWindowContent();
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
				const titleBarHeight = showTitleBar ? 40 : 0;
				const contentHeight = windowWidth / aspectRatio;
				const windowHeight = contentHeight + titleBarHeight;

				const windowX = paddingX;
				const windowY = (height - windowHeight) / 2;

				// Apply shadow based on shadowType
				const shadowConfig = {
					none: { blur: 0, offsetY: 0 },
					subtle: { blur: 10, offsetY: 2 },
					medium: { blur: 20, offsetY: 4 },
					large: { blur: 30, offsetY: 6 },
				}[shadowType];

				// Draw the entire window background first
				ctx.fillStyle = theme === "light" ? "#ffffff" : "#1a1a1a";
				ctx.shadowColor =
					shadowType === "none" ? "transparent" : "rgba(0, 0, 0, 0.3)";
				ctx.shadowBlur = shadowConfig.blur;
				ctx.shadowOffsetX = 0;
				ctx.shadowOffsetY = shadowConfig.offsetY;

				// Draw the entire window shape with appropriate rounded corners
				ctx.beginPath();
				ctx.roundRect(
					windowX,
					windowY,
					windowWidth,
					windowHeight,
					showTitleBar
						? [
								windowRoundness,
								windowRoundness,
								windowRoundness,
								windowRoundness,
							]
						: [
								windowRoundness,
								windowRoundness,
								windowRoundness,
								windowRoundness,
							],
				);
				ctx.fill();

				// Add a subtle border when there's no shadow
				if (shadowType === "none") {
					ctx.strokeStyle =
						theme === "light"
							? "rgba(0, 0, 0, 0.1)"
							: "rgba(255, 255, 255, 0.1)";
					ctx.lineWidth = 1;
					ctx.stroke();
				}

				// Reset shadow
				ctx.shadowColor = "transparent";

				if (showTitleBar) {
					// Draw window controls
					const controlsY = windowY + titleBarHeight / 2;
					const controlSize = 12;
					const controlGap = 8;
					const controlsX = windowX + 20;

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

					// Draw window title with larger font
					ctx.fillStyle = theme === "light" ? "#000000" : "#ffffff";
					ctx.font = "18px system-ui, -apple-system, sans-serif";
					ctx.textAlign = "center";
					ctx.textBaseline = "middle";
					ctx.fillText(
						windowTitle,
						windowX + windowWidth / 2,
						windowY + titleBarHeight / 2,
					);

					// Draw a subtle separator line between title bar and content
					ctx.strokeStyle =
						theme === "light"
							? "rgba(0, 0, 0, 0.1)"
							: "rgba(255, 255, 255, 0.1)";
					ctx.beginPath();
					ctx.moveTo(windowX, windowY + titleBarHeight);
					ctx.lineTo(windowX + windowWidth, windowY + titleBarHeight);
					ctx.stroke();
				}

				// Draw content area
				if (!windowIsTransparent) {
					ctx.fillStyle = theme === "light" ? "#f0f0f0" : "#2a2a2a";
					ctx.beginPath();
					ctx.roundRect(
						windowX,
						windowY + titleBarHeight,
						windowWidth,
						windowHeight - titleBarHeight,
						showTitleBar
							? [0, 0, windowRoundness, windowRoundness]
							: [
									windowRoundness,
									windowRoundness,
									windowRoundness,
									windowRoundness,
								],
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
						showTitleBar
							? [0, 0, windowRoundness, windowRoundness]
							: [
									windowRoundness,
									windowRoundness,
									windowRoundness,
									windowRoundness,
								],
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
