import { Skeleton } from "@/components/ui/skeleton";
import { useCanvasExport } from "@/hooks/use-canvas-export";
import { ASPECT_RATIOS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useOverlayStore } from "@/store/overlay-store";
import { useEffect } from "react";
import type { RefObject } from "react";

interface PreviewCanvasProps {
	canvasRef: RefObject<HTMLCanvasElement | null>;
}

function PreviewCanvasSkeleton() {
	return (
		<div className="w-full max-w-5xl mx-auto relative">
			<div
				className="w-full relative"
				style={{
					paddingBottom: `${(1 / (16 / 9)) * 100}%`,
				}}
			>
				<Skeleton className="absolute inset-0 w-full h-full" />
			</div>
		</div>
	);
}

export function PreviewCanvas({ canvasRef }: PreviewCanvasProps) {
	const { drawWindow } = useCanvasExport();
	const isLoading = useOverlayStore((state) => state.isLoading);
	const bgColor = useOverlayStore((state) => state.bgColor);
	const bgImage = useOverlayStore((state) => state.bgImage);
	const bgGradient = useOverlayStore((state) => state.bgGradient);
	const showTitleBar = useOverlayStore((state) => state.showTitleBar);
	const xMargin = useOverlayStore((state) => state.xMargin);
	const windowIsTransparent = useOverlayStore(
		(state) => state.windowIsTransparent,
	);
	const aspectRatio = useOverlayStore((state) => state.aspectRatio);
	const windowTitle = useOverlayStore((state) => state.windowTitle);
	const theme = useOverlayStore((state) => state.theme);
	const shadowType = useOverlayStore((state) => state.shadowType);
	const windowRoundness = useOverlayStore((state) => state.windowRoundness);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas || isLoading) {
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
			bgGradient,
			showTitleBar,
			xMargin,
			windowIsTransparent,
			aspectRatio: currentRatio,
			windowTitle,
			theme,
			shadowType,
			windowRoundness,
		});
	}, [
		bgColor,
		bgImage,
		bgGradient,
		drawWindow,
		showTitleBar,
		xMargin,
		windowIsTransparent,
		aspectRatio,
		windowTitle,
		theme,
		shadowType,
		windowRoundness,
		canvasRef,
		isLoading,
	]);

	if (isLoading) {
		return <PreviewCanvasSkeleton />;
	}

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
						"absolute inset-0 w-full h-full shadow-lg",
						windowIsTransparent
							? theme === "light"
								? "bg-[#f0f0f0]"
								: "bg-[#2a2a2a]"
							: "",
					)}
				/>

				<div
					className={cn(
						"absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-10",
						theme === "light" ? "text-black" : "text-white",
					)}
				>
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
