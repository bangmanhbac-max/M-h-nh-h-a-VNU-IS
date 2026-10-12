import React, { useState } from 'react';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { DocumentUpload } from '../components/upload/DocumentUpload';
import { DeckEditor } from '../components/upload/DeckEditor';
import { LearningPackage } from '../types/learning_content';
import { ActiveTab } from '../components/Navbar';

interface UploadStudioViewProps {
  currentPackage: LearningPackage;
  onSavePackage: (pkg: LearningPackage) => void;
  onLaunchGame: (mode: ActiveTab) => void;
  onBackToDashboard: () => void;
}

export const UploadStudioView: React.FC<UploadStudioViewProps> = ({
  currentPackage,
  onSavePackage,
  onLaunchGame,
  onBackToDashboard,
}) => {
  const [activePackage, setActivePackage] = useState<LearningPackage>(currentPackage);
  const [hasGenerated, setHasGenerated] = useState(false);

  const handlePackageGenerated = (pkg: LearningPackage) => {
    setActivePackage(pkg);
    setHasGenerated(true);
    onSavePackage(pkg);
  };

  return (
    <div className="space-y-8 py-4 w-full max-w-7xl 3xl:max-w-[1700px] 4k:max-w-[2100px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToDashboard}
          className="flex items-center gap-2 text-xs 3xl:text-sm font-semibold text-gray-400 hover:text-white px-4 py-2 rounded-xl bg-[#161F30] border border-gray-800 transition hover:border-cyan-500/40"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về Dashboard</span>
        </button>

        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-purple-500/10 rounded-2xl text-purple-400 border border-purple-500/30 shadow-md">
            <Sparkles className="w-5 h-5 3xl:w-6 3xl:h-6" />
          </div>
          <div>
            <h2 className="font-game text-lg 3xl:text-xl font-bold text-white tracking-wider">AI CONTENT STUDIO</h2>
            <p className="text-[11px] 3xl:text-xs text-gray-400">Nạp tài liệu, tạo sinh bộ thẻ và điều chỉnh nội dung</p>
          </div>
        </div>
      </div>

      {/* Section 1: Upload Document */}
      <DocumentUpload onPackageGenerated={handlePackageGenerated} />

      {/* Section 2: Deck Editor */}
      <div>
        <h3 className="font-game text-base 3xl:text-lg font-bold text-cyan-300 mb-4 flex items-center gap-2">
          <span>{hasGenerated ? '✨ BỘ DỮ LIỆU VỪA TẠO TỪ AI' : '📝 BỘ DỮ LIỆU ĐANG KÍCH HOẠT'}</span>
        </h3>
        <DeckEditor
          packageData={activePackage}
          onSave={onSavePackage}
          onLaunchGame={onLaunchGame}
        />
      </div>
    </div>
  );
};
