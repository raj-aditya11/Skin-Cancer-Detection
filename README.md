# DermAI — AI-Powered Skin Cancer Detection

An AI-powered skin cancer detection web application optimized for Indian skin tones (Fitzpatrick IV–VI), running entirely on your local machine.

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + Tailwind CSS 3 + Framer Motion |
| **Backend** | Node.js + Express |
| **Database** | MongoDB (local) |
| **AI Model** | TensorFlow/Keras (MobileNetV2) |
| **Model API** | FastAPI (Python) |

## 📁 Project Structure

```
Skin-Cancer-Detection/
├── client/          # React frontend (port 3000)
├── server/          # Node.js backend (port 5001)
├── model/           # Python AI model + FastAPI (port 5000)
└── README.md
```

## 🚀 Setup Instructions

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.8+ and pip
- **MongoDB** Community Server (running on localhost:27017)

### 1. Clone and Install

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

# Install Python dependencies
cd ../model
pip install -r requirements.txt
```

### 2. Configure Environment

The server `.env` file is pre-configured for local development:

```env
PORT=5001
MONGO_URI=mongodb://localhost:27017/skincare_db
JWT_SECRET=skin_cancer_detection_super_secret_key_2024
JWT_EXPIRE=7d
MODEL_API_URL=http://localhost:5000
ADMIN_EMAIL=admin@skincare.com
ADMIN_PASSWORD=admin123
```

### 3. Start All Services

You need **3 terminal windows**:

**Terminal 1 — Python Model API (port 5000):**
```bash
cd model
python app.py
```
> First run will download MobileNetV2 weights (~14MB) and create the demo model.

**Terminal 2 — Node.js Backend (port 5001):**
```bash
cd server
npm start
```

**Terminal 3 — React Frontend (port 3000):**
```bash
cd client
npm run dev
```

### 4. Open the App

Visit **http://localhost:3000** in your browser.

## 👤 Default Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@skincare.com | admin123 |

## 🔬 AI Model

### Demo Model
The app ships with a demo MobileNetV2 model that works immediately for testing the full pipeline. It uses pretrained ImageNet weights with a random classification head — predictions won't be medically accurate until trained on the ISIC dataset.

### Training on ISIC Dataset
To train on real data:

1. Download the [ISIC 2019 Dataset](https://challenge.isic-archive.com/data/)
2. Organize images into class folders:
   ```
   dataset/
   ├── actinic_keratosis/
   ├── basal_cell_carcinoma/
   ├── benign_keratosis/
   ├── dermatofibroma/
   ├── melanocytic_nevus/
   ├── melanoma/
   └── vascular_lesion/
   ```
3. Run training:
   ```bash
   cd model
   python train.py --data_dir /path/to/dataset --epochs 30
   ```

### Indian Skin Tone Optimization
- CLAHE enhancement in LAB color space for better contrast on darker skin
- Data augmentation with brightness and color jitter
- Compatible with Fitzpatrick IV–VI skin types

## 🏥 Features

- ✅ JWT Authentication (signup/login)
- ✅ Image upload with drag & drop
- ✅ AI prediction with 7-class classification
- ✅ Grad-CAM heatmap visualization
- ✅ Confidence scores and risk levels
- ✅ Scan history dashboard
- ✅ Educational content on skin cancer
- ✅ Doctor Connect (mock UI)
- ✅ Admin panel
- ✅ Responsive design
- ✅ Medical Disclaimer

## ⚠️ Medical Disclaimer

**This application is not a medical diagnosis tool.** It is designed for educational and screening purposes only. Results should not replace professional medical advice. Please consult a certified dermatologist for proper diagnosis and treatment.

## 📄 License

This project is for educational purposes only.
