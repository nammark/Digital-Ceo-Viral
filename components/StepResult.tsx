
import React from 'react';
import { GeneratedImage } from '../types';
import { Download, RefreshCw, Copy, Check, ArrowLeft, Edit } from 'lucide-react';

interface Props {
  images: GeneratedImage[];
  caption: string;
  onReset: () => void;
  onBack: () => void;
}

const StepResult: React.FC<Props> = ({ images, caption, onReset, onBack }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(caption);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadImage = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAll = () => {
      images.forEach((img, idx) => {
          setTimeout(() => {
              downloadImage(img.url, `viral-slide-${idx + 1}.png`);
          }, idx * 300); // Stagger downloads
      });
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-10 animate-fade-in pb-20">
      
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 p-6 bg-white/80 backdrop-blur rounded-3xl shadow-sm border border-white/50">
        <div>
            <div className="flex items-center gap-4 mb-2">
                <button onClick={onBack} className="p-3 rounded-full hover:bg-slate-100 text-slate-500 transition-colors" title="Quay lại chỉnh sửa">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h2 className="text-3xl font-extrabold text-slate-900 font-display">Sẵn sàng Viral! 🚀</h2>
            </div>
            <p className="text-slate-500 ml-16 font-medium">Tải ảnh chất lượng cao và sao chép caption để đăng ngay.</p>
        </div>
        <div className="flex flex-wrap gap-3">
            <button onClick={onBack} className="px-5 py-3 text-slate-600 bg-white border-2 border-slate-100 rounded-xl hover:border-brand-200 hover:text-brand-600 font-bold flex items-center gap-2 transition-colors">
                <Edit className="w-4 h-4" /> Chỉnh sửa
            </button>
            <button onClick={onReset} className="px-5 py-3 text-slate-600 bg-white border-2 border-slate-100 rounded-xl hover:border-brand-200 hover:text-brand-600 font-bold flex items-center gap-2 transition-colors">
                <RefreshCw className="w-4 h-4" /> Tạo mới
            </button>
            <button onClick={downloadAll} className="px-8 py-3 bg-gradient-to-r from-royal-900 to-royal-800 text-white rounded-xl hover:from-black hover:to-royal-900 font-bold shadow-lg shadow-royal-900/30 flex items-center gap-2 transform hover:-translate-y-0.5 transition-all">
                <Download className="w-5 h-5" /> Tải tất cả ảnh
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Caption */}
        <div className="lg:col-span-4 space-y-4">
            <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100 sticky top-24">
                <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                    <h3 className="font-bold text-xl text-slate-800">Caption Facebook</h3>
                    <button onClick={handleCopyCaption} className={`text-sm font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${copied ? 'bg-green-100 text-green-700' : 'bg-brand-50 text-brand-600 hover:bg-brand-100'}`}>
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Đã copy' : 'Sao chép'}
                    </button>
                </div>
                <div className="p-5 bg-slate-50 rounded-2xl text-slate-700 whitespace-pre-wrap text-base leading-relaxed max-h-[60vh] overflow-y-auto custom-scrollbar border border-slate-200">
                    {caption}
                </div>
            </div>
        </div>

        {/* Right Column: Images Grid */}
        <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {images.map((img, idx) => (
                    <div key={img.id} className="group relative bg-white p-3 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-brand-200 transition-all duration-300">
                        <div className="aspect-square w-full overflow-hidden rounded-xl bg-slate-100 relative">
                            <img src={img.url} alt={`Slide ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            
                            {/* Overlay Actions */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                                <button 
                                    onClick={() => downloadImage(img.url, `viral-slide-${idx + 1}.png`)}
                                    className="flex flex-col items-center gap-2 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                                >
                                    <div className="p-4 bg-white text-slate-900 rounded-full hover:scale-110 transition-transform shadow-lg">
                                        <Download className="w-6 h-6" />
                                    </div>
                                    <span className="font-bold text-sm drop-shadow-md">Tải ảnh này</span>
                                </button>
                            </div>
                        </div>
                        <div className="mt-4 flex justify-between items-center px-2 pb-1">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-100 px-2 py-1 rounded">Slide {idx + 1}</span>
                            <span className="text-xs font-semibold text-slate-500 truncate max-w-[200px]">{img.slide.title}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default StepResult;
