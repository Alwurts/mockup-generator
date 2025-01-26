"use client";

import { ControlPanel } from "@/components/control-panel";
import { PreviewCanvas } from "@/components/preview-canvas";
import { useCanvasExport } from "@/hooks/use-canvas-export";
import { useRef } from "react";

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
		<div className="h-screen w-full flex flex-col overflow-hidden">
			{/* Navbar */}
			<nav className="w-full border-b flex-none">
				<div className="container mx-auto px-4 h-14 flex items-center justify-center">
					<h1 className="text-xl font-semibold">Desktop Mockup Generator</h1>
				</div>
			</nav>

			<div className="flex-1 flex flex-col md:flex-row overflow-hidden">
				{/* Sidebar for desktop */}
				<aside className="hidden lg:block w-80 border-r flex-none">
					<div className="h-[calc(100vh-3.5rem)] overflow-y-auto p-6">
						<ControlPanel onExport={handleExport} />
					</div>
				</aside>

				{/* Main content */}
				<main className="flex-1 p-4 md:p-8 flex flex-col lg:justify-center overflow-y-auto">
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
