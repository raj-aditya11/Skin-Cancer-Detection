/**
 * ResultsPage.jsx — Displays AI prediction results with Grad-CAM heatmap
 */
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import MedicalDisclaimer from '../components/MedicalDisclaimer';
import {
  Shield, AlertTriangle, CheckCircle, Activity, Eye, ArrowLeft,
  Download, BarChart3, TrendingUp, Loader2
} from 'lucide-react';

const ResultsPage = () => {
  const { scanId } = useParams();
  const [scan, setScan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showHeatmap, setShowHeatmap] = useState(false);

  useEffect(() => {
    const fetchScan = async () => {
      try {
        const res = await api.get(`/api/scan/${scanId}`);
        setScan(res.data.scan);
      } catch (err) {
        setError('Failed to load scan results');
      } finally {
        setLoading(false);
      }
    };
    fetchScan();
  }, [scanId]);

  if (loading) {
    return (
      <div className="page-wrapper flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
          <p className="text-surface-500 font-medium">Loading results...</p>
        </div>
      </div>
    );
  }

  if (error || !scan) {
    return (
      <div className="page-wrapper flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-surface-700 font-medium">{error || 'Scan not found'}</p>
          <Link to="/upload" className="btn-primary mt-4 inline-block">Try Again</Link>
        </div>
      </div>
    );
  }

  const riskColors = {
    Low: { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', bar: 'bg-green-500', icon: CheckCircle },
    Medium: { bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-700', bar: 'bg-yellow-500', icon: AlertTriangle },
    High: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700', bar: 'bg-red-500', icon: AlertTriangle },
  };

  const risk = riskColors[scan.riskLevel] || riskColors.Low;
  const RiskIcon = risk.icon;

  return (
    <div className="page-wrapper bg-gradient-to-b from-surface-50 to-white">
      <div className="section-container py-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-4xl mx-auto"
        >
          {/* Back button */}
          <Link to="/upload" className="inline-flex items-center gap-2 text-surface-500 hover:text-primary-600 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">New Scan</span>
          </Link>

          {/* Result Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${risk.bg} ${risk.border} border rounded-2xl p-8 mb-8`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl ${risk.bg} border ${risk.border} flex items-center justify-center`}>
                  <RiskIcon className={`w-7 h-7 ${risk.text}`} />
                </div>
                <div>
                  <h1 className="font-display text-2xl font-bold text-surface-900">{scan.prediction}</h1>
                  <p className="text-surface-500 text-sm mt-1">
                    Detected on {new Date(scan.createdAt).toLocaleDateString('en-IN', { dateStyle: 'long' })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className={`badge-${scan.riskLevel.toLowerCase()}`}>
                  {scan.riskLevel} Risk
                </div>
                <div className="text-right">
                  <p className="text-xs text-surface-500 uppercase tracking-wider">Confidence</p>
                  <p className="font-display text-2xl font-bold text-surface-900">
                    {(scan.confidence * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Image comparison */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-semibold text-surface-900 flex items-center gap-2">
                  <Eye className="w-5 h-5 text-primary-500" />
                  {showHeatmap ? 'Grad-CAM Heatmap' : 'Original Image'}
                </h2>
                <button
                  onClick={() => setShowHeatmap(!showHeatmap)}
                  className="px-3 py-1.5 text-xs font-medium border border-primary-200 text-primary-600 rounded-lg hover:bg-primary-50 transition"
                >
                  {showHeatmap ? 'Show Original' : 'Show Heatmap'}
                </button>
              </div>
              <div className="aspect-square rounded-xl overflow-hidden bg-surface-100">
                {showHeatmap && scan.heatmapBase64 ? (
                  <img
                    src={`data:image/png;base64,${scan.heatmapBase64}`}
                    alt="Grad-CAM heatmap"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={scan.imagePath}
                    alt="Uploaded lesion"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              {showHeatmap && (
                <p className="text-xs text-surface-500 mt-3 text-center">
                  Warmer colors indicate regions the AI focused on for its prediction
                </p>
              )}
            </motion.div>

            {/* Prediction details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-6"
            >
              <h2 className="font-display font-semibold text-surface-900 flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-primary-500" />
                All Predictions
              </h2>
              <div className="space-y-3">
                {scan.allPredictions?.map((pred, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className={`font-medium ${i === 0 ? 'text-primary-700' : 'text-surface-600'}`}>
                        {pred.class}
                      </span>
                      <span className={`font-semibold ${i === 0 ? 'text-primary-700' : 'text-surface-500'}`}>
                        {(pred.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-surface-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pred.confidence * 100}%` }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                        className={`h-full rounded-full ${i === 0 ? 'bg-gradient-to-r from-primary-500 to-primary-600' : 'bg-surface-300'}`}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Risk Level explanation */}
              <div className={`mt-6 p-4 rounded-xl ${risk.bg} ${risk.border} border`}>
                <div className="flex items-start gap-3">
                  <RiskIcon className={`w-5 h-5 ${risk.text} flex-shrink-0 mt-0.5`} />
                  <div>
                    <p className={`font-semibold text-sm ${risk.text}`}>{scan.riskLevel} Risk Level</p>
                    <p className="text-xs text-surface-600 mt-1">
                      {scan.riskLevel === 'High' && 'This prediction suggests a potentially serious condition. Please consult a dermatologist as soon as possible.'}
                      {scan.riskLevel === 'Medium' && 'This prediction indicates a condition that should be monitored. Schedule a check-up with a dermatologist.'}
                      {scan.riskLevel === 'Low' && 'This prediction suggests a benign condition, but regular monitoring is still recommended.'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Link to="/upload" className="btn-primary flex items-center justify-center gap-2 flex-1">
              <Activity className="w-4 h-4" />
              Scan Another Image
            </Link>
            <Link to="/dashboard" className="btn-secondary flex items-center justify-center gap-2 flex-1">
              <TrendingUp className="w-4 h-4" />
              View All Scans
            </Link>
            <Link to="/doctors" className="btn-secondary flex items-center justify-center gap-2 flex-1">
              <Shield className="w-4 h-4" />
              Find a Doctor
            </Link>
          </div>

          <MedicalDisclaimer />
        </motion.div>
      </div>
    </div>
  );
};

export default ResultsPage;
