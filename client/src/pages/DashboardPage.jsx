/**
 * DashboardPage.jsx — User's scan history with details
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Clock, Eye, Upload, AlertTriangle, CheckCircle,
  ChevronRight, Activity, Loader2, FileX
} from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    const fetchScans = async () => {
      try {
        const res = await api.get('/api/scan/history');
        setScans(res.data.scans);
        setPagination(res.data.pagination);
      } catch (err) {
        console.error('Failed to load scans:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchScans();
  }, []);

  const riskColors = {
    Low: 'badge-low',
    Medium: 'badge-medium',
    High: 'badge-high',
  };

  if (loading) {
    return (
      <div className="page-wrapper flex items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="page-wrapper bg-gradient-to-b from-surface-50 to-white">
      <div className="section-container py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            <div>
              <h1 className="font-display text-3xl font-bold text-surface-900 flex items-center gap-3">
                <LayoutDashboard className="w-8 h-8 text-primary-500" />
                My Dashboard
              </h1>
              <p className="text-surface-500 mt-1">Welcome back, {user?.name}! Here's your scan history.</p>
            </div>
            <Link to="/upload" className="btn-primary flex items-center gap-2">
              <Upload className="w-4 h-4" />
              New Scan
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {[
              { label: 'Total Scans', value: pagination.total || 0, icon: Activity, color: 'primary' },
              { label: 'High Risk', value: scans.filter(s => s.riskLevel === 'High').length, icon: AlertTriangle, color: 'red' },
              { label: 'Low Risk', value: scans.filter(s => s.riskLevel === 'Low').length, icon: CheckCircle, color: 'green' },
            ].map(({ label, value, icon: Icon, color }, i) => (
              <div key={i} className="glass-card p-5 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-${color === 'primary' ? 'primary' : color}-100 flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 text-${color === 'primary' ? 'primary' : color}-600`} />
                </div>
                <div>
                  <p className="text-2xl font-display font-bold text-surface-900">{value}</p>
                  <p className="text-sm text-surface-500">{label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Scan List */}
          {scans.length === 0 ? (
            <div className="glass-card p-16 text-center">
              <FileX className="w-16 h-16 text-surface-300 mx-auto mb-4" />
              <h3 className="font-display text-xl font-semibold text-surface-700 mb-2">No Scans Yet</h3>
              <p className="text-surface-500 mb-6">Upload your first skin lesion image to get started</p>
              <Link to="/upload" className="btn-primary inline-flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Upload Image
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {scans.map((scan, i) => (
                <motion.div
                  key={scan._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={`/results/${scan._id}`}
                    className="glass-card p-4 flex items-center gap-4 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group"
                  >
                    {/* Thumbnail */}
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-surface-100 flex-shrink-0">
                      <img src={scan.imagePath} alt="Scan" className="w-full h-full object-cover" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-surface-900 truncate">{scan.prediction}</h3>
                        <span className={riskColors[scan.riskLevel]}>{scan.riskLevel}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-surface-500">
                        <span className="flex items-center gap-1">
                          <Activity className="w-3.5 h-3.5" />
                          {(scan.confidence * 100).toFixed(1)}% confidence
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(scan.createdAt).toLocaleDateString('en-IN')}
                        </span>
                      </div>
                    </div>

                    {/* Arrow */}
                    <ChevronRight className="w-5 h-5 text-surface-400 group-hover:text-primary-500 transition-colors flex-shrink-0" />
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;
