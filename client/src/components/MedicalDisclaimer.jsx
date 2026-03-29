/**
 * MedicalDisclaimer.jsx — Reusable medical disclaimer component
 */
import { AlertTriangle } from 'lucide-react';

const MedicalDisclaimer = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="flex items-center gap-2 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl">
        <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
        <p className="text-xs text-amber-700">
          This is not a medical diagnosis. Please consult a certified dermatologist.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-amber-50 border border-amber-200 rounded-2xl">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="w-6 h-6 text-amber-600" />
        </div>
        <div>
          <h3 className="font-display font-semibold text-amber-800 text-lg mb-2">
            Medical Disclaimer
          </h3>
          <p className="text-amber-700 text-sm leading-relaxed">
            This application is <strong>not a medical diagnosis tool</strong>. It uses AI-based 
            image analysis for screening purposes only. Results may not be accurate and should 
            never replace professional medical evaluation. Always consult a certified 
            dermatologist for proper diagnosis and treatment. Early detection saves lives — 
            if you notice any changes in a mole or skin lesion, please see a doctor immediately.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MedicalDisclaimer;
