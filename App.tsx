
import React, { useState } from 'react';
import { AppStep, ViralContent, GeneratedImage, StyleConfig } from './types';
import { generateViralPlan } from './services/geminiService';
import { generateSlideImage, DEFAULT_STYLE } from './utils/canvasUtils';
import StepInput from './components/StepInput';
import StepPlanning from './components/StepPlanning';
import StepResult from './components/StepResult';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.INPUT);
  const [isLoading, setIsLoading] = useState(false);
  
  const [topic, setTopic] = useState('');
  const [referenceImages, setReferenceImages] = useState<string[]>([]);
  
  const [viralContent, setViralContent] = useState<ViralContent | null>(null);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  
  const [styleConfig, setStyleConfig] = useState<StyleConfig>(DEFAULT_STYLE);

  const handleGeneratePlan = async (inputTopic: string, images: string[]) => {
    setTopic(inputTopic);
    setReferenceImages(images);
    setIsLoading(true);
    try {
      const result = await generateViralPlan(inputTopic, images);
      setViralContent(result);
      setStep(AppStep.PLANNING);
    } catch (error) {
      alert("Đã xảy ra lỗi khi tạo ý tưởng. Vui lòng thử lại. Đảm bảo bạn đã cấu hình API Key.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateImages = async (authorName: string) => {
    if (!viralContent) return;
    setIsLoading(true);

    try {
      const images: GeneratedImage[] = [];
      for (const slide of viralContent.slides) {
        const url = await generateSlideImage(slide, authorName, styleConfig);
        images.push({
          id: slide.id,
          url,
          slide
        });
      }

      setGeneratedImages(images);
      setStep(AppStep.GENERATION);
    } catch (error) {
      console.error("Image gen error", error);
      alert("Không thể tạo hình ảnh.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    const confirm = window.confirm("Bạn có chắc muốn tạo mới? Dữ liệu hiện tại sẽ bị mất.");
    if (confirm) {
        setStep(AppStep.INPUT);
        setViralContent(null);
        setGeneratedImages([]);
        setTopic('');
        setReferenceImages([]);
        setStyleConfig(DEFAULT_STYLE);
    }
  };

  const navigateTo = (targetStep: AppStep) => {
      if (targetStep === AppStep.PLANNING && !viralContent) return;
      if (targetStep === AppStep.GENERATION && generatedImages.length === 0) return;
      setStep(targetStep);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 relative selection:bg-brand-500 selection:text-white">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-96 bg-royal-900 -z-10 rounded-b-[4rem] shadow-2xl"></div>
      
      {/* Header */}
      <header className="w-full glass-panel sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <a href="https://tuanlamviec4h.com/taisanso" className="flex items-center space-x-3 cursor-pointer group hover:opacity-90 transition-opacity">
            <img 
                src="https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/76jwxJS0DcAVoeVK00Z6/media/65019a9df30a7212a2e4c1d0.png" 
                alt="Logo"
                className="h-10 w-auto group-hover:scale-105 transition-transform duration-300"
            />
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-royal-900 to-royal-700 tracking-tight">
              Viral<span className="font-serif italic text-brand-500">Architect</span>
            </span>
          </a>
          
          <div className="flex items-center space-x-6">
             {/* Progress Indicators */}
             <div className="flex items-center space-x-3 text-sm hidden sm:flex select-none">
                <div 
                    onClick={() => navigateTo(AppStep.INPUT)}
                    className={`px-4 py-1.5 rounded-full cursor-pointer transition-all duration-300 ${step === AppStep.INPUT ? 'bg-royal-900 text-white font-bold shadow-lg shadow-royal-900/30' : 'text-slate-500 hover:bg-slate-100 hover:text-royal-900'}`} 
                >
                    1. Ý tưởng
                </div>
                
                <span className="text-slate-300">→</span>
                
                <div 
                    onClick={() => navigateTo(AppStep.PLANNING)}
                    className={`px-4 py-1.5 rounded-full transition-all duration-300 ${step === AppStep.PLANNING ? 'bg-royal-900 text-white font-bold shadow-lg shadow-royal-900/30' : viralContent ? 'cursor-pointer text-slate-500 hover:bg-slate-100 hover:text-royal-900' : 'text-slate-300 cursor-not-allowed'}`} 
                >
                    2. Kịch bản
                </div>

                <span className="text-slate-300">→</span>
                
                <div 
                    onClick={() => navigateTo(AppStep.GENERATION)}
                    className={`px-4 py-1.5 rounded-full transition-all duration-300 ${step === AppStep.GENERATION ? 'bg-royal-900 text-white font-bold shadow-lg shadow-royal-900/30' : generatedImages.length > 0 ? 'cursor-pointer text-slate-500 hover:bg-slate-100 hover:text-royal-900' : 'text-slate-300 cursor-not-allowed'}`}
                >
                    3. Kết quả
                </div>
             </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-12">
        {step === AppStep.INPUT && (
          <StepInput 
            initialTopic={topic} 
            initialImages={referenceImages}
            onGenerate={handleGeneratePlan} 
            isLoading={isLoading} 
            hasDraft={!!viralContent}
            onContinue={() => navigateTo(AppStep.PLANNING)}
          />
        )}
        
        {step === AppStep.PLANNING && viralContent && (
          <StepPlanning 
            content={viralContent} 
            onUpdateContent={setViralContent}
            styleConfig={styleConfig}
            onUpdateStyle={setStyleConfig}
            onConfirm={handleGenerateImages}
            onBack={() => navigateTo(AppStep.INPUT)}
            isGeneratingImages={isLoading}
            hasResult={generatedImages.length > 0}
            onGoToResult={() => navigateTo(AppStep.GENERATION)}
          />
        )}

        {step === AppStep.GENERATION && (
          <StepResult 
            images={generatedImages} 
            caption={viralContent?.caption || ''} 
            onReset={handleReset}
            onBack={() => navigateTo(AppStep.PLANNING)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-slate-500 text-sm font-medium border-t border-slate-200 bg-white">
        <p className="flex items-center justify-center gap-2">
            © 2024 Viral Architect. 
            <a 
              href="https://www.facebook.com/tuanlamviec4h/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-brand-600 font-bold hover:underline"
            >
              Tạo bởi tuanlamviec4h.com
            </a>
        </p>
      </footer>
    </div>
  );
};

export default App;
