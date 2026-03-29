/**
 * HomePage.jsx — Landing page with hero section, features, and CTA
 */
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  Upload, Shield, Brain, Eye, Activity, Users, Zap, ArrowRight,
  CheckCircle, Star, TrendingUp
} from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } }
};

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      desc: 'MobileNetV2 deep learning model trained on thousands of skin lesion images for accurate classification.',
      color: 'from-blue-500 to-indigo-600'
    },
    {
      icon: Eye,
      title: 'Grad-CAM Visualization',
      desc: 'See exactly which areas of your image the AI focuses on with Grad-CAM heatmap overlays.',
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: Shield,
      title: 'Indian Skin Optimized',
      desc: 'Preprocessing pipeline specifically tuned for Fitzpatrick IV-VI skin types, common in South Asia.',
      color: 'from-emerald-500 to-teal-600'
    },
    {
      icon: Activity,
      title: '7-Class Detection',
      desc: 'Identifies melanoma, basal cell carcinoma, benign keratosis, and 4 other lesion categories.',
      color: 'from-orange-500 to-red-600'
    },
    {
      icon: Zap,
      title: 'Instant Results',
      desc: 'Get prediction results with confidence scores in seconds. No waiting, no delays.',
      color: 'from-yellow-500 to-orange-600'
    },
    {
      icon: Users,
      title: 'Doctor Connect',
      desc: 'Browse verified dermatologists and request appointments directly from the platform.',
      color: 'from-cyan-500 to-blue-600'
    }
  ];

  const stats = [
    { value: '7', label: 'Lesion Classes', icon: TrendingUp },
    { value: '224×224', label: 'Image Resolution', icon: Eye },
    { value: '~95%', label: 'Target Accuracy', icon: CheckCircle },
    { value: '100%', label: 'Privacy Focused', icon: Shield },
  ];

  return (
    <div className="page-wrapper">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[85vh] flex items-center">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-surface-900 via-primary-950 to-surface-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-500/20 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-accent-500/10 via-transparent to-transparent" />
        
        {/* Floating orbs */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
        
        <div className="section-container relative z-10">
          <motion.div
            className="max-w-3xl"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/20 rounded-full mb-8"
            >
              <Star className="w-4 h-4 text-primary-400" />
              <span className="text-primary-300 text-sm font-medium">
                Optimized for Indian Skin Tones (Fitzpatrick IV–VI)
              </span>
            </motion.div>

            <h1 className="font-display text-5xl md:text-7xl font-bold text-white leading-tight mb-6">
              AI-Powered{' '}
              <span className="gradient-text">Skin Cancer</span>{' '}
              Detection
            </h1>

            <p className="text-xl text-surface-300 leading-relaxed mb-10 max-w-2xl">
              Upload a skin lesion image and get instant AI analysis with Grad-CAM 
              explainability. Built with advanced deep learning technology to make 
              dermatological screening accessible to everyone.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to={isAuthenticated ? '/upload' : '/signup'}
                className="btn-primary flex items-center justify-center gap-2 text-lg px-8 py-4"
              >
                <Upload className="w-5 h-5" />
                {isAuthenticated ? 'Scan Now' : 'Get Started'}
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/education"
                className="btn-secondary flex items-center justify-center gap-2 text-lg px-8 py-4 !bg-white/5 !border-white/20 !text-white hover:!bg-white/10"
              >
                Learn About Skin Cancer
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="relative z-10 -mt-16">
        <div className="section-container">
          <motion.div
            className="glass-card p-1 grid grid-cols-2 md:grid-cols-4 gap-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {stats.map(({ value, label, icon: Icon }, i) => (
              <div key={i} className="flex items-center gap-3 px-6 py-5 rounded-xl hover:bg-primary-50/50 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-primary-100 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <div className="font-display font-bold text-xl text-surface-900">{value}</div>
                  <div className="text-xs text-surface-500">{label}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24">
        <div className="section-container">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-4xl font-bold text-surface-900 mb-4">
              Why Choose <span className="gradient-text">DermAI</span>?
            </h2>
            <p className="text-surface-500 text-lg max-w-2xl mx-auto">
              Advanced AI technology meets healthcare accessibility. Our platform is designed 
              specifically for the needs of the Indian population.
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={stagger}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {features.map(({ icon: Icon, title, desc, color }, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="glass-card p-6 group hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display font-semibold text-lg text-surface-900 mb-2">{title}</h3>
                <p className="text-surface-500 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gradient-to-b from-surface-100 to-surface-50">
        <div className="section-container">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-4xl font-bold text-surface-900 mb-4">
              How It Works
            </h2>
            <p className="text-surface-500 text-lg">Three simple steps to get your skin lesion analyzed</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: '01', title: 'Upload Image', desc: 'Drag and drop or select a clear photo of the skin lesion', icon: Upload },
              { step: '02', title: 'AI Analysis', desc: 'Our CNN model processes the image in seconds with advanced preprocessing', icon: Brain },
              { step: '03', title: 'View Results', desc: 'Get prediction, confidence score, risk level, and Grad-CAM heatmap', icon: Eye },
            ].map(({ step, title, desc, icon: Icon }, i) => (
              <motion.div
                key={i}
                className="text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <div className="relative mx-auto mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center mx-auto shadow-xl shadow-primary-500/25">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-8 h-8 bg-accent-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                    {step}
                  </span>
                </div>
                <h3 className="font-display font-semibold text-xl text-surface-900 mb-2">{title}</h3>
                <p className="text-surface-500 text-sm">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="section-container">
          <motion.div
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 p-12 md:p-16 text-center"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent" />
            <div className="relative z-10">
              <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-6">
                Start Your Skin Check Today
              </h2>
              <p className="text-primary-100 text-lg mb-10 max-w-xl mx-auto">
                Early detection is key to successful treatment. Don't wait — get your skin 
                lesion analyzed by AI in seconds.
              </p>
              <Link
                to={isAuthenticated ? '/upload' : '/signup'}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-700 font-bold rounded-xl text-lg hover:bg-primary-50 transition-colors shadow-xl"
              >
                <Upload className="w-5 h-5" />
                {isAuthenticated ? 'Upload Image' : 'Create Free Account'}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
