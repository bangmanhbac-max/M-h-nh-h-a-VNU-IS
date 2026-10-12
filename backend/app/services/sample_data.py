from ..models.vocabulary import VocabularyDeck, VocabularyItem
from ..models.quiz import QuizDeck, QuizItem
from ..models.document import LearningPackage
from datetime import datetime

SAMPLE_CHINESE_DECK = LearningPackage(
    package_id="sample-chinese-hsk1",
    title="Tiếng Trung Giao Tiếp HSK 1 - Cơ Bản",
    source_filename="tieng_trung_hsk1_can_ban.pdf",
    created_at=datetime.now().isoformat(),
    vocabulary_deck=VocabularyDeck(
        id="deck-zh-1",
        title="Từ Vựng Tiếng Trung HSK 1 Thường Gặp",
        description="Các từ giao tiếp căn bản: Chào hỏi, cảm ơn, ăn uống, gia đình",
        target_language="zh-CN",
        items=[
            VocabularyItem(
                id="zh-1",
                target_text="你好",
                phonetic="nǐ hǎo",
                type_target="nihao",
                meaning="Xin chào",
                example="你好！很高兴认识你。",
                difficulty=1,
                stroke_gesture="horizontal"
            ),
            VocabularyItem(
                id="zh-2",
                target_text="谢谢",
                phonetic="xièxie",
                type_target="xiexie",
                meaning="Cảm ơn",
                example="太谢谢你了！",
                difficulty=1,
                stroke_gesture="vertical"
            ),
            VocabularyItem(
                id="zh-3",
                target_text="再见",
                phonetic="zàijiàn",
                type_target="zaijian",
                meaning="Tạm biệt",
                example="明天见，再见！",
                difficulty=1,
                stroke_gesture="slash"
            ),
            VocabularyItem(
                id="zh-4",
                target_text="中国",
                phonetic="Zhōngguó",
                type_target="zhongguo",
                meaning="Trung Quốc",
                example="我是中国人。",
                difficulty=2,
                stroke_gesture="backslash"
            ),
            VocabularyItem(
                id="zh-5",
                target_text="喝茶",
                phonetic="hē chá",
                type_target="hecha",
                meaning="Uống trà",
                example="你想喝茶吗？",
                difficulty=2,
                stroke_gesture="v_shape"
            ),
            VocabularyItem(
                id="zh-6",
                target_text="苹果",
                phonetic="píngguǒ",
                type_target="pingguo",
                meaning="Quả táo",
                example="这个苹果很甜。",
                difficulty=2,
                stroke_gesture="circle"
            ),
            VocabularyItem(
                id="zh-7",
                target_text="老师",
                phonetic="lǎoshī",
                type_target="laoshi",
                meaning="Thầy giáo / Cô giáo",
                example="李老师好！",
                difficulty=2,
                stroke_gesture="caret"
            ),
            VocabularyItem(
                id="zh-8",
                target_text="朋友",
                phonetic="péngyou",
                type_target="pengyou",
                meaning="Bạn bè",
                example="他们是我的好朋友。",
                difficulty=2,
                stroke_gesture="lightning"
            ),
            VocabularyItem(
                id="zh-9",
                target_text="开心",
                phonetic="kāixīn",
                type_target="kaixin",
                meaning="Vui vẻ / Hạnh phúc",
                example="今天我很开心！",
                difficulty=1,
                stroke_gesture="horizontal"
            ),
            VocabularyItem(
                id="zh-10",
                target_text="学习",
                phonetic="xuéxí",
                type_target="xuexi",
                meaning="Học tập",
                example="努力学习汉语。",
                difficulty=2,
                stroke_gesture="vertical"
            ),
        ]
    ),
    quiz_deck=QuizDeck(
        id="quiz-zh-1",
        title="Đấu Trường Quiz Tiếng Trung HSK 1",
        description="Thử thách trắc nghiệm phản xạ nghĩa từ vựng và pinyin",
        items=[
            QuizItem(
                id="q-zh-1",
                question="Từ '你好' (nǐ hǎo) có ý nghĩa là gì?",
                options=["A. Tạm biệt", "B. Xin chào", "C. Cảm ơn", "D. Không sao đâu"],
                correct_index=1,
                explanation="'你好' (nǐ hǎo) là câu chào hỏi phổ biến nhất trong tiếng Trung, có nghĩa là Xin chào.",
                points=100
            ),
            QuizItem(
                id="q-zh-2",
                question="Pinyin chuẩn xác của từ '谢谢' (Cảm ơn) là gì?",
                options=["A. zàijiàn", "B. bù kèqi", "C. xièxie", "D. duìbuqǐ"],
                correct_index=2,
                explanation="'谢谢' phát âm là xièxie (thanh 4 + thanh nhẹ), có nghĩa là cảm ơn.",
                points=100
            ),
            QuizItem(
                id="q-zh-3",
                question="Khi muốn nói 'Tạm biệt', người Trung Quốc dùng từ nào?",
                options=["A. 再见 (zàijiàn)", "B. 老师 (lǎoshī)", "C. 朋友 (péngyou)", "D. 喝茶 (hē chá)"],
                correct_index=0,
                explanation="'再见' (zàijiàn) có nghĩa là 'Hẹn gặp lại' hoặc 'Tạm biệt'.",
                points=100
            ),
            QuizItem(
                id="q-zh-4",
                question="Từ '苹果' (píngguǒ) chỉ loại quả nào?",
                options=["A. Quả chuối", "B. Quả dưa hấu", "C. Quả táo", "D. Quả xoài"],
                correct_index=2,
                explanation="'苹果' (píngguǒ) có nghĩa là Quả táo.",
                points=100
            ),
            QuizItem(
                id="q-zh-5",
                question="Điền từ còn thiếu: '李____好！' (Chào thầy Lý!)",
                options=["A. 朋友", "B. 老师", "C. 喝茶", "D. 学习"],
                correct_index=1,
                explanation="'老师' (lǎoshī) nghĩa là thầy/cô giáo. Ghép họ + 老师好 để chào giáo viên.",
                points=100
            )
        ]
    )
)

SAMPLE_ENGLISH_DECK = LearningPackage(
    package_id="sample-english-tech",
    title="English for Technology & AI",
    source_filename="tech_vocabulary.docx",
    created_at=datetime.now().isoformat(),
    vocabulary_deck=VocabularyDeck(
        id="deck-en-1",
        title="Từ Vựng Tiếng Anh Công Nghệ & AI",
        description="Từ vựng cốt lõi về Computer Science, AI, Cloud Computing",
        target_language="en",
        items=[
            VocabularyItem(
                id="en-1",
                target_text="Algorithm",
                phonetic="/ˈæl.ɡə.rɪ.ðəm/",
                type_target="algorithm",
                meaning="Thuật toán",
                example="An algorithm is a step-by-step procedure.",
                difficulty=2,
                stroke_gesture="horizontal"
            ),
            VocabularyItem(
                id="en-2",
                target_text="Database",
                phonetic="/ˈdeɪ.tə.beɪs/",
                type_target="database",
                meaning="Cơ sở dữ liệu",
                example="All user profiles are stored in the database.",
                difficulty=2,
                stroke_gesture="circle"
            ),
            VocabularyItem(
                id="en-3",
                target_text="Framework",
                phonetic="/ˈfreɪm.wɜːk/",
                type_target="framework",
                meaning="Khung kiến trúc phần mềm",
                example="React is a popular frontend framework.",
                difficulty=2,
                stroke_gesture="v_shape"
            ),
            VocabularyItem(
                id="en-4",
                target_text="Neural",
                phonetic="/ˈnjʊə.rəl/",
                type_target="neural",
                meaning="Thuộc thần kinh (Neural Network)",
                example="Neural networks power modern deep learning.",
                difficulty=3,
                stroke_gesture="lightning"
            ),
            VocabularyItem(
                id="en-5",
                target_text="Compiler",
                phonetic="/kəmˈpaɪ.lər/",
                type_target="compiler",
                meaning="Trình biên dịch mã nguồn",
                example="The compiler transforms source code into machine code.",
                difficulty=2,
                stroke_gesture="caret"
            ),
        ]
    ),
    quiz_deck=QuizDeck(
        id="quiz-en-1",
        title="Tech & AI Knowledge Quiz",
        description="Test your tech terms understanding",
        items=[
            QuizItem(
                id="q-en-1",
                question="What is the definition of an 'Algorithm'?",
                options=[
                    "A. A hardware memory chip",
                    "B. A step-by-step set of instructions for solving a problem",
                    "C. A computer virus",
                    "D. A database backup tool"
                ],
                correct_index=1,
                explanation="An algorithm is a finite sequence of well-defined computer-implementable instructions.",
                points=100
            ),
            QuizItem(
                id="q-en-2",
                question="Which component converts high-level programming code into machine code?",
                options=["A. Compiler", "B. Database", "C. Router", "D. Browser"],
                correct_index=0,
                explanation="A compiler translates computer code written in one programming language into another language.",
                points=100
            )
        ]
    )
)

SAMPLE_PACKAGES = {
    SAMPLE_CHINESE_DECK.package_id: SAMPLE_CHINESE_DECK,
    SAMPLE_ENGLISH_DECK.package_id: SAMPLE_ENGLISH_DECK
}
