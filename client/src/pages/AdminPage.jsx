/**
 * AdminPage.jsx — Admin panel for managing users, scans, and viewing stats
 */
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import {
  Shield, Users, Activity, AlertTriangle, TrendingUp, Trash2,
  Eye, Clock, Loader2, BarChart3
} from 'lucide-react';

const AdminPage = () => {
  const [tab, setTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

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
            <div className="space-y-3">
              {scans.map((scan) => (
                <div key={scan._id} className="glass-card p-4 flex items-center gap-4">
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
                </div>
              ))}
              {scans.length === 0 && (
                <div className="text-center py-12 text-surface-500">No scans recorded yet</div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminPage;
