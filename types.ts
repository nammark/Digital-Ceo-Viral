

export interface SlideSticker {
  url: string;
  label: string;
  scale: number;
}

export interface Slide {
  id: string;
  type: 'intro' | 'content';
  title: string;
  content: string[]; // Bullet points or paragraph
  images: string[]; // Base64 strings for inline illustrations
  stickerLeft?: SlideSticker;
  stickerRight?: SlideSticker;
  generatedImageUrl?: string; // Preview image for this specific slide
}

export interface ViralContent {
  caption: string;
  slides: Slide[];
}

export interface GeneratedImage {
  id: string;
  url: string;
  slide: Slide;
}

export enum AppStep {
  INPUT = 0,
  PLANNING = 1,
  GENERATION = 2,
}

export interface StyleConfig {
  backgroundId: string; // Now acts as an ID for presets or 'custom'
  backgroundImageUrl?: string; // The actual URL to load
  customBackground?: string; // Base64 for user uploads
  titleFont: string;
  bodyFont: string;
  overlayColor?: string;
  overlayOpacity?: number; // 0-100
}

export interface CanvasConfig {
  width: number;
  height: number;
  padding: number;
  author: string;
  style: StyleConfig;
}