import type React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ASPECT_RATIOS } from "@/lib/constants";
import { Slider } from "@/components/ui/slider";
import { useOverlayStore } from "@/store/overlayStore";

interface ControlPanelProps {
	onExport: () => void;
}

export function ControlPanel({ onExport }: ControlPanelProps) {
	const bgColor = useOverlayStore((state) => state.bgColor);
	const setBgColor = useOverlayStore((state) => state.setBgColor);
	const bgImage = useOverlayStore((state) => state.bgImage);
	const setBgImage = useOverlayStore((state) => state.setBgImage);
	const showTitleBar = useOverlayStore((state) => state.showTitleBar);
	const setShowTitleBar = useOverlayStore((state) => state.setShowTitleBar);
	const xMargin = useOverlayStore((state) => state.xMargin);
	const setXMargin = useOverlayStore((state) => state.setXMargin);
	const windowIsTransparent = useOverlayStore(
		(state) => state.windowIsTransparent,
	);
	const setWindowIsTransparent = useOverlayStore(
		(state) => state.setWindowIsTransparent,
	);
	const aspectRatio = useOverlayStore((state) => state.aspectRatio);
	const setAspectRatio = useOverlayStore((state) => state.setAspectRatio);

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) {
			return;
		}

		// Check file size and dimensions
		const img = new Image();
		img.onload = () => {
			URL.revokeObjectURL(img.src);
			if (img.width < 600 || img.height < 600) {
				alert("Image must be at least 600x600 pixels");
				return;
			}

			// Convert to base64 for storage
			const reader = new FileReader();
			reader.onloadend = () => {
				setBgImage(reader.result as string);
			};
			reader.readAsDataURL(file);
		};
		img.src = URL.createObjectURL(file);
	};

	return (
		<div className="space-y-6 w-full">
			{/* Color Settings */}
			<Card>
				<CardHeader>
					<CardTitle>Color Settings</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col gap-4">
						<div className="flex flex-col gap-2">
							<Label htmlFor="bgImage">Background Image</Label>
							<input
								type="file"
								id="bgImage"
								accept="image/*"
								onChange={handleImageUpload}
								className="w-full cursor-pointer"
							/>
							<p className="text-sm text-muted-foreground">
								Image must be at least 600x600 pixels
							</p>
						</div>

						<div className="flex flex-col gap-2">
							<div className="flex items-center justify-between">
								<Label htmlFor="bgColor">Background Color</Label>
								<Button
									variant="outline"
									size="sm"
									onClick={() => setBgImage(null)}
									className="text-sm"
									disabled={!bgImage}
								>
									Remove Image
								</Button>
							</div>
							<div className="flex gap-2 items-center">
								<input
									type="color"
									id="bgColor"
									value={bgColor}
									onChange={(e) => setBgColor(e.target.value)}
									className="w-12 h-12 rounded border p-1"
									disabled={!!bgImage}
								/>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Layout Settings */}
			<Card>
				<CardHeader>
					<CardTitle>Layout Settings</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex flex-col gap-2">
						<Label htmlFor="aspectRatio">Aspect Ratio</Label>
						<Select value={aspectRatio} onValueChange={setAspectRatio}>
							<SelectTrigger>
								<SelectValue placeholder="Select aspect ratio" />
							</SelectTrigger>
							<SelectContent>
								{ASPECT_RATIOS.map((ratio) => (
									<SelectItem key={ratio.label} value={ratio.label}>
										{ratio.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="flex items-center justify-between">
						<Label htmlFor="titleBar">Show Title Bar</Label>
						<Switch
							id="titleBar"
							checked={showTitleBar}
							onCheckedChange={setShowTitleBar}
						/>
					</div>

					<div className="flex flex-col gap-2">
						<div className="flex items-center justify-between">
							<Label htmlFor="windowSize">Window Margin</Label>
							<span className="text-sm text-muted-foreground">{xMargin}%</span>
						</div>
						<Slider
							id="windowSize"
							min={5}
							max={30}
							step={1}
							value={[xMargin]}
							onValueChange={(value) => setXMargin(value[0])}
						/>
					</div>
				</CardContent>
			</Card>

			{/* Export Settings */}
			<Card>
				<CardHeader>
					<CardTitle>Export Settings</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex items-center justify-between">
						<Label htmlFor="transparency">Use Transparency</Label>
						<Switch
							id="transparency"
							checked={windowIsTransparent}
							onCheckedChange={setWindowIsTransparent}
						/>
					</div>

					<Button onClick={onExport} className="w-full">
						Export PNG
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
