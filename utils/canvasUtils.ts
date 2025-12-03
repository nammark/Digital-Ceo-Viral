

import { Slide, CanvasConfig, StyleConfig, SlideSticker } from "../types";

export const PRESET_BACKGROUNDS = [
  "https://storage.googleapis.com/msgsndr/76jwxJS0DcAVoeVK00Z6/media/6929846a2940a7d10b32c59a.png", // Default
  "https://storage.googleapis.com/msgsndr/76jwxJS0DcAVoeVK00Z6/media/692984732940a7a59032c6b3.png",
  "https://storage.googleapis.com/msgsndr/76jwxJS0DcAVoeVK00Z6/media/692984737f38c94282e1c00b.png",
  "https://storage.googleapis.com/msgsndr/76jwxJS0DcAVoeVK00Z6/media/69298473572134d7f498f15a.png",
  "https://storage.googleapis.com/msgsndr/76jwxJS0DcAVoeVK00Z6/media/692984736a32b27dfe94cd8c.png",
  "https://storage.googleapis.com/msgsndr/76jwxJS0DcAVoeVK00Z6/media/692984736a32b23dff94cd8b.png",
  "https://storage.googleapis.com/msgsndr/76jwxJS0DcAVoeVK00Z6/media/692984736a32b2145494cd98.png",
  "https://storage.googleapis.com/msgsndr/76jwxJS0DcAVoeVK00Z6/media/692984736a32b2363194cd97.png"
];

// Base64 SVGs for reliability
const SVG_ARROW_RIGHT_RED = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI0VGNDQ0NCI+PHBhdGggZD0iTTE2LjE3MiAxMUwxMC44MDggNS42MzYwNUwxMi4yMjIgNC4yMjIwNUwyMCAxMkwxMi4yMjIgMTkuNzc4TTEwLjgwOCAxOC4zNjRMMTYuMTcyIDEzSDRWMTFIMTYuMTcyWiIvPjwvc3ZnPg==";
const SVG_ARROW_LEFT_RED = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI0VGNDQ0NCI+PHBhdGggZD0iTTcuODI4IDExTDEzLjE5MiA1LjYzNjA1TExuNzc4IDQuMjIyMDVMNCAxMkwxMS43NzggMTkuNzc4TDEzLjE5MiAxOC4zNjRMNy44MjggMTNIMjBWMTFINy44MjhaIi8+PC9zdmc+";

const SVG_HAND_RIGHT = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI0YzQTYxQyI+PHBhdGggZD0iTTIxLDlsLTUtMS43NVY1YzAtMS4xLTAuOS0yLTItMnMtMiwwLjktMiwydjNsLTIuNjUsMC41M2MtMC45NSwwLjE5LTEuNjUsMS4wMi0xLjY1LDEuOTl2Ny45N2MwLDEuMSwwLjksMiwyLDJ2MCBjMC42LDAsMS4xNC0wLjI3LDEuNS0wLjczbDQuMTUtNS4xOGw0LjUsMS41YzEuMSwwLjM3LDIuMTUsMC4wOCwyLjYtMC44bDAsMGMwLjY2LTEuMjksMC4xNC0yLjg2LTEuMTctMy4zTDIxLDl6Ii8+PC9zdmc+";
const SVG_HAND_LEFT = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iI0YzQTYxQyIgdHJhbnNmb3JtPSJzY2FsZSgtMSwgMSkiPjxwYXRoIGQ9Ik0yMSw5bC01LTEuNzVWNWMwLTEuMS0wLjktMi0yLTJzLTIsMC45LTIsMnYzWi0yLjY1LDAuNTNjLTAuOTUsMC4xOS0xLjY1LDEuMDItMS42NSwxLjk5djcuOTdjMCwxLjEsMC45LDIsMiwydjAgYzAuNiwwLDEuMTQtMC4yNywxLjUtMC43M2w0LjE1LTUuMThsNC41LDEuNWMxLjEsMC4zNywyLjE1LDAuMDgsMi42LTAuOGwwLDBjMC42Ni0xLjI5LDAuMTQtMi44Ni0xLjE3LTMuM0wyMSw5eiIvPjwvc3ZnPg==";

const SVG_CIRCLE_ARROW_RIGHT = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzExMTgyNyI+PHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyUzYuNDggMjIgMTIgMjIyMiAxNy41MiAyMiAxMlMxNy41MiAyIDEyIDJaTTEyIDIwQzcuNTkgMjAgNCAxNi40MSA0IDEyUzcuNTkgNCAxMiA0IDIwIDcuNTkgMjAgMTIgMTYuNDEgMjAgMTIgMjBaTTExIDE2TDExIDhMMTYgMTJMMTEgMTZaIi8+PC9zdmc+";
const SVG_CIRCLE_ARROW_LEFT = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzExMTgyNyIgdHJhbnNmb3JtPSJyb3RhdGUoMTgwLCAxMiwgMTIpIj48cGF0aCBkPSZNMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJTNi40OCAyMiAxMiAyMjIyIDE3LjUyIDIyIDEyUzE3LjUyIDIgMTIgMlpNMTIgMjBDNy41OSAyMCA0IDE2LjQxIDQgMTJTN44NTkgNCAxMiA0IDIwIDcuNTkgMjAgMTIgMTYuNDEgMjAgMTIgMjBaTTExIDE2TDExIDhMMTYgMTJMMTEgMTZaIi8+PC9zdmc+";

const SVG_CHEVRON_RIGHT = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMGI0YTZlIiBzdHJva2Utd2lkdGg9IjMiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBvbHlsaW5lIHBvaW50cz0iOSAxOCAxNSAxMiA5IDYiPjwvcG9seWxpbmU+PC9zdmc+";
const SVG_CHEVRON_LEFT = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMGI0YTZlIiBzdHJva2Utd2lkdGg9IjMiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBvbHlsaW5lIHBvaW50cz0iMTUgMTggOSAxMiAxNSA2Ij48L3BvbHlsaW5lPjwvc3ZnPg==";

export const STICKER_PRESETS_LEFT = [
    SVG_ARROW_LEFT_RED,
    SVG_HAND_LEFT,
    SVG_CIRCLE_ARROW_LEFT,
    SVG_CHEVRON_LEFT
];

export const STICKER_PRESETS_RIGHT = [
    SVG_ARROW_RIGHT_RED,
    SVG_HAND_RIGHT,
    SVG_CIRCLE_ARROW_RIGHT,
    SVG_CHEVRON_RIGHT
];

export const DEFAULT_STYLE: StyleConfig = {
  backgroundId: 'preset-0',
  backgroundImageUrl: PRESET_BACKGROUNDS[0],
  titleFont: 'Montserrat',
  bodyFont: 'Merriweather',
  overlayColor: '#000000',
  overlayOpacity: 0,
};

export const DEFAULT_CONFIG: CanvasConfig = {
  width: 1080,
  height: 1080, // Square format
  padding: 80,
  author: "@ContentCreator",
  style: DEFAULT_STYLE,
};

// --- Helpers ---

const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => resolve(img);
        img.onerror = (e) => reject(e);
        img.src = src;
    });
};

function measureWrappedTextHeight(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  lineHeight: number
): number {
  const words = text.split(" ");
  let line = "";
  let height = lineHeight;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;

    if (testWidth > maxWidth && n > 0) {
      line = words[n] + " ";
      height += lineHeight;
    } else {
      line = testLine;
    }
  }
  return height;
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
): number {
  const words = text.split(" ");
  let line = "";
  let currentY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + " ";
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;

    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, currentY);
      line = words[n] + " ";
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, currentY);
  return currentY + lineHeight;
}

// Draw Background and return suggested text color
async function drawBackground(ctx: CanvasRenderingContext2D, config: CanvasConfig): Promise<string> {
    const { width, height, style } = config;
    let textColor = "#111827"; // Default Dark

    try {
        let imgUrl = style.backgroundImageUrl;
        
        // Use custom background if type is custom
        if (style.backgroundId === 'custom' && style.customBackground) {
            imgUrl = style.customBackground;
        }

        if (imgUrl) {
             const img = await loadImage(imgUrl);
             // Draw image cover (crop to fill)
             const ratio = Math.max(width / img.width, height / img.height);
             const centerShift_x = (width - img.width * ratio) / 2;
             const centerShift_y = (height - img.height * ratio) / 2;
             ctx.drawImage(img, 0, 0, img.width, img.height, centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
        } else {
             ctx.fillStyle = "#FDFBF7";
             ctx.fillRect(0, 0, width, height);
        }

        // --- DRAW OVERLAY ---
        if (style.overlayColor && style.overlayOpacity && style.overlayOpacity > 0) {
            ctx.save();
            ctx.fillStyle = style.overlayColor;
            ctx.globalAlpha = style.overlayOpacity / 100;
            ctx.fillRect(0, 0, width, height);
            ctx.restore();
        }

    } catch (e) {
        console.error("Failed to load background", e);
        ctx.fillStyle = "#FDFBF7";
        ctx.fillRect(0, 0, width, height);
    }
    
    return textColor;
}

async function drawSticker(
    ctx: CanvasRenderingContext2D, 
    sticker: SlideSticker, 
    side: 'left' | 'right', 
    config: CanvasConfig, 
    titleFontFamily: string
) {
    if (!sticker.url) return;
    try {
        const stickerImg = await loadImage(sticker.url);
        const baseSize = 120;
        const scale = sticker.scale || 1.0;
        const stickerW = baseSize * scale;
        const stickerH = (stickerImg.height / stickerImg.width) * stickerW;
        
        const footerSpace = 80;
        let stickerX = 0;
        
        if (side === 'left') {
            stickerX = config.padding;
        } else {
            stickerX = config.width - config.padding - stickerW;
        }
        
        const stickerY = config.height - config.padding - footerSpace - stickerH; // Above footer

        ctx.drawImage(stickerImg, stickerX, stickerY, stickerW, stickerH);
        
        if (sticker.label) {
            ctx.fillStyle = "#111827"; // Default dark text
            // Simple contrast check could go here, but defaulting to dark/bold
            
            ctx.font = `700 ${24 * scale}px '${titleFontFamily}', sans-serif`;
            ctx.textAlign = "center";
            ctx.fillText(sticker.label, stickerX + stickerW/2, stickerY + stickerH + 10);
        }
    } catch (e) {
        console.error(`Failed to draw ${side} sticker`, e);
    }
}

export const generateSlideImage = async (
  slide: Slide,
  authorName: string,
  style: StyleConfig
): Promise<string> => {
  const config = { ...DEFAULT_CONFIG, style, author: authorName };
  
  const canvas = document.createElement("canvas");
  canvas.width = config.width;
  canvas.height = config.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Cannot get 2d context");

  // 1. Draw Background
  const textColor = await drawBackground(ctx, config);

  // 2. Setup Base Variables
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  
  const padding = config.padding;
  const maxWidth = config.width - padding * 2;
  const bottomLimit = config.height - padding - 60; // Leave space for footer
  let cursorY = padding;

  const titleFontFamily = style.titleFont || 'Montserrat';
  const bodyFontFamily = style.bodyFont || 'Merriweather';

  // --- INTRO SLIDE SPECIAL HANDLING ---
  if (slide.type === "intro") {
     ctx.textAlign = "center";
     const centerX = config.width / 2;
     
     // 1. Draw Title
     // Allow title to take up to 40% of height max, else scale down
     let titleFontSize = 85;
     const maxTitleHeight = config.height * 0.4;
     let titleLineHeight = titleFontSize * 1.25;
     
     // Auto-fit title
     ctx.font = `800 ${titleFontSize}px '${titleFontFamily}', sans-serif`;
     let measuredTitleH = measureWrappedTextHeight(ctx, slide.title, maxWidth, titleLineHeight);
     
     while (measuredTitleH > maxTitleHeight && titleFontSize > 40) {
         titleFontSize -= 5;
         titleLineHeight = titleFontSize * 1.25;
         ctx.font = `800 ${titleFontSize}px '${titleFontFamily}', sans-serif`;
         measuredTitleH = measureWrappedTextHeight(ctx, slide.title, maxWidth, titleLineHeight);
     }

     // 2. Images (if any)
     let imageAreaHeight = 0;
     const hasImages = slide.images && slide.images.length > 0;
     
     if (hasImages) {
         // Allocate 40% height for images
         imageAreaHeight = config.height * 0.4;
     }

     // 3. Sub-content (if any)
     let contentAreaHeight = 0;
     const hasContent = slide.content && slide.content.length > 0;
     if (hasContent) {
         contentAreaHeight = config.height * 0.2; // roughly
     }

     // Vertical Centering Calculation
     // Total Used = Title + Gap + Images + Gap + Content
     const gap = 40;
     const totalContentHeight = measuredTitleH + (hasImages ? gap + imageAreaHeight : 0) + (hasContent ? gap + contentAreaHeight : 0);
     let startY = (config.height - totalContentHeight) / 2;
     
     // Correction: if startY < padding, clamp it
     if (startY < padding) startY = padding;

     // Draw Title
     ctx.fillStyle = textColor;
     ctx.font = `800 ${titleFontSize}px '${titleFontFamily}', sans-serif`;
     let currentY = wrapText(ctx, slide.title, centerX, startY, maxWidth, titleLineHeight);
     currentY += gap;

     // Draw Images
     if (hasImages) {
         try {
             const loadedImages = await Promise.all(slide.images.map(src => loadImage(src)));
             const imgGap = 20;
             const numImgs = loadedImages.length;
             // Calculate width per image to fit in row
             const maxImgWidth = (maxWidth - (imgGap * (numImgs - 1))) / numImgs;
             
             // Normalize Height: Find max aspect ratio constraint
             // We want them to fit in imageAreaHeight AND maxImgWidth
             
             // Simple approach: Fit each image into the box of [maxImgWidth x imageAreaHeight]
             // Then center the row.
             
             // First, calculate the total width of the row if we maximize height
             // Or maximize width.
             
             let rowWidth = 0;
             const drawDims = loadedImages.map(img => {
                 const scaleW = maxImgWidth / img.width;
                 const scaleH = imageAreaHeight / img.height;
                 const scale = Math.min(scaleW, scaleH);
                 return { w: img.width * scale, h: img.height * scale, img };
             });

             // Calculate actual row width
             const totalDrawWidth = drawDims.reduce((acc, curr) => acc + curr.w, 0) + (imgGap * (numImgs - 1));
             let startImgX = (config.width - totalDrawWidth) / 2;

             drawDims.forEach(({w, h, img}) => {
                 // Center vertically in the image band? Or align top? Align top of band is safer visually
                 ctx.save();
                 ctx.beginPath();
                 ctx.roundRect(startImgX, currentY, w, h, 16);
                 ctx.clip();
                 ctx.drawImage(img, startImgX, currentY, w, h);
                 ctx.restore();
                 
                 // Border
                 ctx.beginPath();
                 ctx.roundRect(startImgX, currentY, w, h, 16);
                 ctx.lineWidth = 3;
                 ctx.strokeStyle = "rgba(255,255,255,0.5)";
                 ctx.stroke();

                 startImgX += w + imgGap;
             });
             
             // Move Y cursor by the MAX height found in this row, to avoid overlap
             const maxH = Math.max(...drawDims.map(d => d.h));
             currentY += maxH + gap;

         } catch (e) { console.error(e); }
     }

     // Draw Content (Sub-headline)
     if (hasContent) {
         ctx.font = `500 36px '${bodyFontFamily}', sans-serif`;
         slide.content.forEach(line => {
            currentY = wrapText(ctx, line, centerX, currentY, maxWidth, 50);
         });
     }

  } else {
    // --- CONTENT SLIDE HANDLING (STRICT LAYOUT) ---
    // Structure: Title Box -> Images -> Text -> Footer

    // 1. Draw Title (Top Fixed)
    const titleFontSize = 50;
    ctx.font = `700 ${titleFontSize}px '${titleFontFamily}', sans-serif`;
    const titleLineHeight = titleFontSize * 1.3;
    const titleBoxPadding = 30;
    const titleTextHeight = measureWrappedTextHeight(ctx, slide.title, maxWidth - (titleBoxPadding*2), titleLineHeight);
    const titleBoxHeight = titleTextHeight + (titleBoxPadding*2);
    
    // Draw Title Box
    ctx.fillStyle = "rgba(255, 247, 237, 0.95)"; // Very light
    ctx.strokeStyle = "#111827";
    ctx.lineWidth = 3;
    
    ctx.beginPath();
    ctx.roundRect(padding, cursorY, maxWidth, titleBoxHeight, 20);
    ctx.fill();
    ctx.stroke();

    // Title Text
    ctx.fillStyle = "#111827";
    wrapText(ctx, slide.title, padding + titleBoxPadding, cursorY + titleBoxPadding, maxWidth - (titleBoxPadding*2), titleLineHeight);

    cursorY += titleBoxHeight + 40; // Add margin after title

    // 2. Calculate Remaining Space
    const footerHeight = 60;
    const availableHeight = config.height - cursorY - footerHeight - padding;
    
    // 3. Determine Image vs Text Split
    const hasImages = slide.images && slide.images.length > 0;
    const hasText = slide.content && slide.content.length > 0;

    let imageAreaHeight = 0;
    let textAreaHeight = 0;

    if (hasImages && hasText) {
        imageAreaHeight = availableHeight * 0.45; // Images get 45%
        textAreaHeight = availableHeight * 0.50;  // Text gets 50%
    } else if (hasImages && !hasText) {
        imageAreaHeight = availableHeight * 0.9;
    } else if (!hasImages && hasText) {
        textAreaHeight = availableHeight * 0.95;
    }

    // 4. Draw Images
    if (hasImages) {
        try {
            const loadedImages = await Promise.all(slide.images.map(src => loadImage(src)));
            const numImgs = loadedImages.length;
            const imgGap = 20;
            const maxImgWidth = (maxWidth - (imgGap * (numImgs - 1))) / numImgs;

            // Calculate scaling to fit in [maxImgWidth x imageAreaHeight]
            // We want to center the row horizontally
            
            const drawDims = loadedImages.map(img => {
                const scaleW = maxImgWidth / img.width;
                const scaleH = imageAreaHeight / img.height;
                const scale = Math.min(scaleW, scaleH);
                return { w: img.width * scale, h: img.height * scale, img };
            });

            const totalRowWidth = drawDims.reduce((acc, curr) => acc + curr.w, 0) + (imgGap * (numImgs - 1));
            let startImgX = padding + (maxWidth - totalRowWidth) / 2; // Center horizontally
            
            // Draw
            let maxRowH = 0;
            drawDims.forEach(({w, h, img}) => {
                ctx.save();
                ctx.beginPath();
                ctx.roundRect(startImgX, cursorY, w, h, 12);
                ctx.clip();
                ctx.drawImage(img, startImgX, cursorY, w, h);
                ctx.restore();

                // Border
                ctx.beginPath();
                ctx.roundRect(startImgX, cursorY, w, h, 12);
                ctx.strokeStyle = "rgba(0,0,0,0.1)";
                ctx.lineWidth = 2;
                ctx.stroke();

                startImgX += w + imgGap;
                if (h > maxRowH) maxRowH = h;
            });

            cursorY += maxRowH + 40; // Advance cursor
        } catch (e) { console.error("Img error", e); }
    }

    // 5. Draw Content (Bullet Points)
    if (hasText) {
        // Auto-fit Font Size
        let fontSize = 42;
        let lineHeight = fontSize * 1.5;
        let fits = false;
        const minFontSize = 24;

        // Iteratively reduce font size until text fits in textAreaHeight
        while (!fits && fontSize >= minFontSize) {
            ctx.font = `400 ${fontSize}px '${bodyFontFamily}', sans-serif`;
            lineHeight = fontSize * 1.5;
            
            let totalNeededHeight = 0;
            slide.content.forEach(line => {
                totalNeededHeight += measureWrappedTextHeight(ctx, line, maxWidth - 50, lineHeight); // -50 for bullet indent
                totalNeededHeight += (fontSize * 0.5); // Paragraph spacing
            });

            if (totalNeededHeight <= textAreaHeight) {
                fits = true;
            } else {
                fontSize -= 2;
            }
        }

        ctx.font = `400 ${fontSize}px '${bodyFontFamily}', sans-serif`;
        ctx.fillStyle = "#1f2937"; // Dark gray

        slide.content.forEach(point => {
            // Bullet
            ctx.beginPath();
            ctx.fillStyle = "#f59e0b"; // Brand Gold
            ctx.arc(padding + 15, cursorY + (lineHeight/2) - (fontSize/4), fontSize/5, 0, Math.PI * 2);
            ctx.fill();

            // Text
            ctx.fillStyle = "#1f2937";
            const textHeight = wrapText(ctx, point, padding + 50, cursorY, maxWidth - 50, lineHeight);
            cursorY = textHeight + (fontSize * 0.5);
        });
    }
  }

  // --- 5.5 Draw Stickers (Left and Right) ---
  if (slide.stickerLeft) {
      await drawSticker(ctx, slide.stickerLeft, 'left', config, titleFontFamily);
  }
  if (slide.stickerRight) {
      await drawSticker(ctx, slide.stickerRight, 'right', config, titleFontFamily);
  }

  // --- 6. Footer ---
  ctx.fillStyle = textColor;
  ctx.font = `600 24px '${titleFontFamily}', sans-serif`;
  ctx.textAlign = "center";
  ctx.globalAlpha = 0.6;
  ctx.fillText(authorName, config.width / 2, config.height - 50);
  ctx.globalAlpha = 1.0;

  return canvas.toDataURL("image/png");
};