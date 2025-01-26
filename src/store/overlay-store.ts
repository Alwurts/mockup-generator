import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface OverlayState {
	isLoading: boolean;
	bgColor: string;
	bgImage: string | null;
	bgGradient: {
		enabled: boolean;
		startColor: string;
		endColor: string;
		direction: "to right" | "to bottom" | "to bottom right" | "to bottom left";
	};
	showTitleBar: boolean;
	xMargin: number;
	windowIsTransparent: boolean;
	aspectRatio: string;
	windowTitle: string;
	theme: "light" | "dark";
	shadowType: "none" | "subtle" | "medium" | "large";
	windowRoundness: number;
}

interface OverlayActions {
	setIsLoading: (loading: boolean) => void;
	setBgColor: (color: string) => void;
	setBgImage: (image: string | null) => void;
	setBgGradient: (gradient: OverlayState["bgGradient"]) => void;
	setShowTitleBar: (show: boolean) => void;
	setXMargin: (margin: number) => void;
	setWindowIsTransparent: (isTransparent: boolean) => void;
	setAspectRatio: (ratio: string) => void;
	setWindowTitle: (title: string) => void;
	setTheme: (theme: "light" | "dark") => void;
	setShadowType: (shadowType: "none" | "subtle" | "medium" | "large") => void;
	setWindowRoundness: (roundness: number) => void;
}

const initialState: OverlayState = {
	isLoading: true,
	bgColor: "#f0f0f0",
	bgImage: null,
	bgGradient: {
		enabled: false,
		startColor: "#ffffff",
		endColor: "#e0e0e0",
		direction: "to right",
	},
	showTitleBar: true,
	xMargin: 10,
	windowIsTransparent: true,
	aspectRatio: "16:9",
	windowTitle: "Window Title",
	theme: "light",
	shadowType: "medium",
	windowRoundness: 8,
};

export const useOverlayStore = create<OverlayState & OverlayActions>()(
	persist(
		(set) => ({
			...initialState,
			setIsLoading: (loading: boolean) => set({ isLoading: loading }),
			setBgColor: (color: string) => set({ bgColor: color }),
			setBgImage: (image: string | null) => set({ bgImage: image }),
			setBgGradient: (gradient) => set({ bgGradient: gradient }),
			setShowTitleBar: (show: boolean) => set({ showTitleBar: show }),
			setXMargin: (margin: number) => set({ xMargin: margin }),
			setWindowIsTransparent: (isTransparent: boolean) =>
				set({ windowIsTransparent: isTransparent }),
			setAspectRatio: (ratio: string) => set({ aspectRatio: ratio }),
			setWindowTitle: (title: string) => set({ windowTitle: title }),
			setTheme: (theme: "light" | "dark") => set({ theme: theme }),
			setShadowType: (shadowType: "none" | "subtle" | "medium" | "large") =>
				set({ shadowType: shadowType }),
			setWindowRoundness: (roundness: number) =>
				set({ windowRoundness: roundness }),
		}),
		{
			name: "overlay-store",
			storage: createJSONStorage(() => localStorage),
			onRehydrateStorage: () => (state) => {
				state?.setIsLoading(false);
			},
		},
	),
);
