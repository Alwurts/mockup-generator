import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ASPECT_RATIOS } from "@/lib/constants";
import { useOverlayStore } from "@/store/overlay-store";
import { usePlausible } from "next-plausible";
import type React from "react";

interface ControlPanelProps {
	onExport: () => void;
}

function ControlPanelSkeleton() {
	return (
		<div className="space-y-6 w-full">
			{/* Theme & Appearance Skeleton */}
			<Card>
				<CardHeader>
					<CardTitle>Theme & Appearance</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col gap-4">
						<div className="space-y-2">
							<Skeleton className="h-4 w-20" />
							<Skeleton className="h-10 w-full" />
						</div>
						<div className="space-y-2">
							<Skeleton className="h-4 w-32" />
							<Skeleton className="h-10 w-full" />
						</div>
						<div className="space-y-2">
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-10 w-full" />
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Background Settings Skeleton */}
			<Card>
				<CardHeader>
					<CardTitle>Background</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col gap-4">
						<div className="space-y-2">
							<Skeleton className="h-4 w-28" />
							<Skeleton className="h-10 w-full" />
						</div>
						<div className="space-y-2">
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-10 w-full" />
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Window Settings Skeleton */}
			<Card>
				<CardHeader>
					<CardTitle>Window Settings</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Skeleton className="h-4 w-24" />
						<Skeleton className="h-10 w-full" />
					</div>
					<div className="space-y-2">
						<Skeleton className="h-4 w-28" />
						<Skeleton className="h-10 w-full" />
					</div>
					<div className="space-y-2">
						<Skeleton className="h-4 w-20" />
						<Skeleton className="h-10 w-full" />
					</div>
				</CardContent>
			</Card>

			{/* Export Settings Skeleton */}
			<Card>
				<CardHeader>
					<CardTitle>Export Settings</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Skeleton className="h-4 w-32" />
						<Skeleton className="h-10 w-full" />
					</div>
					<Skeleton className="h-10 w-full" />
				</CardContent>
			</Card>
		</div>
	);
}

export function ControlPanel({ onExport }: ControlPanelProps) {
	const plausible = usePlausible();
	const isLoading = useOverlayStore((state) => state.isLoading);
	const bgColor = useOverlayStore((state) => state.bgColor);
	const setBgColor = useOverlayStore((state) => state.setBgColor);
	const bgImage = useOverlayStore((state) => state.bgImage);
	const setBgImage = useOverlayStore((state) => state.setBgImage);
	const bgGradient = useOverlayStore((state) => state.bgGradient);
	const setBgGradient = useOverlayStore((state) => state.setBgGradient);
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
	const windowTitle = useOverlayStore((state) => state.windowTitle);
	const setWindowTitle = useOverlayStore((state) => state.setWindowTitle);
	const theme = useOverlayStore((state) => state.theme);
	const setTheme = useOverlayStore((state) => state.setTheme);
	const shadowType = useOverlayStore((state) => state.shadowType);
	const setShadowType = useOverlayStore((state) => state.setShadowType);
	const windowRoundness = useOverlayStore((state) => state.windowRoundness);
	const setWindowRoundness = useOverlayStore(
		(state) => state.setWindowRoundness,
	);

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

	const handleExport = () => {
		plausible("export-image", {
			props: {
				theme,
				aspectRatio,
				hasBackgroundImage: !!bgImage,
				hasGradient: bgGradient.enabled,
				isTransparent: windowIsTransparent,
			},
		});
		onExport();
	};

	if (isLoading) {
		return <ControlPanelSkeleton />;
	}

	return (
		<div className="space-y-6 w-full">
			{/* Theme & Appearance */}
			<Card>
				<CardHeader>
					<CardTitle>Theme & Appearance</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col gap-4">
						<div className="flex flex-col gap-2">
							<Label htmlFor="theme">Theme</Label>
							<Select value={theme} onValueChange={setTheme}>
								<SelectTrigger>
									<SelectValue placeholder="Select theme" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="light">Light</SelectItem>
									<SelectItem value="dark">Dark</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="flex flex-col gap-2">
							<div className="flex items-center justify-between">
								<Label htmlFor="windowRoundness">Window Roundness</Label>
								<span className="text-sm text-muted-foreground">
									{windowRoundness}px
								</span>
							</div>
							<Slider
								id="windowRoundness"
								min={0}
								max={30}
								step={1}
								value={[windowRoundness]}
								onValueChange={(value) => setWindowRoundness(value[0])}
							/>
						</div>

						<div className="flex flex-col gap-2">
							<Label htmlFor="shadowType">Window Shadow</Label>
							<Select value={shadowType} onValueChange={setShadowType}>
								<SelectTrigger>
									<SelectValue placeholder="Select shadow type" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="none">None</SelectItem>
									<SelectItem value="subtle">Subtle</SelectItem>
									<SelectItem value="medium">Medium</SelectItem>
									<SelectItem value="large">Large</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Background Settings */}
			<Card>
				<CardHeader>
					<CardTitle>Background</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col gap-4">
						<div className="flex flex-col gap-2">
							<Label htmlFor="bgImage">Background Image</Label>
							<div className="flex gap-2">
								<Button
									variant="secondary"
									className="flex-1"
									onClick={() => document.getElementById("bgImage")?.click()}
								>
									Choose Image
								</Button>
								{bgImage && (
									<Button variant="outline" onClick={() => setBgImage(null)}>
										Remove
									</Button>
								)}
							</div>
							<input
								type="file"
								id="bgImage"
								accept="image/*"
								onChange={handleImageUpload}
								className="hidden"
							/>
							<p className="text-sm text-muted-foreground">
								Image must be at least 600x600 pixels
							</p>
						</div>

						<div className="flex items-center justify-between">
							<Label htmlFor="gradientToggle">Use Gradient</Label>
							<Switch
								id="gradientToggle"
								checked={bgGradient.enabled}
								onCheckedChange={(enabled) =>
									setBgGradient({ ...bgGradient, enabled })
								}
								disabled={!!bgImage}
							/>
						</div>

						{bgGradient.enabled && !bgImage ? (
							<div className="space-y-4">
								<div className="flex flex-col gap-2">
									<Label>Gradient Colors</Label>
									<div className="flex gap-4">
										<div className="flex-1 space-y-2">
											<Label
												htmlFor="startColor"
												className="text-sm text-muted-foreground"
											>
												Start Color
											</Label>
											<input
												type="color"
												id="startColor"
												value={bgGradient.startColor}
												onChange={(e) =>
													setBgGradient({
														...bgGradient,
														startColor: e.target.value,
													})
												}
												className="w-full h-10 rounded border p-1"
											/>
										</div>
										<div className="flex-1 space-y-2">
											<Label
												htmlFor="endColor"
												className="text-sm text-muted-foreground"
											>
												End Color
											</Label>
											<input
												type="color"
												id="endColor"
												value={bgGradient.endColor}
												onChange={(e) =>
													setBgGradient({
														...bgGradient,
														endColor: e.target.value,
													})
												}
												className="w-full h-10 rounded border p-1"
											/>
										</div>
									</div>
								</div>

								<div className="flex flex-col gap-2">
									<Label htmlFor="gradientDirection">Direction</Label>
									<Select
										value={bgGradient.direction}
										onValueChange={(direction: typeof bgGradient.direction) =>
											setBgGradient({ ...bgGradient, direction })
										}
									>
										<SelectTrigger>
											<SelectValue placeholder="Select direction" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="to right">Horizontal</SelectItem>
											<SelectItem value="to bottom">Vertical</SelectItem>
											<SelectItem value="to bottom right">
												Diagonal Right
											</SelectItem>
											<SelectItem value="to bottom left">
												Diagonal Left
											</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
						) : (
							<div className="flex flex-col gap-2">
								<Label htmlFor="bgColor">Background Color</Label>
								<div className="flex gap-2 items-center">
									<input
										type="color"
										id="bgColor"
										value={bgColor}
										onChange={(e) => setBgColor(e.target.value)}
										className="w-12 h-12 rounded border p-1"
										disabled={!!bgImage}
									/>
									{bgImage && (
										<p className="text-sm text-muted-foreground">
											Color picker is disabled while using background image
										</p>
									)}
								</div>
							</div>
						)}
					</div>
				</CardContent>
			</Card>

			{/* Window Settings */}
			<Card>
				<CardHeader>
					<CardTitle>Window Settings</CardTitle>
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

					<div className="flex items-center justify-between">
						<Label htmlFor="titleBar">Show Title Bar</Label>
						<Switch
							id="titleBar"
							checked={showTitleBar}
							onCheckedChange={setShowTitleBar}
						/>
					</div>

					{showTitleBar && (
						<div className="flex flex-col gap-2">
							<Label htmlFor="windowTitle">Window Title</Label>
							<input
								type="text"
								id="windowTitle"
								value={windowTitle}
								onChange={(e) => setWindowTitle(e.target.value)}
								className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
								placeholder="Enter window title"
							/>
						</div>
					)}
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

					<Button onClick={handleExport} className="w-full">
						Export PNG
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
