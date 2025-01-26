"use client";

import { useState, useRef, useEffect } from "react";
import { useCanvasExport } from "@/hooks/useCanvasExport";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";

export default function Home() {
	const [bgColor, setBgColor] = useState("#6B4984");
	const [showTitleBar, setShowTitleBar] = useState(true);
	const [xPadding, setXPadding] = useState(5); // 5% padding by default
	const [useTransparency, setUseTransparency] = useState(false);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const { drawWindow, exportImage } = useCanvasExport();

	const handleExport = () => {
		if (!canvasRef.current) {
			return;
		}
		exportImage(canvasRef.current);
	};

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) {
			return;
		}

		// Set canvas size (16:9 aspect ratio)
		const width = 1920; // Full HD width
		const height = 1080; // Full HD height
		canvas.width = width;
		canvas.height = height;

		const ctx = canvas.getContext("2d");
		if (!ctx) {
			return;
		}

		// Clear canvas
		ctx.clearRect(0, 0, width, height);

		// Draw window
		drawWindow(ctx, {
			width,
			height,
			backgroundColor: bgColor,
			showTitleBar,
			xPadding,
			useTransparency,
		});
	}, [bgColor, drawWindow, showTitleBar, xPadding, useTransparency]);

	return (
		<main className="min-h-screen flex flex-col items-center justify-center p-3 md:p-8 relative">
			{/* Controls */}
			<div className="fixed top-5 left-5 bg-white p-6 rounded-lg shadow-md space-y-6 min-w-80">
				<div className="space-y-4">
					<div className="flex flex-col gap-2">
						<Label htmlFor="bgColor">Background Color</Label>
						<input
							type="color"
							id="bgColor"
							value={bgColor}
							onChange={(e) => setBgColor(e.target.value)}
							className="w-full h-10 rounded-md cursor-pointer"
						/>
					</div>

					<div className="flex items-center justify-between">
						<Label htmlFor="titleBar">Show Title Bar</Label>
						<Switch
							id="titleBar"
							checked={showTitleBar}
							onCheckedChange={setShowTitleBar}
						/>
					</div>

					<div className="flex items-center justify-between">
						<Label htmlFor="transparency">Use Transparency</Label>
						<Switch
							id="transparency"
							checked={useTransparency}
							onCheckedChange={setUseTransparency}
						/>
					</div>

					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<Label htmlFor="padding">X-Axis Padding</Label>
							<span className="text-sm text-muted-foreground">{xPadding}%</span>
						</div>
						<Slider
							id="padding"
							min={0}
							max={40}
							step={1}
							value={[xPadding]}
							onValueChange={(values: number[]) => setXPadding(values[0])}
						/>
					</div>
				</div>

				<Button onClick={handleExport} className="w-full">
					Export PNG
				</Button>
			</div>

			{/* Canvas Preview */}
			<canvas
				ref={canvasRef}
				className="w-full max-w-7xl aspect-video rounded-lg shadow-2xl"
				style={{
					background:
						"repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 20px 20px",
				}}
			/>
		</main>
	);
}
