/**
 * Footer.jsx — Application footer with medical disclaimer
 */
import { Link } from 'react-router-dom';
import { Shield, Heart, AlertTriangle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-surface-900 border-t border-white/10">
      {/* Medical Disclaimer Banner */}
      <div className="bg-amber-500/10 border-b border-amber-500/20">
        <div className="section-container py-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-amber-200/90">
              <strong>Medical Disclaimer:</strong> This application is not a medical diagnosis tool. 
              It is designed for educational and screening purposes only. Results should not replace 
              professional medical advice. Please consult a certified dermatologist for proper diagnosis 
              and treatment.
            </p>
          </div>
        </div>
      </div>

      <div className="section-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-lg text-white">
                Derm<span className="text-primary-400">AI</span>
              </span>
            </div>
            <p className="text-surface-400 text-sm leading-relaxed max-w-md">
              AI-powered skin cancer detection optimized for Indian skin tones. 
              Using advanced deep learning and Grad-CAM explainability to make 
              dermatological screening accessible to everyone.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { to: '/upload', label: 'Scan Image' },
                { to: '/education', label: 'Learn More' },
                { to: '/doctors', label: 'Find Doctors' },
                { to: '/dashboard', label: 'My Scans' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-surface-400 hover:text-primary-400 text-sm transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-2">
              {[
                { href: 'https://www.isic-archive.com/', label: 'ISIC Archive' },
                { href: 'https://www.skincancer.org/', label: 'Skin Cancer Foundation' },
                { href: 'https://www.aad.org/', label: 'AAD Guidelines' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <a href={href} target="_blank" rel="noopener noreferrer" className="text-surface-400 hover:text-primary-400 text-sm transition-colors">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-surface-500 text-sm">
            © {new Date().getFullYear()} DermAI. Built with ❤️ for healthcare accessibility.
          </p>
          <p className="flex items-center gap-1 text-surface-500 text-sm">
            Made with <Heart className="w-3.5 h-3.5 text-red-400" /> in India
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
