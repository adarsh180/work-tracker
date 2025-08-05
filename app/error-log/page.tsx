'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Edit, Trash2, CheckCircle, AlertTriangle, BookOpen, Search, Filter } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ErrorLog {
  id?: number;
  subject: string;
  chapter: string;
  mistake: string;
  fix?: string;
  reattempted: boolean;
  fixed_date?: string;
  created_at?: string;
}

export default function ErrorLogPage() {
  const router = useRouter();
  const [errors, setErrors] = useState<ErrorLog[]>([]);
  const [filteredErrors, setFilteredErrors] = useState<ErrorLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingError, setEditingError] = useState<ErrorLog | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<ErrorLog>({
    subject: 'physics',
    chapter: '',
    mistake: '',
    fix: '',
    reattempted: false,
    fixed_date: ''
  });

  const subjects = [
    { value: 'physics', label: 'Physics', icon: '⚡', color: 'blue' },
    { value: 'chemistry', label: 'Chemistry', icon: '🧪', color: 'purple' },
    { value: 'botany', label: 'Botany', icon: '🌱', color: 'green' },
    { value: 'zoology', label: 'Zoology', icon: '🦋', color: 'emerald' }
  ];

  useEffect(() => {
    fetchErrors();
  }, []);

  useEffect(() => {
    filterErrors();
  }, [errors, searchTerm, filterSubject, filterStatus]);

  const fetchErrors = async () => {
    try {
      const response = await fetch('/api/errors?userId=1');
      const data = await response.json();
      setErrors(data);
    } catch (error) {
      console.error('Error fetching errors:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterErrors = () => {
    let filtered = errors;

    if (searchTerm) {
      filtered = filtered.filter(error => 
        error.mistake.toLowerCase().includes(searchTerm.toLowerCase()) ||
        error.chapter.toLowerCase().includes(searchTerm.toLowerCase()) ||
        error.fix?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterSubject !== 'all') {
      filtered = filtered.filter(error => error.subject === filterSubject);
    }

    if (filterStatus !== 'all') {
      if (filterStatus === 'fixed') {
        filtered = filtered.filter(error => error.reattempted);
      } else {
        filtered = filtered.filter(error => !error.reattempted);
      }
    }

    setFilteredErrors(filtered);
  };

  const openModal = (error?: ErrorLog) => {
    if (error) {
      setEditingError(error);
      setFormData(error);
    } else {
      setEditingError(null);
      setFormData({
        subject: 'physics',
        chapter: '',
        mistake: '',
        fix: '',
        reattempted: false,
        fixed_date: ''
      });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingError(null);
    setFormData({
      subject: 'physics',
      chapter: '',
      mistake: '',
      fix: '',
      reattempted: false,
      fixed_date: ''
    });
  };

  const saveError = async () => {
    setSaving(true);
    try {
      const url = editingError ? `/api/errors/${editingError.id}` : '/api/errors';
      const method = editingError ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 1,
          subject: formData.subject,
          chapter: formData.chapter,
          mistake: formData.mistake,
          fix: formData.fix,
          reattempted: formData.reattempted,
          fixedDate: formData.reattempted ? new Date().toISOString().split('T')[0] : null
        })
      });

      if (response.ok) {
        await fetchErrors();
        closeModal();
      }
    } catch (error) {
      console.error('Error saving error log:', error);
    } finally {
      setSaving(false);
    }
  };

  const deleteError = async (errorId: number) => {
    if (!confirm('Are you sure you want to delete this error log?')) return;

    try {
      const response = await fetch(`/api/errors/${errorId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchErrors();
      }
    } catch (error) {
      console.error('Error deleting error log:', error);
    }
  };

  const getSubjectInfo = (subject: string) => {
    return subjects.find(s => s.value === subject) || subjects[0];
  };

  const stats = {
    total: errors.length,
    fixed: errors.filter(e => e.reattempted).length,
    pending: errors.filter(e => !e.reattempted).length,
    bySubject: subjects.map(subject => ({
      ...subject,
      count: errors.filter(e => e.subject === subject.value).length
    }))
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full shadow-glow"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/')}
                className="p-2 rounded-lg bg-gray-800 border border-gray-700 hover:bg-gray-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-300" />
              </button>
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-8 h-8 text-red-400" />
                <div>
                  <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400 animate-pulse-glow">
                    Error Log
                  </h1>
                  <p className="text-gray-300">Track and fix your mistakes to improve</p>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => openModal()}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium flex items-center space-x-2 shadow-glow hover:shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span>Add Error</span>
            </button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6 hover:shadow-glow transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Errors</p>
                <p className="text-3xl font-bold text-white">{stats.total}</p>
              </div>
              <BookOpen className="w-8 h-8 text-gray-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6 hover:shadow-glow transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Fixed</p>
                <p className="text-3xl font-bold text-green-400">{stats.fixed}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6 hover:shadow-glow transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Pending</p>
                <p className="text-3xl font-bold text-red-400">{stats.pending}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6 hover:shadow-glow transition-all duration-300"
          >
            <div>
              <p className="text-gray-400 text-sm mb-2">By Subject</p>
              <div className="space-y-1">
                {stats.bySubject.map(subject => (
                  <div key={subject.value} className="flex items-center justify-between text-sm">
                    <span className="text-gray-300">{subject.icon} {subject.label}</span>
                    <span className="text-white font-medium">{subject.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 border border-gray-700 rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search errors, chapters, or solutions..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <select
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-red-500"
              >
                <option value="all">All Subjects</option>
                {subjects.map(subject => (
                  <option key={subject.value} value={subject.value}>
                    {subject.icon} {subject.label}
                  </option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-red-500"
              >
                <option value="all">All Status</option>
                <option value="fixed">Fixed</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Error List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {filteredErrors.length === 0 ? (
            <div className="text-center py-12 bg-gray-800 border border-gray-700 rounded-xl">
              <AlertTriangle className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No errors found</h3>
              <p className="text-gray-500">
                {errors.length === 0 
                  ? "Start tracking your mistakes to improve your preparation!"
                  : "Try adjusting your search or filter criteria."
                }
              </p>
            </div>
          ) : (
            filteredErrors.map((error, index) => {
              const subjectInfo = getSubjectInfo(error.subject);
              
              return (
                <motion.div
                  key={error.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-gray-800 border rounded-xl shadow-lg p-6 hover:shadow-glow transition-all duration-300 ${
                    error.reattempted ? 'border-green-500/30' : 'border-red-500/30'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="text-2xl">{subjectInfo.icon}</span>
                        <div>
                          <h3 className="font-semibold text-white">{subjectInfo.label}</h3>
                          <p className="text-sm text-gray-400">{error.chapter}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          error.reattempted 
                            ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                          {error.reattempted ? '✓ Fixed' : '⚠ Pending'}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <h4 className="text-sm font-medium text-red-400 mb-1">Mistake:</h4>
                          <p className="text-gray-300">{error.mistake}</p>
                        </div>

                        {error.fix && (
                          <div>
                            <h4 className="text-sm font-medium text-green-400 mb-1">Solution:</h4>
                            <p className="text-gray-300">{error.fix}</p>
                          </div>
                        )}

                        {error.fixed_date && (
                          <div className="text-xs text-gray-500">
                            Fixed on: {new Date(error.fixed_date).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => openModal(error)}
                        className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => error.id && deleteError(error.id)}
                        className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </motion.div>

        {/* Modal */}
        <AnimatePresence>
          {modalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={closeModal}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold text-white mb-6">
                  {editingError ? 'Edit Error Log' : 'Add New Error'}
                </h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-red-500"
                      >
                        {subjects.map(subject => (
                          <option key={subject.value} value={subject.value}>
                            {subject.icon} {subject.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Chapter</label>
                      <input
                        type="text"
                        value={formData.chapter}
                        onChange={(e) => setFormData({...formData, chapter: e.target.value})}
                        className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-red-500"
                        placeholder="e.g., Mechanics, Organic Chemistry"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Mistake Description</label>
                    <textarea
                      value={formData.mistake}
                      onChange={(e) => setFormData({...formData, mistake: e.target.value})}
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-red-500 resize-none"
                      rows={3}
                      placeholder="Describe what went wrong..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Solution/Fix</label>
                    <textarea
                      value={formData.fix}
                      onChange={(e) => setFormData({...formData, fix: e.target.value})}
                      className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-red-500 resize-none"
                      rows={3}
                      placeholder="How to fix this mistake..."
                    />
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="reattempted"
                      checked={formData.reattempted}
                      onChange={(e) => setFormData({...formData, reattempted: e.target.checked})}
                      className="w-4 h-4 text-green-500 bg-gray-700 border-gray-600 rounded focus:ring-green-500"
                    />
                    <label htmlFor="reattempted" className="text-sm text-gray-300">
                      I have successfully reattempted and fixed this mistake
                    </label>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={saveError}
                      disabled={saving || !formData.mistake || !formData.chapter}
                      className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                    >
                      {saving ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span>{editingError ? 'Update' : 'Save'} Error</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={closeModal}
                      className="flex-1 bg-gray-600 text-gray-300 py-3 rounded-lg hover:bg-gray-500 transition-colors font-medium"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}