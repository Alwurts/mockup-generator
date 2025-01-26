import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ASPECT_RATIOS } from "@/lib/constants";

interface OverlayState {
	bgColor: string;
	bgImage: string | null;
	showTitleBar: boolean;
	xMargin: number;
	windowIsTransparent: boolean;
	aspectRatio: string;
	setBgColor: (color: string) => void;
	setBgImage: (image: string | null) => void;
	setShowTitleBar: (show: boolean) => void;
	setXMargin: (margin: number) => void;
	setWindowIsTransparent: (use: boolean) => void;
	setAspectRatio: (ratio: string) => void;
}

export const useOverlayStore = create<OverlayState>()(
	persist(
		(set) => ({
			bgColor: "#6B4984",
			bgImage: null,
			showTitleBar: true,
			xMargin: 8,
			windowIsTransparent: false,
			aspectRatio: ASPECT_RATIOS[0].label,
			setBgColor: (color) => set({ bgColor: color }),
			setBgImage: (image) => set({ bgImage: image }),
			setShowTitleBar: (show) => set({ showTitleBar: show }),
			setXMargin: (margin) => set({ xMargin: margin }),
			setWindowIsTransparent: (use) => set({ windowIsTransparent: use }),
			setAspectRatio: (ratio) => set({ aspectRatio: ratio }),
		}),
		{
			name: "overlay-storage",
		},
	),
);
