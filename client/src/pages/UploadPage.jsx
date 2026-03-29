/**
 * UploadPage.jsx — Drag & drop image upload with preview
 */
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import MedicalDisclaimer from '../components/MedicalDisclaimer';
import {
  Upload, Image as ImageIcon, X, Loader2, AlertCircle, CheckCircle, Shield
} from 'lucide-react';

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setError('');
    if (rejectedFiles.length > 0) {
      setError('Invalid file. Please upload a JPEG, PNG, or WebP image under 10MB.');
      return;
    }
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [] },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
  });

  const clearFile = () => {
    setFile(null);
    setPreview(null);
    setError('');
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await api.post('/api/scan/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 120000,
      });

      navigate(`/results/${response.data.scan.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Make sure the AI model server is running.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="page-wrapper bg-gradient-to-b from-surface-50 to-white">
      <div className="section-container py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-primary-500/20">
              <Upload className="w-8 h-8 text-white" />
            </div>
            <h1 className="font-display text-3xl font-bold text-surface-900 mb-2">
              Upload Skin Lesion Image
            </h1>
            <p className="text-surface-500">
              Upload a clear, well-lit photo of the skin lesion for AI analysis
            </p>
          </div>

          {/* Upload area */}
          <div className="glass-card p-8 mb-6">
            <AnimatePresence mode="wait">
              {!preview ? (
                <motion.div
                  key="dropzone"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
                    isDragActive
                      ? 'border-primary-500 bg-primary-50/50 scale-[1.02]'
                      : 'border-surface-200 hover:border-primary-400 hover:bg-primary-50/30'
                  }`}
                >
                  <input {...getInputProps()} id="image-upload" />
                  <div className="flex flex-col items-center gap-4">
                    <div className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-colors ${
                      isDragActive ? 'bg-primary-100' : 'bg-surface-100'
                    }`}>
                      <ImageIcon className={`w-10 h-10 ${isDragActive ? 'text-primary-500' : 'text-surface-400'}`} />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-surface-900">
                        {isDragActive ? 'Drop your image here' : 'Drag & drop your image here'}
                      </p>
                      <p className="text-sm text-surface-500 mt-1">
                        or <span className="text-primary-600 font-medium">click to browse</span>
                      </p>
                    </div>
                    <p className="text-xs text-surface-400">JPEG, PNG, WebP • Max 10MB</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="preview"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="space-y-6"
                >
                  {/* Image preview */}
                  <div className="relative rounded-2xl overflow-hidden bg-surface-100 aspect-square max-w-sm mx-auto">
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      onClick={clearFile}
                      className="absolute top-3 right-3 w-8 h-8 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/80 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* File info */}
                  <div className="flex items-center justify-between p-4 bg-surface-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="text-sm font-medium text-surface-900">{file.name}</p>
                        <p className="text-xs text-surface-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button onClick={clearFile} className="text-sm text-surface-500 hover:text-red-500 transition">
                      Remove
                    </button>
                  </div>

                  {/* Submit button */}
                  <button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-lg"
                    id="submit-scan"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Analyzing Image...
                      </>
                    ) : (
                      <>
                        <Shield className="w-5 h-5" />
                        Analyze with AI
                      </>
                    )}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 mt-4 bg-red-50 border border-red-200 rounded-xl"
              >
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-600">{error}</p>
              </motion.div>
            )}
          </div>

          {/* Tips */}
          <div className="glass-card p-6 mb-6">
            <h3 className="font-display font-semibold text-surface-900 mb-3">Tips for Best Results</h3>
            <ul className="space-y-2 text-sm text-surface-600">
              {[
                'Use good lighting — natural daylight works best',
                'Capture the lesion from directly above, not at an angle',
                'Keep the camera 6-12 inches from the skin',
                'Ensure the image is in focus and not blurry',
                'Include only the skin lesion area, minimal background',
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-accent-500 mt-0.5 flex-shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          <MedicalDisclaimer compact />
        </motion.div>
      </div>
    </div>
  );
};

export default UploadPage;
