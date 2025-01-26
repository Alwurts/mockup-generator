export type AspectRatio = {
	label: string;
	value: number;
};

export const ASPECT_RATIOS: AspectRatio[] = [
	{ label: "16:9", value: 16 / 9 },
	{ label: "4:3", value: 4 / 3 },
	{ label: "1:1", value: 1 },
	{ label: "21:9", value: 21 / 9 },
];

export type WindowSizeOption = {
	label: string;
	value: number;
};
