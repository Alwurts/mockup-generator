import { useEffect } from "react";
import type { RefObject } from "react";
import { useCanvasExport } from "@/hooks/useCanvasExport";
import { ASPECT_RATIOS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useOverlayStore } from "@/store/overlayStore";

interface PreviewCanvasProps {
	canvasRef: RefObject<HTMLCanvasElement | null>;
}

export function PreviewCanvas({ canvasRef }: PreviewCanvasProps) {
	const { drawWindow } = useCanvasExport();
	const bgColor = useOverlayStore((state) => state.bgColor);
	const bgImage = useOverlayStore((state) => state.bgImage);
	const showTitleBar = useOverlayStore((state) => state.showTitleBar);
	const xMargin = useOverlayStore((state) => state.xMargin);
	const windowIsTransparent = useOverlayStore(
		(state) => state.windowIsTransparent,
	);
	const aspectRatio = useOverlayStore((state) => state.aspectRatio);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) {
			return;
		}

		// Get the current aspect ratio value
		const currentRatio =
			ASPECT_RATIOS.find(
				(r: { label: string; value: number }) => r.label === aspectRatio,
			)?.value || 16 / 9;

		// Set canvas size based on aspect ratio
		const width = 1920;
		const height = Math.round(width / currentRatio);
		canvas.width = width;
		canvas.height = height;

		const ctx = canvas.getContext("2d");
		if (!ctx) {
			return;
		}

		ctx.clearRect(0, 0, width, height);

		drawWindow(ctx, {
			width,
			height,
			backgroundColor: bgColor,
			backgroundImage: bgImage,
			showTitleBar,
			xMargin,
			windowIsTransparent,
			aspectRatio: currentRatio,
		});
	}, [
		bgColor,
		bgImage,
		drawWindow,
		showTitleBar,
		xMargin,
		windowIsTransparent,
		aspectRatio,
		canvasRef,
	]);

	return (
		<div className="w-full max-w-5xl mx-auto relative">
			<div
				className="w-full relative"
				style={{
					paddingBottom: `${
						(1 /
							(ASPECT_RATIOS.find((r) => r.label === aspectRatio)?.value ||
								16 / 9)) *
						100
					}%`,
				}}
			>
				<canvas
					ref={canvasRef}
					className={cn(
						"absolute inset-0 w-full h-full rounded-lg shadow-2xl",
						windowIsTransparent ? "bg-[#ccc]" : "",
					)}
				/>

				<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-10">
					<p className="text-lg font-medium">Your Video Recording Goes Here</p>
					{windowIsTransparent && (
						<p className="text-sm">
							(This area will be transparent in the exported image)
						</p>
					)}
				</div>
			</div>
		</div>
	);
}
