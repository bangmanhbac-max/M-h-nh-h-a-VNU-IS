export type StrokeGestureType = 
  | 'horizontal'  // Nét ngang (-)
  | 'vertical'    // Nét sổ (|)
  | 'slash'       // Nét phẩy (/)
  | 'backslash'   // Nét mác (\)
  | 'v_shape'     // Chữ V
  | 'caret'       // Nét mũ (^)
  | 'circle'      // Hình tròn (O)
  | 'lightning';  // Tia chớp (Z)

export interface VocabularyItem {
  id: string;
  target_text: string;     // vd: 你好
  phonetic: string;        // vd: nǐ hǎo
  type_target: string;     // vd: nihao (chuỗi cần gõ)
  meaning: string;         // vd: Xin chào
  example?: string;        // vd: 你好！
  difficulty: number;      // 1-5
  stroke_gesture: StrokeGestureType;
}

export interface VocabularyDeck {
  id: string;
  title: string;
  description: string;
  target_language: string;
  items: VocabularyItem[];
}

export interface QuizItem {
  id: string;
  question: string;
  options: string[];
  correct_index: number;
  explanation?: string;
  points: number;
}

export interface QuizDeck {
  id: string;
  title: string;
  description: string;
  items: QuizItem[];
}

export interface LearningPackage {
  package_id: string;
  title: string;
  source_filename?: string;
  created_at: string;
  vocabulary_deck: VocabularyDeck;
  quiz_deck: QuizDeck;
}
