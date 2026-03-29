/**
 * AdminPage.jsx — Admin panel for managing users, scans, and viewing stats
 */
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../services/api';
import {
  Shield, Users, Activity, AlertTriangle, TrendingUp, Trash2,
  Eye, Clock, Loader2, BarChart3, AlertCircle, CheckCircle2, X
} from 'lucide-react';

const AdminPage = () => {
  const [tab, setTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [deletingAll, setDeletingAll] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  // Auto-dismiss toast after 3 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, scansRes] = await Promise.all([
        api.get('/api/admin/stats'),
        api.get('/api/admin/users'),
        api.get('/api/admin/scans'),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data.users);
      setScans(scansRes.data.scans);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Delete this user and all their scans?')) return;
    try {
      await api.delete(`/api/admin/users/${userId}`);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const deleteScan = async (scanId) => {
    if (!window.confirm('Are you sure you want to delete this scan? This action cannot be undone.')) return;
    setDeletingId(scanId);
    try {
      await api.delete(`/api/admin/scans/${scanId}`);
      setScans((prev) => prev.filter((s) => s._id !== scanId));
      // Update stats inline
      if (stats) {
        setStats((prev) => ({ ...prev, totalScans: Math.max(0, prev.totalScans - 1) }));
      }
      setToast({ type: 'success', message: 'Scan deleted successfully' });
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Failed to delete scan' });
    } finally {
      setDeletingId(null);
    }
  };

  const deleteAllScans = async () => {
    if (!window.confirm(`Delete ALL ${scans.length} scan(s)? This will permanently remove all scan records and images. This action cannot be undone.`)) return;
    setDeletingAll(true);
    try {
      const res = await api.delete('/api/admin/scans');
      setScans([]);
      if (stats) {
        setStats((prev) => ({ ...prev, totalScans: 0, highRiskScans: 0, recentScans: 0 }));
      }
      setToast({ type: 'success', message: res.data.message || 'All scans deleted' });
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Failed to delete scans' });
    } finally {
      setDeletingAll(false);
    }
  };

  const tabs = [
    { key: 'stats', label: 'Overview', icon: BarChart3 },
    { key: 'users', label: 'Users', icon: Users },
    { key: 'scans', label: 'Scans', icon: Activity },
  ];

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
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold text-surface-900">Admin Panel</h1>
              <p className="text-surface-500 text-sm">Manage users, view scans, and monitor system health</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-surface-100 rounded-xl p-1 mb-8 max-w-md">
            {tabs.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  tab === key
                    ? 'bg-white text-primary-700 shadow-sm'
                    : 'text-surface-500 hover:text-surface-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          {/* Stats Tab */}
          {tab === 'stats' && stats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'primary' },
                { label: 'Total Scans', value: stats.totalScans, icon: Activity, color: 'blue' },
                { label: 'High Risk Scans', value: stats.highRiskScans, icon: AlertTriangle, color: 'red' },
                { label: 'Scans This Week', value: stats.recentScans, icon: TrendingUp, color: 'green' },
              ].map(({ label, value, icon: Icon, color }, i) => (
                <motion.div
                  key={i}
                  className="glass-card p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className={`w-10 h-10 rounded-lg bg-${color}-100 flex items-center justify-center mb-3`}>
                    <Icon className={`w-5 h-5 text-${color}-600`} />
                  </div>
                  <p className="font-display text-3xl font-bold text-surface-900">{value}</p>
                  <p className="text-sm text-surface-500 mt-1">{label}</p>
                </motion.div>
              ))}
            </div>
          )}

          {/* Users Tab */}
          {tab === 'users' && (
            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-surface-50 border-b border-surface-200">
                      <th className="text-left text-xs font-semibold text-surface-500 uppercase tracking-wider px-6 py-4">User</th>
                      <th className="text-left text-xs font-semibold text-surface-500 uppercase tracking-wider px-6 py-4">Role</th>
                      <th className="text-left text-xs font-semibold text-surface-500 uppercase tracking-wider px-6 py-4">Scans</th>
                      <th className="text-left text-xs font-semibold text-surface-500 uppercase tracking-wider px-6 py-4">Joined</th>
                      <th className="text-right text-xs font-semibold text-surface-500 uppercase tracking-wider px-6 py-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-100">
                    {users.map((user) => (
                      <tr key={user._id} className="hover:bg-surface-50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-surface-900">{user.name}</p>
                            <p className="text-sm text-surface-500">{user.email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            user.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-surface-600">{user.scanCount}</td>
                        <td className="px-6 py-4 text-sm text-surface-500">
                          {new Date(user.createdAt).toLocaleDateString('en-IN')}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {user.role !== 'admin' && (
                            <button
                              onClick={() => deleteUser(user._id)}
                              className="p-2 text-surface-400 hover:text-red-500 transition-colors"
                              title="Delete user"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Scans Tab */}
          {tab === 'scans' && (
            <div className="space-y-4">
              {/* Header with Delete All button */}
              {scans.length > 0 && (
                <motion.div
                  className="flex items-center justify-between"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p className="text-sm text-surface-500">
                    {scans.length} scan{scans.length !== 1 ? 's' : ''} found
                  </p>
                  <button
                    onClick={deleteAllScans}
                    disabled={deletingAll}
                    className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 rounded-lg text-sm font-medium transition-all border border-red-200 hover:border-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    id="btn-delete-all-scans"
                  >
                    {deletingAll ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                    {deletingAll ? 'Deleting...' : 'Delete All Scans'}
                  </button>
                </motion.div>
              )}

              {/* Scan cards */}
              <AnimatePresence mode="popLayout">
                {scans.map((scan) => (
                  <motion.div
                    key={scan._id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, x: -50 }}
                    transition={{ duration: 0.2 }}
                    className="glass-card p-4 flex items-center gap-4"
                  >
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-surface-100 flex-shrink-0">
                      <img src={scan.imagePath} alt="Scan" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-surface-900">{scan.prediction}</span>
                        <span className={`badge-${scan.riskLevel.toLowerCase()}`}>{scan.riskLevel}</span>
                      </div>
                      <div className="text-sm text-surface-500">
                        by {scan.userId?.name || 'Unknown'} • {(scan.confidence * 100).toFixed(1)}% • {new Date(scan.createdAt).toLocaleDateString('en-IN')}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteScan(scan._id)}
                      disabled={deletingId === scan._id}
                      className="flex-shrink-0 p-2.5 rounded-lg text-surface-400 hover:text-red-500 hover:bg-red-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Delete this scan"
                      id={`btn-delete-scan-${scan._id}`}
                    >
                      {deletingId === scan._id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>

              {scans.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <div className="w-16 h-16 rounded-2xl bg-surface-100 flex items-center justify-center mx-auto mb-4">
                    <Activity className="w-8 h-8 text-surface-300" />
                  </div>
                  <p className="text-surface-500 font-medium">No scans recorded yet</p>
                  <p className="text-sm text-surface-400 mt-1">Scans will appear here once users upload images</p>
                </motion.div>
              )}
            </div>
          )}
        </motion.div>
      </div>

      {/* Toast notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className={`fixed bottom-6 left-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl border backdrop-blur-sm ${
              toast.type === 'success'
                ? 'bg-green-50/95 border-green-200 text-green-800'
                : 'bg-red-50/95 border-red-200 text-red-800'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            )}
            <span className="text-sm font-medium">{toast.message}</span>
            <button onClick={() => setToast(null)} className="ml-2 p-0.5 hover:opacity-70 transition-opacity">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPage;

