
import React, { useState, useRef } from 'react';
import { Sparkles, ArrowRight, ImagePlus, X, AlertCircle, FileText } from 'lucide-react';

interface Props {
  initialTopic: string;
  initialImages: string[];
  onGenerate: (topic: string, images: string[]) => void;
  isLoading: boolean;
  hasDraft?: boolean;
  onContinue?: () => void;
}

const StepInput: React.FC<Props> = ({ initialTopic, initialImages, onGenerate, isLoading, hasDraft, onContinue }) => {
  const [topic, setTopic] = useState(initialTopic);
  const [images, setImages] = useState<string[]>(initialImages);
  const [showWarning, setShowWarning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files) as File[];
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImages(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    const keywords = ['ảnh mẫu', 'hình mẫu', 'mẫu này', 'như ảnh', 'reference image'];
    const hasKeyword = keywords.some(kw => topic.toLowerCase().includes(kw));

    if (hasKeyword && images.length === 0 && !showWarning) {
      setShowWarning(true);
      return;
    }

    onGenerate(topic, images);
  };

  return (
    <div className="w-full max-w-3xl mx-auto animate-fade-in-up pt-10">
      <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/50 relative overflow-hidden">
        {/* Decorative background blob */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-brand-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-royal-100 rounded-full blur-3xl opacity-50"></div>

        <div className="relative z-10 text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-brand-400 to-brand-600 rounded-2xl shadow-lg shadow-brand-500/30 mb-6 transform rotate-3 hover:rotate-6 transition-transform">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-4xl font-extrabold text-slate-900 mb-3 font-display tracking-tight">Bạn muốn viết về chủ đề gì?</h2>
          <p className="text-slate-500 text-lg">
            Nhập ý tưởng và tải lên ảnh mẫu, AI sẽ kiến tạo nội dung Viral cho bạn.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
          <div className="group">
            <div className="relative transform transition-all duration-300 focus-within:scale-[1.01]">
                <div className="absolute inset-0 bg-gradient-to-r from-brand-500 to-royal-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <textarea
                value={topic}
                onChange={(e) => {
                    setTopic(e.target.value);
                    setShowWarning(false);
                }}
                placeholder="Ví dụ: Cách làm video ngắn triệu view. Hãy làm theo style của ảnh mẫu..."
                className="relative w-full min-h-[160px] px-6 py-5 text-lg bg-white border-2 border-slate-100 rounded-2xl focus:border-brand-500 focus:ring-0 transition-colors resize-y placeholder-slate-400 shadow-sm text-slate-700"
                disabled={isLoading}
                />
            </div>
          </div>

          {/* Image Upload Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2 uppercase tracking-wider">
                    <ImagePlus className="w-4 h-4 text-brand-500" />
                    Ảnh mẫu tham khảo
                </label>
                <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-sm text-brand-600 font-bold hover:text-brand-700 hover:underline transition-colors"
                >
                    + Thêm ảnh
                </button>
            </div>
            
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*" 
                multiple
            />

            <div className="flex gap-4 overflow-x-auto py-2 no-scrollbar">
                {images.length === 0 && (
                    <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-shrink-0 w-24 h-24 rounded-2xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center cursor-pointer hover:border-brand-400 hover:bg-brand-50 transition-all group"
                    >
                        <ImagePlus className="w-8 h-8 text-slate-300 group-hover:text-brand-500 transition-colors" />
                        <span className="text-xs text-slate-400 font-medium mt-1">Upload</span>
                    </div>
                )}
                {images.map((img, idx) => (
                    <div key={idx} className="relative flex-shrink-0 w-24 h-24 rounded-2xl border border-slate-200 overflow-hidden group shadow-sm hover:shadow-md transition-all">
                        <img src={img} alt={`Ref ${idx}`} className="w-full h-full object-cover" />
                        <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute top-1 right-1 bg-white text-red-500 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 shadow-sm"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
          </div>

          {/* Warning Message */}
          {showWarning && (
              <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-xl flex items-start gap-4 animate-shake">
                  <AlertCircle className="w-6 h-6 flex-shrink-0 text-amber-600" />
                  <div>
                      <p className="font-bold text-base">Chưa có ảnh mẫu?</p>
                      <p className="text-sm opacity-90">Bạn có nhắc đến "ảnh mẫu" nhưng chưa tải ảnh nào lên.</p>
                      <div className="mt-3 flex gap-4">
                          <button type="button" onClick={() => fileInputRef.current?.click()} className="text-amber-700 underline font-bold text-sm">Tải ảnh lên</button>
                          <button type="submit" onClick={() => onGenerate(topic, images)} className="text-slate-500 hover:text-slate-800 font-medium text-sm">Tiếp tục không cần ảnh</button>
                      </div>
                  </div>
              </div>
          )}

          <div className="flex gap-4 pt-4">
             {hasDraft && onContinue && (
                 <button
                    type="button"
                    onClick={onContinue}
                    disabled={isLoading}
                    className="flex-1 flex items-center justify-center space-x-2 bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-bold py-4 px-6 rounded-2xl transition-all shadow-sm"
                 >
                    <FileText className="w-5 h-5" />
                    <span className="text-sm sm:text-base">Xem kịch bản cũ</span>
                 </button>
             )}

            <button
                type="submit"
                disabled={isLoading || !topic.trim()}
                className={`flex-grow group flex items-center justify-center space-x-3 bg-gradient-to-r from-royal-900 to-royal-800 hover:from-black hover:to-royal-900 text-white font-bold py-4 px-8 rounded-2xl transition-all transform hover:-translate-y-1 hover:shadow-xl hover:shadow-royal-900/20 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none ${hasDraft ? 'flex-[2]' : 'w-full'}`}
            >
                {isLoading ? (
                <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang suy nghĩ...
                </span>
                ) : (
                <>
                    <span className="text-lg">{hasDraft ? 'Tạo ý tưởng MỚI' : 'Lên ý tưởng ngay'}</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
                )}
            </button>
          </div>
        </form>
        
        <div className="mt-8 flex flex-wrap gap-2 justify-center text-sm text-slate-400 font-medium">
          <span>Gợi ý:</span>
          <button onClick={() => setTopic("Kỹ năng quản lý thời gian cho Gen Z")} className="hover:text-brand-600 hover:underline transition-colors">Quản lý thời gian</button>
          <span className="text-slate-300">•</span>
          <button onClick={() => setTopic("Cách tự học tiếng Anh giao tiếp tại nhà")} className="hover:text-brand-600 hover:underline transition-colors">Học tiếng Anh</button>
          <span className="text-slate-300">•</span>
          <button onClick={() => setTopic("Bí mật xây kênh TikTok từ con số 0")} className="hover:text-brand-600 hover:underline transition-colors">Xây kênh TikTok</button>
        </div>
      </div>
    </div>
  );
};

export default StepInput;
