

import React, { useState, useRef } from 'react';
import { Slide, ViralContent, StyleConfig, SlideSticker } from '../types';
import { PRESET_BACKGROUNDS, STICKER_PRESETS_LEFT, STICKER_PRESETS_RIGHT, generateSlideImage } from '../utils/canvasUtils';
import { Plus, Trash2, Image as ImageIcon, Copy, Check, ArrowLeft, Palette, Type, Upload, X, ArrowRight, GripHorizontal, Sticker, RefreshCw, Download } from 'lucide-react';

interface Props {
  content: ViralContent;
  onUpdateContent: (content: ViralContent) => void;
  styleConfig: StyleConfig;
  onUpdateStyle: (style: StyleConfig) => void;
  onConfirm: (authorName: string) => void;
  onBack: () => void;
  isGeneratingImages: boolean;
  hasResult?: boolean;
  onGoToResult?: () => void;
}

const FONT_OPTIONS = [
    { id: 'Montserrat', name: 'Montserrat (Hiện đại)' },
    { id: 'Merriweather', name: 'Merriweather (Cổ điển)' },
    { id: 'Playfair Display', name: 'Playfair (Sang trọng)' },
    { id: 'Roboto', name: 'Roboto (Trung tính)' },
    { id: 'Open Sans', name: 'Open Sans (Dễ đọc)' },
];

const OVERLAY_COLORS = [
    { name: 'Đen', val: '#000000' },
    { name: 'Trắng', val: '#FFFFFF' },
    { name: 'Xanh Navy', val: '#0c4a6e' },
    { name: 'Vàng', val: '#f59e0b' },
];

const StepPlanning: React.FC<Props> = ({ 
    content, 
    onUpdateContent, 
    styleConfig,
    onUpdateStyle,
    onConfirm, 
    onBack, 
    isGeneratingImages,
    hasResult,
    onGoToResult
}) => {
  const [authorName, setAuthorName] = useState('@MyPersonalBrand');
  const [copied, setCopied] = useState(false);
  const [generatingSlideId, setGeneratingSlideId] = useState<string | null>(null);
  
  const bgFileInputRef = useRef<HTMLInputElement>(null);
  const stickerInputRef = useRef<HTMLInputElement>(null);
  
  const [draggedImageIndex, setDraggedImageIndex] = useState<{slideId: string, imgIndex: number} | null>(null);
  
  // Track which slide/side is being uploaded
  const [activeUpload, setActiveUpload] = useState<{slideId: string, side: 'left' | 'right'} | null>(null);

  const updateSlide = (id: string, field: keyof Slide, value: any) => {
    const newSlides = content.slides.map(slide => 
      slide.id === id ? { ...slide, [field]: value } : slide
    );
    onUpdateContent({ ...content, slides: newSlides });
  };

  const removeSlide = (id: string) => {
    if (content.slides.length <= 1) return;
    onUpdateContent({ ...content, slides: content.slides.filter(s => s.id !== id) });
  };

  const addSlide = () => {
    const newSlide: Slide = {
      id: `slide-${Date.now()}`,
      type: 'content',
      title: 'Tiêu đề bước mới',
      content: ['Nội dung chi tiết...'],
      images: []
    };
    onUpdateContent({ ...content, slides: [...content.slides, newSlide] });
  };

  const handleImageUpload = (slideId: string, e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
          const slide = content.slides.find(s => s.id === slideId);
          if (!slide) return;
          const files = Array.from(e.target.files) as File[];
          const currentImages = slide.images || [];
          
          Promise.all(files.map(file => new Promise<string>((resolve) => {
              const r = new FileReader();
              r.onload = () => resolve(r.result as string);
              r.readAsDataURL(file);
          }))).then(newImages => {
             updateSlide(slideId, 'images', [...currentImages, ...newImages]);
          });
      }
  };

  const handleCustomBgUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const reader = new FileReader();
          reader.onload = () => onUpdateStyle({ 
              ...styleConfig, 
              backgroundId: 'custom', 
              backgroundImageUrl: undefined,
              customBackground: reader.result as string 
          });
          reader.readAsDataURL(e.target.files[0]);
      }
  };

  const handleStickerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (activeUpload && e.target.files && e.target.files[0]) {
          const reader = new FileReader();
          reader.onload = () => {
             const slide = content.slides.find(s => s.id === activeUpload.slideId);
             if (slide) {
                 const field = activeUpload.side === 'left' ? 'stickerLeft' : 'stickerRight';
                 const existing = slide[field];
                 
                 const newSticker: SlideSticker = {
                     url: reader.result as string,
                     label: existing?.label || '',
                     scale: existing?.scale || 1.0
                 };
                 updateSlide(activeUpload.slideId, field, newSticker);
             }
             setActiveUpload(null);
          };
          reader.readAsDataURL(e.target.files[0]);
      }
  };

  const handlePaste = (slideId: string, e: React.ClipboardEvent) => {
      const items = e.clipboardData.items;
      const slide = content.slides.find(s => s.id === slideId);
      if(!slide) return;
      
      for (const item of items) {
          if (item.type.indexOf("image") !== -1) {
              const blob = item.getAsFile();
              if (blob) {
                  const reader = new FileReader();
                  reader.onload = () => {
                      updateSlide(slideId, 'images', [...(slide.images || []), reader.result as string]);
                  };
                  reader.readAsDataURL(blob);
              }
              e.preventDefault(); 
          }
      }
  };

  const removeImage = (slideId: string, indexToRemove: number) => {
      const slide = content.slides.find(s => s.id === slideId);
      if (slide) {
          const newImages = slide.images.filter((_, idx) => idx !== indexToRemove);
          updateSlide(slideId, 'images', newImages);
      }
  };

  const handleDragStart = (e: React.DragEvent, slideId: string, index: number) => {
      setDraggedImageIndex({ slideId, imgIndex: index });
      e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault(); 
      e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, slideId: string, targetIndex: number) => {
      e.preventDefault();
      if (!draggedImageIndex || draggedImageIndex.slideId !== slideId) return;

      const slide = content.slides.find(s => s.id === slideId);
      if (!slide) return;

      const newImages = [...slide.images];
      const [draggedItem] = newImages.splice(draggedImageIndex.imgIndex, 1);
      newImages.splice(targetIndex, 0, draggedItem);

      updateSlide(slideId, 'images', newImages);
      setDraggedImageIndex(null);
  };

  const handleGenerateSingleSlide = async (slide: Slide) => {
      setGeneratingSlideId(slide.id);
      try {
          const url = await generateSlideImage(slide, authorName, styleConfig);
          updateSlide(slide.id, 'generatedImageUrl', url);
      } catch (error) {
          console.error("Error generating single slide", error);
      } finally {
          setGeneratingSlideId(null);
      }
  };

  // Helper to render sticker toolbar per side
  const renderStickerControl = (slide: Slide, side: 'left' | 'right') => {
      const field = side === 'left' ? 'stickerLeft' : 'stickerRight';
      const stickerData = slide[field];
      const presetList = side === 'left' ? STICKER_PRESETS_LEFT : STICKER_PRESETS_RIGHT;

      return (
        <div className="flex-1 min-w-[300px]">
            <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                    {side === 'left' ? <ArrowLeft className="w-3 h-3" /> : null}
                    Nhãn/Nút {side === 'left' ? 'Trái' : 'Phải'}
                    {side === 'right' ? <ArrowRight className="w-3 h-3" /> : null}
                </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-200">
                {/* Preset Selector */}
                <div className="flex gap-1 overflow-x-auto max-w-[150px] no-scrollbar">
                    {presetList.map((url, idx) => (
                        <button 
                            key={idx}
                            onClick={() => updateSlide(slide.id, field, { ...stickerData, url, label: stickerData?.label || '', scale: stickerData?.scale || 1.0 })}
                            className={`flex-shrink-0 w-8 h-8 rounded-md p-1 hover:bg-white hover:shadow-sm transition-all ${stickerData?.url === url ? 'bg-white shadow-sm ring-1 ring-brand-400' : 'opacity-60 hover:opacity-100'}`}
                        >
                            <img src={url} alt="icon" className="w-full h-full object-contain" />
                        </button>
                    ))}
                </div>
                
                <div className="h-6 w-px bg-slate-300 mx-1"></div>

                <button 
                    onClick={() => { setActiveUpload({slideId: slide.id, side}); stickerInputRef.current?.click(); }}
                    className="w-8 h-8 rounded-md flex items-center justify-center bg-white border border-dashed border-slate-300 text-slate-400 hover:text-brand-600 hover:border-brand-300"
                    title="Upload Sticker"
                >
                    <Upload className="w-3 h-3" />
                </button>

                {/* Label Input */}
                <input 
                    type="text"
                    value={stickerData?.label || ''}
                    onChange={(e) => updateSlide(slide.id, field, { ...stickerData, label: e.target.value, url: stickerData?.url || presetList[0], scale: stickerData?.scale || 1.0 })}
                    placeholder="Nhãn (VD: Tiếp)"
                    className="flex-grow min-w-[80px] px-2 py-1.5 rounded-lg border border-slate-200 text-sm focus:border-brand-500 outline-none"
                />

                {/* Scale Slider */}
                <div className="flex items-center gap-1">
                    <span className="text-[10px] font-bold text-slate-400">Cỡ</span>
                    <input 
                        type="range"
                        min="0.5"
                        max="2.0"
                        step="0.1"
                        value={stickerData?.scale || 1.0}
                        onChange={(e) => updateSlide(slide.id, field, { ...stickerData, scale: parseFloat(e.target.value), url: stickerData?.url || presetList[0] })}
                        className="w-12 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-500"
                    />
                </div>

                {stickerData?.url && (
                    <button 
                        onClick={() => updateSlide(slide.id, field, undefined)}
                        className="text-red-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-full"
                        title="Xóa"
                    >
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
      );
  }

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 animate-fade-in pb-24">
      
      {/* LEFT: Settings Panel */}
      <div className="w-full lg:w-80 flex-shrink-0 space-y-6">
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-white/20 p-6 sticky top-24 max-h-[90vh] overflow-y-auto custom-scrollbar">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-6 text-lg">
                  <Palette className="w-5 h-5 text-brand-600" />
                  Giao Diện & Nền
              </h3>

              {/* Background Selection */}
              <div className="mb-8 border-b border-slate-100 pb-6">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 block">Chọn Ảnh Nền</label>
                  <div className="grid grid-cols-4 gap-3">
                      {PRESET_BACKGROUNDS.map((url, idx) => (
                          <button
                              key={idx}
                              onClick={() => onUpdateStyle({ 
                                  ...styleConfig, 
                                  backgroundId: `preset-${idx}`,
                                  backgroundImageUrl: url,
                                  customBackground: undefined
                              })}
                              className={`aspect-square rounded-lg border-2 transition-all relative overflow-hidden group shadow-sm ${styleConfig.backgroundImageUrl === url ? 'border-brand-500 ring-2 ring-brand-200 scale-105' : 'border-slate-100 hover:border-brand-200'}`}
                          >
                             <img src={url} alt="bg" className="w-full h-full object-cover" />
                          </button>
                      ))}
                  </div>
                  <div className="mt-4">
                      <button 
                        onClick={() => bgFileInputRef.current?.click()}
                        className={`w-full py-3 px-4 rounded-xl text-sm font-semibold border border-dashed flex items-center justify-center gap-2 transition-all ${styleConfig.backgroundId === 'custom' ? 'bg-brand-50 border-brand-300 text-brand-700' : 'bg-slate-50 border-slate-300 text-slate-600 hover:bg-slate-100'}`}
                      >
                          <Upload className="w-4 h-4" />
                          {styleConfig.backgroundId === 'custom' && styleConfig.customBackground ? 'Đổi ảnh upload' : 'Tải ảnh riêng'}
                      </button>
                      <input type="file" ref={bgFileInputRef} onChange={handleCustomBgUpload} className="hidden" accept="image/*" />
                  </div>
              </div>

              {/* Overlay Settings */}
              <div className="mb-8 border-b border-slate-100 pb-6">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 block">Lớp Phủ (Overlay)</label>
                  <div className="flex gap-2 mb-4">
                      {OVERLAY_COLORS.map((col) => (
                          <button
                              key={col.val}
                              onClick={() => onUpdateStyle({ ...styleConfig, overlayColor: col.val })}
                              className={`w-8 h-8 rounded-full border shadow-sm ${styleConfig.overlayColor === col.val ? 'ring-2 ring-offset-2 ring-brand-400' : 'border-slate-200'}`}
                              style={{ backgroundColor: col.val }}
                              title={col.name}
                          />
                      ))}
                      <input 
                        type="color" 
                        value={styleConfig.overlayColor || '#000000'}
                        onChange={(e) => onUpdateStyle({ ...styleConfig, overlayColor: e.target.value })}
                        className="w-8 h-8 rounded-full cursor-pointer p-0 border-0 overflow-hidden"
                      />
                  </div>
                  <div className="space-y-2">
                       <div className="flex justify-between text-xs font-bold text-slate-600">
                           <span>Độ mờ</span>
                           <span>{styleConfig.overlayOpacity || 0}%</span>
                       </div>
                       <input 
                            type="range" 
                            min="0" 
                            max="90" 
                            value={styleConfig.overlayOpacity || 0}
                            onChange={(e) => onUpdateStyle({...styleConfig, overlayOpacity: parseInt(e.target.value)})}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-500"
                       />
                  </div>
              </div>

              {/* Fonts Selection */}
              <div className="space-y-4">
                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block flex items-center gap-2">
                        <Type className="w-4 h-4" /> Font Tiêu Đề
                    </label>
                    <div className="relative">
                        <select 
                            value={styleConfig.titleFont}
                            onChange={(e) => onUpdateStyle({...styleConfig, titleFont: e.target.value})}
                            className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium focus:border-brand-500 focus:ring-1 focus:ring-brand-200 outline-none appearance-none"
                        >
                            {FONT_OPTIONS.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                        </select>
                        <div className="absolute right-3 top-3.5 pointer-events-none text-slate-500">▼</div>
                    </div>
                </div>

                <div>
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block flex items-center gap-2">
                        <Type className="w-4 h-4" /> Font Nội Dung
                    </label>
                    <div className="relative">
                        <select 
                            value={styleConfig.bodyFont}
                            onChange={(e) => onUpdateStyle({...styleConfig, bodyFont: e.target.value})}
                            className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium focus:border-brand-500 focus:ring-1 focus:ring-brand-200 outline-none appearance-none"
                        >
                            {FONT_OPTIONS.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
                        </select>
                        <div className="absolute right-3 top-3.5 pointer-events-none text-slate-500">▼</div>
                    </div>
                </div>
              </div>
          </div>
      </div>

      {/* RIGHT: Main Content Editor */}
      <div className="flex-grow space-y-8">
        
        {/* Caption Editor */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                <span className="bg-royal-900 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shadow-md">1</span>
                Caption Bài Viết
            </h3>
            <button 
                onClick={() => {
                    navigator.clipboard.writeText(content.caption);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                }}
                className="text-sm font-medium flex items-center gap-2 text-brand-600 bg-brand-50 px-3 py-1.5 rounded-lg hover:bg-brand-100 transition-colors"
            >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Đã sao chép' : 'Sao chép'}
            </button>
            </div>
            <textarea
            value={content.caption}
            onChange={(e) => onUpdateContent({ ...content, caption: e.target.value })}
            className="w-full h-40 p-5 rounded-xl bg-slate-50 border border-slate-200 focus:border-brand-500 outline-none resize-y text-slate-700 font-medium text-base leading-relaxed"
            />
        </div>

        {/* Slides Editor */}
        <div>
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 mb-6">
                <h3 className="text-2xl font-bold text-slate-800 font-display drop-shadow-sm">Nội dung Slide ({content.slides.length})</h3>
                <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                    <label className="text-sm font-bold text-slate-600 pl-2">Chữ ký:</label>
                    <input 
                        type="text" 
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                        className="px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:border-brand-500 outline-none w-48 text-sm transition-all shadow-sm"
                        placeholder="@YourName"
                    />
                </div>
            </div>

            <div className="space-y-6">
                {content.slides.map((slide, index) => (
                    <div 
                        key={slide.id} 
                        className={`relative group p-8 rounded-2xl border transition-all shadow-sm ${slide.type === 'intro' ? 'bg-gradient-to-br from-white to-brand-50 border-brand-200' : 'bg-white border-slate-200 hover:border-brand-300 hover:shadow-md'}`}
                        onPaste={(e) => handlePaste(slide.id, e)}
                    >
                        {/* Slide Header */}
                        <div className="flex justify-between items-center mb-6">
                             <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full ${slide.type === 'intro' ? 'bg-brand-100 text-brand-700' : 'bg-slate-100 text-slate-600'}`}>
                                {slide.type === 'intro' ? 'Ảnh Bìa (Intro)' : `Slide ${index + 1}`}
                            </span>
                            {index > 0 && (
                                <button onClick={() => removeSlide(slide.id)} className="p-2 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors" title="Xóa slide">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            )}
                        </div>

                        {/* Title Input */}
                        <input
                            type="text"
                            value={slide.title}
                            onChange={(e) => updateSlide(slide.id, 'title', e.target.value)}
                            className="w-full bg-transparent font-extrabold text-2xl text-slate-900 border-b-2 border-transparent hover:border-slate-200 focus:border-brand-500 outline-none pb-2 mb-6 transition-colors"
                            placeholder="Tiêu đề slide..."
                            style={{ fontFamily: styleConfig.titleFont }}
                        />

                        {/* Inline Images Area */}
                        <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                            <label className="text-xs font-bold text-slate-400 uppercase mb-3 block">Hình ảnh minh họa</label>
                            <div className="flex flex-wrap gap-4">
                                {slide.images && slide.images.map((img, imgIdx) => (
                                    <div 
                                        key={imgIdx} 
                                        className="relative group/img w-28 h-28 cursor-grab active:cursor-grabbing"
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, slide.id, imgIdx)}
                                        onDragOver={(e) => handleDragOver(e)}
                                        onDrop={(e) => handleDrop(e, slide.id, imgIdx)}
                                    >
                                        <img src={img} alt="Inline" className="w-full h-full rounded-xl border border-slate-200 object-cover shadow-sm select-none" />
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 rounded-xl flex items-center justify-center transition-opacity backdrop-blur-[1px]">
                                             <GripHorizontal className="text-white w-8 h-8 drop-shadow-md" />
                                        </div>
                                        <button 
                                            onClick={() => removeImage(slide.id, imgIdx)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-md hover:scale-110 transition-transform z-10"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                        <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[10px] px-1.5 rounded font-bold">
                                            {imgIdx + 1}
                                        </div>
                                    </div>
                                ))}

                                {/* Add Button */}
                                <label className="flex flex-col items-center justify-center w-28 h-28 rounded-xl border-2 border-dashed border-slate-300 bg-white text-slate-400 cursor-pointer hover:bg-brand-50 hover:border-brand-300 hover:text-brand-600 transition-all group/add">
                                    <ImageIcon className="w-8 h-8 mb-2 group-hover/add:scale-110 transition-transform" />
                                    <span className="text-[10px] font-bold text-center leading-tight">Thêm ảnh<br/>(Ctrl+V)</span>
                                    <input type="file" className="hidden" accept="image/*" multiple onChange={(e) => handleImageUpload(slide.id, e)} />
                                </label>
                            </div>
                        </div>

                        {/* Content Input */}
                        <div className="relative mb-6">
                            <label className="text-sm font-bold text-slate-700 block mb-2">Nội dung Slide</label>
                            <textarea
                                value={slide.content.join('\n')}
                                onChange={(e) => updateSlide(slide.id, 'content', e.target.value.split('\n'))}
                                rows={Math.max(3, slide.content.length)}
                                className="w-full bg-slate-50 text-base text-slate-700 leading-relaxed border border-slate-200 rounded-xl p-4 hover:bg-white focus:bg-white focus:border-brand-300 outline-none shadow-inner focus:shadow-lg transition-all"
                                placeholder="Nội dung chi tiết (mỗi dòng một ý)..."
                                style={{ fontFamily: styleConfig.bodyFont }}
                            />
                        </div>

                        {/* STICKER / NAVIGATION TOOLBAR (SPLIT) */}
                        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col xl:flex-row gap-4">
                             {/* Left Sticker Control */}
                             {renderStickerControl(slide, 'left')}
                             
                             {/* Vertical Divider for large screens */}
                             <div className="hidden xl:block w-px bg-slate-200"></div>

                             {/* Right Sticker Control */}
                             {renderStickerControl(slide, 'right')}
                        </div>

                        {/* SINGLE SLIDE GENERATOR / PREVIEW */}
                        <div className="mt-8 pt-4 border-t-2 border-slate-100 bg-slate-50/50 -mx-8 -mb-8 p-6 rounded-b-2xl">
                             <div className="flex items-center justify-between mb-4">
                                <h4 className="font-bold text-slate-600 text-sm flex items-center gap-2">
                                    <ImageIcon className="w-4 h-4" /> 
                                    Xem trước Slide này
                                </h4>
                                <button 
                                    onClick={() => handleGenerateSingleSlide(slide)}
                                    disabled={generatingSlideId === slide.id}
                                    className="text-sm bg-white border border-slate-200 hover:border-brand-300 hover:text-brand-600 px-4 py-2 rounded-lg font-bold shadow-sm transition-all flex items-center gap-2"
                                >
                                    {generatingSlideId === slide.id ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                                    {generatingSlideId === slide.id ? 'Đang vẽ...' : 'Vẽ lại / Cập nhật'}
                                </button>
                             </div>

                             {slide.generatedImageUrl ? (
                                 <div className="flex flex-col sm:flex-row gap-6 items-start">
                                     <div className="relative w-full sm:w-64 aspect-square rounded-lg overflow-hidden shadow-md border border-slate-200 group/preview">
                                         <img src={slide.generatedImageUrl} alt="Preview" className="w-full h-full object-cover" />
                                         <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/preview:opacity-100 transition-opacity pointer-events-none"></div>
                                     </div>
                                     <div className="flex-grow space-y-3">
                                         <p className="text-xs text-slate-500">Đây là bản xem trước của slide này. Nếu bạn thay đổi nội dung, hãy nhấn "Vẽ lại".</p>
                                         <a 
                                             href={slide.generatedImageUrl} 
                                             download={`${slide.id}.png`}
                                             className="inline-flex items-center gap-2 bg-royal-900 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-black transition-colors shadow-sm"
                                         >
                                             <Download className="w-4 h-4" /> Tải ảnh này xuống
                                         </a>
                                     </div>
                                 </div>
                             ) : (
                                 <div className="text-center py-8 bg-slate-100/50 rounded-xl border border-dashed border-slate-300">
                                     <p className="text-slate-400 text-sm mb-3">Chưa có bản xem trước cho slide này</p>
                                     <button 
                                        onClick={() => handleGenerateSingleSlide(slide)}
                                        className="px-5 py-2 bg-brand-500 text-white rounded-lg font-bold hover:bg-brand-600 transition-colors shadow-sm text-sm"
                                     >
                                         Vẽ thử ngay
                                     </button>
                                 </div>
                             )}
                        </div>
                    </div>
                ))}

                <button 
                    onClick={addSlide}
                    className="w-full py-5 rounded-2xl border-2 border-dashed border-royal-900/10 bg-white/50 text-royal-900 hover:bg-white hover:text-brand-600 hover:border-brand-200 transition-all flex items-center justify-center gap-2 font-bold text-lg backdrop-blur-sm shadow-sm"
                >
                    <Plus className="w-6 h-6" />
                    Thêm trang Slide mới
                </button>
            </div>
        </div>
      </div>
      
      {/* Hidden Global Input for Sticker Upload */}
      <input type="file" ref={stickerInputRef} onChange={handleStickerUpload} className="hidden" accept="image/*" />

      {/* Floating Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
            <button
                onClick={onBack}
                className="flex items-center gap-2 px-6 py-3 text-slate-600 hover:text-slate-900 font-bold transition-colors rounded-xl hover:bg-slate-100"
            >
                <ArrowLeft className="w-5 h-5" />
                <span className="hidden sm:inline">Quay lại</span>
            </button>
            
            <div className="flex gap-4">
                {hasResult && onGoToResult && (
                    <button
                        onClick={onGoToResult}
                        className="hidden sm:flex items-center justify-center gap-2 px-6 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors border border-slate-200"
                    >
                        <span>Kết quả cũ</span>
                        <ArrowRight className="w-4 h-4" />
                    </button>
                )}

                <button
                    onClick={() => onConfirm(authorName)}
                    disabled={isGeneratingImages}
                    className="flex items-center justify-center space-x-3 bg-gradient-to-r from-royal-900 to-royal-800 hover:from-black hover:to-royal-900 text-white font-bold py-3 px-10 rounded-xl transition-all shadow-lg hover:shadow-royal-900/40 hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                >
                    {isGeneratingImages ? (
                        <>
                            <ImageIcon className="w-5 h-5 animate-pulse" />
                            <span>Đang vẽ ảnh...</span>
                        </>
                    ) : (
                        <>
                            <ImageIcon className="w-5 h-5" />
                            <span>Xuất {content.slides.length} Ảnh</span>
                        </>
                    )}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default StepPlanning;