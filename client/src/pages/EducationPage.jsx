/**
 * EducationPage.jsx — Information about skin cancer types, prevention, and when to see a doctor
 */
import { motion } from 'framer-motion';
import {
  BookOpen, Sun, Shield, AlertTriangle, Search, Droplets,
  Eye, Heart, Clock, CheckCircle, ArrowRight, Info
} from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 }
};

const EducationPage = () => {
  const cancerTypes = [
    {
      name: 'Melanoma',
      risk: 'High',
      description: 'The most dangerous type of skin cancer. It develops from melanocytes (cells that give skin its color). Can appear as a new dark spot or a change in an existing mole.',
      signs: ['Asymmetric shape', 'Irregular borders', 'Multiple colors', 'Diameter > 6mm', 'Evolving size/shape'],
      prevalence: 'Less common but most lethal. Accounts for ~1% of skin cancers but majority of deaths.',
      color: 'from-red-500 to-rose-600',
    },
    {
      name: 'Basal Cell Carcinoma',
      risk: 'High',
      description: 'The most common type of skin cancer. Grows slowly and rarely spreads, but can cause significant local damage if left untreated.',
      signs: ['Pearly/waxy bump', 'Flat, flesh-colored lesion', 'Bleeding or scabbing sore', 'Sore that heals then returns'],
      prevalence: 'Most common skin cancer worldwide. More common in fair-skinned but can occur in darker skin.',
      color: 'from-orange-500 to-red-500',
    },
    {
      name: 'Squamous Cell Carcinoma',
      risk: 'Medium-High',
      description: 'The second most common type. Can grow deep into the skin and cause damage. More likely to spread than basal cell carcinoma.',
      signs: ['Firm, red nodule', 'Flat lesion with scaly crust', 'New sore on old scar', 'Rough, scaly patch on lip'],
      prevalence: 'Common in sun-exposed areas. Can occur in people of all skin tones.',
      color: 'from-amber-500 to-orange-600',
    },
    {
      name: 'Melanocytic Nevus',
      risk: 'Low',
      description: 'Common moles. Usually benign growths of melanocytes. Most are harmless, but atypical moles may develop into melanoma.',
      signs: ['Round/oval shape', 'Smaller than 6mm', 'Uniform color', 'Smooth borders'],
      prevalence: 'Very common. Average person has 10-40 moles. Most are completely harmless.',
      color: 'from-green-500 to-emerald-600',
    },
    {
      name: 'Actinic Keratosis',
      risk: 'Medium',
      description: 'Pre-cancerous rough, scaly patches from years of sun exposure. Can progress to squamous cell carcinoma if untreated.',
      signs: ['Rough, dry, scaly patch', 'Flat or slightly raised', 'Pink, red, or brown color', 'On sun-exposed skin'],
      prevalence: 'Very common in people over 40 with significant sun exposure.',
      color: 'from-yellow-500 to-amber-600',
    },
  ];

  const preventionTips = [
    { icon: Sun, title: 'Use Sunscreen Daily', desc: 'Apply broad-spectrum SPF 30+ sunscreen 15 minutes before going out. Reapply every 2 hours.' },
    { icon: Shield, title: 'Wear Protective Clothing', desc: 'Long sleeves, wide-brimmed hats, and UV-blocking sunglasses when outdoors.' },
    { icon: Clock, title: 'Avoid Peak Sun Hours', desc: 'Stay in shade between 10 AM and 4 PM when UV rays are strongest.' },
    { icon: Search, title: 'Regular Self-Exams', desc: 'Check your skin monthly using the ABCDE rule for moles (Asymmetry, Border, Color, Diameter, Evolving).' },
    { icon: Droplets, title: 'Stay Hydrated', desc: 'Well-hydrated skin is more resilient. Drink adequate water daily.' },
    { icon: Heart, title: 'Annual Dermatologist Visit', desc: 'Get a professional full-body skin exam at least once a year, especially if you have risk factors.' },
  ];

  const warningSignsToSeeDoctor = [
    'A mole that changes in size, shape, or color',
    'A new growth that doesn\'t heal within 2-3 weeks',
    'A spot that becomes itchy, tender, or painful',
    'A mole with irregular borders or multiple colors',
    'A shiny, waxy, or pearly bump',
    'A flat, red spot that is rough, dry, or scaly',
    'A sore that bleeds and doesn\'t heal',
    'Any existing mole that starts to grow or evolve',
  ];

  return (
    <div className="page-wrapper bg-gradient-to-b from-surface-50 to-white">
      <div className="section-container py-12">
        {/* Header */}
        <motion.div className="text-center mb-16" {...fadeInUp}>
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-primary-500/20">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-display text-4xl font-bold text-surface-900 mb-3">
            Learn About <span className="gradient-text">Skin Cancer</span>
          </h1>
          <p className="text-surface-500 text-lg max-w-2xl mx-auto">
            Understanding skin cancer types, risk factors, and prevention is the first step 
            toward protecting your health. Knowledge saves lives.
          </p>
        </motion.div>

        {/* Indian Skin Tones Section */}
        <motion.div className="glass-card p-8 mb-12 border-l-4 border-primary-500" {...fadeInUp}>
          <div className="flex items-start gap-4">
            <Info className="w-6 h-6 text-primary-500 flex-shrink-0 mt-1" />
            <div>
              <h2 className="font-display text-xl font-bold text-surface-900 mb-2">
                Skin Cancer & Indian Skin Tones
              </h2>
              <p className="text-surface-600 leading-relaxed">
                While skin cancer rates are lower in people with darker skin tones (Fitzpatrick IV-VI, common in India), 
                it is <strong>NOT immune</strong>. Skin cancer in darker skin is often diagnosed at later, more dangerous stages. 
                Melanoma in Indian skin tends to appear in less sun-exposed areas like palms, soles, and nail beds (acral melanoma). 
                Our AI model is specifically optimized with preprocessing for darker skin tones to improve detection accuracy.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Cancer Types */}
        <motion.div className="mb-16" {...fadeInUp}>
          <h2 className="font-display text-3xl font-bold text-surface-900 mb-8 text-center">
            Skin Cancer Types
          </h2>
          <div className="space-y-6">
            {cancerTypes.map((type, i) => (
              <motion.div
                key={i}
                className="glass-card overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className={`h-1.5 bg-gradient-to-r ${type.color}`} />
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-display text-xl font-bold text-surface-900">{type.name}</h3>
                        <span className={`badge-${type.risk.toLowerCase().replace('-', '')}`}>
                          {type.risk} Risk
                        </span>
                      </div>
                      <p className="text-surface-600 text-sm leading-relaxed">{type.description}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="bg-surface-50 rounded-xl p-4">
                      <h4 className="font-semibold text-sm text-surface-700 mb-2">Warning Signs</h4>
                      <ul className="space-y-1">
                        {type.signs.map((sign, j) => (
                          <li key={j} className="text-sm text-surface-600 flex items-center gap-2">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                            {sign}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-surface-50 rounded-xl p-4">
                      <h4 className="font-semibold text-sm text-surface-700 mb-2">Prevalence</h4>
                      <p className="text-sm text-surface-600">{type.prevalence}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Prevention Tips */}
        <motion.div className="mb-16" {...fadeInUp}>
          <h2 className="font-display text-3xl font-bold text-surface-900 mb-8 text-center">
            Prevention Tips
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {preventionTips.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={i}
                className="glass-card p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 flex items-center justify-center mb-4 shadow-lg shadow-accent-500/20">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-display font-semibold text-surface-900 mb-2">{title}</h3>
                <p className="text-sm text-surface-600 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* When to See a Doctor */}
        <motion.div className="glass-card p-8 border-l-4 border-red-500" {...fadeInUp}>
          <div className="flex items-start gap-4 mb-6">
            <AlertTriangle className="w-8 h-8 text-red-500 flex-shrink-0" />
            <div>
              <h2 className="font-display text-2xl font-bold text-surface-900 mb-1">
                When to Consult a Doctor
              </h2>
              <p className="text-surface-500">See a dermatologist immediately if you notice any of these signs:</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {warningSignsToSeeDoctor.map((sign, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-red-50 rounded-xl">
                <Eye className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-red-800">{sign}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EducationPage;
