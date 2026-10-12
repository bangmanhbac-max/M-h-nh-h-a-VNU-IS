# 🎮 AI EduPlay Platform - Nền Tảng Học Tập Trò Chơi Hóa Bằng AI

Một nền tảng toàn diện cho phép người dùng nạp kiến thức từ nhiều định dạng tài liệu (**PDF, DOCX, TXT, Ảnh chụp OCR**), sau đó AI sẽ tự động phân tích và tạo thành các mini-game tương tác hấp dẫn:

1. 🐔 **Chicken Invaders Typing**: Bắn gà luyện gõ phím / Pinyin / từ vựng.
2. 🪄 **Magic Touch Gesture**: Phù thủy vẽ nét chữ Hán / ký hiệu để nổ bóng bay diệt quái.
3. ⚡ **Speed Quiz Arena**: Đấu trường trắc nghiệm phản xạ nhanh với hiệu ứng Combo và giải thích chi tiết.

---

## 🏗️ Kiến Trúc Hệ Thống (Separation of Concerns)

Hệ thống được thiết kế theo cấu trúc module hóa phân tầng nghiêm ngặt, **tuyệt đối không gom code vào một file**:

```
m:\Game/
├── backend/                             # Python FastAPI Backend & AI Pipeline
│   ├── app/
│   │   ├── core/config.py               # Cấu hình môi trường & Upload dir
│   │   ├── models/                      # Pydantic Schemas định nghĩa cấu trúc dữ liệu
│   │   │   ├── vocabulary.py            # VocabularyItem, VocabularyDeck
│   │   │   ├── quiz.py                  # QuizItem, QuizDeck
│   │   │   └── document.py              # DocumentExtractResult, LearningPackage
│   │   ├── services/
│   │   │   ├── parsers/                 # Trích xuất dữ liệu đa định dạng
│   │   │   │   ├── pdf_parser.py        # Đọc PDF chuẩn xác (pypdf)
│   │   │   │   ├── docx_parser.py       # Đọc tài liệu Word (python-docx)
│   │   │   │   ├── txt_parser.py        # Đọc text đa bảng mã
│   │   │   │   └── image_parser.py      # OCR ảnh với Gemini Vision AI
│   │   │   ├── ai/                      # Lõi tạo sinh AI
│   │   │   │   ├── gemini_client.py     # Gemini API Client với JSON Schema
│   │   │   │   ├── prompt_templates.py  # Prompt trích xuất từ vựng & quiz
│   │   │   │   └── content_generator.py # Điều phối và Fallback Heuristic
│   │   │   └── sample_data.py           # Dữ liệu mẫu phong phú (HSK1, Tech English)
│   │   ├── api/v1/                      # RESTful API Endpoints
│   │   │   ├── upload.py                # POST /api/v1/upload
│   │   │   ├── generate.py              # POST /api/v1/generate
│   │   │   └── decks.py                 # GET/POST /api/v1/decks
│   │   └── main.py                      # FastAPI Application Entry
│   └── requirements.txt
│
├── frontend/                            # React + TypeScript + Vite + Canvas 2D
│   ├── src/
│   │   ├── types/                       # Shared TypeScript Interfaces
│   │   │   ├── learning_content.ts      # Data contracts
│   │   │   └── game.ts                  # Game states, stats, particles
│   │   ├── games/                       # LÕI GAME ENGINES ĐỘC LẬP
│   │   │   ├── common/                  # Các module dùng chung
│   │   │   │   ├── GameLoop.ts          # Vòng lặp 60 FPS chuẩn
│   │   │   │   ├── SoundSynthesizer.ts  # Web Audio Procedural Sound + TTS
│   │   │   │   ├── ParticleEngine.ts    # Hệ thống hạt, nổ, vệt sáng
│   │   │   │   └── GestureRecognizer.ts # Nhận diện nét vẽ hình học
│   │   │   ├── chicken-shooter/         # Game 1: Bắn gà luyện gõ
│   │   │   │   ├── ChickenEngine.ts
│   │   │   │   ├── ChickenEntity.ts
│   │   │   │   ├── PlayerSpaceship.ts
│   │   │   │   ├── LaserBeam.ts
│   │   │   │   └── TypingController.ts
│   │   │   ├── magic-touch/             # Game 2: Vẽ chữ nổ bóng
│   │   │   │   ├── MagicTouchEngine.ts
│   │   │   │   ├── BalloonMonster.ts
│   │   │   │   └── DrawingCanvas.ts
│   │   │   └── quiz-arena/              # Game 3: Đấu trường Quiz
│   │   │       └── QuizEngine.ts
│   │   ├── components/                  # UI Components
│   │   │   ├── Navbar.tsx
│   │   │   ├── ApiKeyModal.tsx
│   │   │   ├── game-shared/             # ScoreHUD, HealthBar, GameOverModal
│   │   │   └── upload/                  # DocumentUpload, DeckEditor
│   │   ├── views/                       # Màn hình ứng dụng
│   │   │   ├── DashboardView.tsx
│   │   │   ├── UploadStudioView.tsx
│   │   │   ├── ChickenShooterView.tsx
│   │   │   ├── MagicTouchView.tsx
│   │   │   └── QuizArenaView.tsx
│   │   ├── lib/api.ts                   # Fetch API client
│   │   ├── App.tsx                      # Root component & State router
│   │   └── main.tsx
│   └── package.json
│
├── start_all.bat                        # Script khởi chạy toàn bộ hệ thống
├── run_backend.bat                      # Script chạy Backend FastAPI (Port 8000)
├── run_frontend.bat                     # Script chạy Frontend Vite (Port 3000)
└── README.md
```

---

## 🚀 Hướng Dẫn Khởi Động Nhanh (Quick Start)

### Cách 1: Khởi động tự động bằng file `.bat` (Khuyên dùng trên Windows)
Chỉ cần nhấp đúp chuột vào file:
```bash
start_all.bat
```
Hệ thống sẽ tự động bật 2 cửa sổ terminal cho Backend (Port 8000) và Frontend (Port 3000), sau đó bạn có thể truy cập `http://localhost:3000` trên trình duyệt.

---

### Cách 2: Khởi động bằng dòng lệnh thủ công

#### Bước 1: Khởi động Backend (FastAPI)
```powershell
cd m:\Game\backend
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

#### Bước 2: Khởi động Frontend (React Vite)
Mở một terminal mới:
```powershell
cd m:\Game\frontend
npm run dev
```

Truy cập: `http://localhost:3000`

---

## 🎯 Chi Tiết 3 Chế Độ Trò Chơi

### 1. 🐔 Game Bắn Gà Luyện Gõ (Chicken Invaders Typing)
- **Luật chơi**: Đàn quái vật gà bay từ trên cao xuống, trên đầu mang chữ Hán / từ vựng và gợi ý Pinyin / nghĩa.
- **Thao tác**: Người chơi gõ các chữ cái trên bàn phím. Khi gõ ký tự đầu tiên, tàu vũ trụ sẽ tự động khóa mục tiêu và bắn đạn Laser plasma. Khi gõ xong toàn bộ từ, chú gà sẽ phát nổ, phát âm từ vựng qua giọng đọc AI (TTS) và cộng điểm combo!
- **Thua cuộc**: Nếu để gà chạm đáy đất 3 lần (HP = 0).

### 2. 🪄 Game Phù Thủy Vẽ Nét (Magic Touch)
- **Luật chơi**: Quái vật treo trên các quả bóng bay lơ lửng, mỗi quả bóng in một nét vẽ (Ngang `—`, Sổ `|`, Phẩy `/`, Mác `\`, Chữ `V`, Mũ `^`, Tròn `O`, Tia chớp `⚡`).
- **Thao tác**: Dùng chuột hoặc vuốt ngón tay vẽ nét phép thuật lên màn hình. Thuật toán `GestureRecognizer` nhận diện hình dạng học tức thì, làm nổ quả bóng tương ứng, quái vật rơi tự do xuống đất và tan biến.
- **Thua cuộc**: Nếu bóng bay hạ cánh chạm đất trước khi bạn vẽ đúng nét.

### 3. ⚡ Đấu Trường Tốc Độ (Speed Quiz Arena)
- **Luật chơi**: Mỗi câu hỏi trắc nghiệm có 10 giây đếm ngược.
- **Cơ chế thưởng**: Trả lời càng nhanh và duy trì chuỗi Streak càng cao thì điểm số nhân x2, x3, x4 kèm hiệu ứng âm thanh cổ vũ và giải thích kiến thức chi tiết.
