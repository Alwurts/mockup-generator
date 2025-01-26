"use client";

import { useRef } from "react";
import { useCanvasExport } from "@/hooks/useCanvasExport";
import { PreviewCanvas } from "@/components/PreviewCanvas";
import { ControlPanel } from "@/components/ControlPanel";

export default function Home() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const { exportImage } = useCanvasExport();

	const handleExport = () => {
		if (!canvasRef.current) {
			return;
		}
		exportImage(canvasRef.current);
	};

	return (
		<div className="min-h-screen w-full flex flex-col">
			{/* Navbar */}
			<nav className="w-full border-b">
				<div className="container mx-auto px-4 h-14 flex items-center justify-center">
					<h1 className="text-xl font-semibold">OBS Overlay Generator</h1>
				</div>
			</nav>

			<div className="flex-1 flex flex-col md:flex-row">
				{/* Sidebar for desktop */}
				<aside className="hidden lg:block w-80 p-6 border-r">
					<div className="sticky top-6">
						<ControlPanel onExport={handleExport} />
					</div>
				</aside>

				{/* Main content */}
				<main className="flex-1 p-4 md:p-8 flex flex-col lg:justify-center">
					{/* Canvas Preview */}
					<PreviewCanvas canvasRef={canvasRef} />

					{/* Controls for mobile */}
					<div className="lg:hidden mt-6 bg-white p-6 rounded-lg shadow-md">
						<ControlPanel onExport={handleExport} />
					</div>
				</main>
			</div>
		</div>
	);
}
