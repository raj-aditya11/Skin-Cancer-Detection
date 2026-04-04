# 🧠 AI-Powered Skin Cancer Detection System

An intelligent web application that analyzes skin lesion images and predicts potential skin cancer types, with a special focus on Indian skin tones (Fitzpatrick IV–VI).

---

## 🚀 Features

* 📸 Upload skin images for instant analysis
* 🧠 AI-based prediction (Benign, Malignant, etc.)
* 📊 Confidence score with visual indicators
* 🔍 Grad-CAM heatmap for explainability
* 📁 User dashboard with scan history
* 📚 Educational resources on skin cancer
* 👨‍⚕️ Doctor connect interface (UI-based)

---

## 🏗️ Tech Stack

**Frontend:** React, Tailwind CSS
**Backend:** Node.js, Express.js
**Database:** MongoDB
**AI Model:** TensorFlow / Keras (CNN - MobileNetV2 / EfficientNet)
**Model API:** Flask / FastAPI

---

## 🧭 System Architecture

The system follows a 3-layer architecture:

* **User Layer:** Image upload, result viewing
* **Web Application Layer:** Handles UI, authentication, API routing
* **AI Model Layer:** Processes image and returns prediction

---

## 🧪 How It Works

1. User uploads a skin image
2. Image is sent to backend server
3. Backend forwards it to AI model API
4. Model processes image and predicts class
5. Grad-CAM generates a heatmap
6. Results are stored and displayed to user

---

## ⚙️ Installation & Setup (Local)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2. Setup Backend

```bash
cd server
npm install
npm start
```

### 3. Setup Frontend

```bash
cd client
npm install
npm start
```

### 4. Setup AI Model API

```bash
cd model
pip install -r requirements.txt
python app.py
```

---

## 🧠 AI Model Details

* Transfer learning using MobileNetV2 / EfficientNet
* Image preprocessing (224x224, normalization)
* Trained on ISIC dataset with augmentation
* Optimized for better performance on Indian skin tones

---

## 📊 Future Improvements

* Integration with real dermatologists
* More diverse Indian dataset
* Mobile application support
* Improved accuracy with larger datasets

---

## ⚠️ Disclaimer

This application is not a medical diagnosis tool. Please consult a certified dermatologist for professional advice.

---

## 📚 References

* ISIC Dataset: https://www.isic-archive.com
* MobileNetV2 Paper: https://arxiv.org/abs/1801.04381
* Grad-CAM Paper: https://arxiv.org/abs/1610.02391

---

## 👨‍💻 Authors

* Aditya Raj
* Kamakshi Mudgal
* Niharika Arora
* Tanmay Krishna

---

## ⭐ Acknowledgements

Special thanks to the open-source community and medical datasets that made this project possible.
