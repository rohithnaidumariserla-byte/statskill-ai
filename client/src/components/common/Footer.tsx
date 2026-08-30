import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-auto">
      <div className="tricolor-strip w-full" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-2">
            <h4 className="text-white font-bold text-sm mb-2">StatSkill AI — Statistical Skill Intelligence Platform</h4>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              Developed for the Smart India Hackathon (SIH 2026). Empowering officials across India's Official Statistical System (MoSPI, NSO, State DESs, and NSSTA) with personalized skill gap analytics, adaptive AI testing, and intelligent learning roadmaps.
            </p>
          </div>
          <div>
            <h5 className="text-white font-semibold text-xs mb-2">Institutional Integrations</h5>
            <ul className="space-y-1 text-[11px]">
              <li>• iGOT Karmayogi Course API</li>
              <li>• NSSTA Training Programmes (TPAC)</li>
              <li>• National Indicator Framework (NIF)</li>
              <li>• MeitY MeghRaj Cloud Guidelines</li>
            </ul>
          </div>
          <div>
            <h5 className="text-white font-semibold text-xs mb-2">Government Compliance</h5>
            <ul className="space-y-1 text-[11px]">
              <li>• GIGW 3.0 Accessible Interface</li>
              <li>• DPDP Act 2023 Confidentiality</li>
              <li>• Role-Based Access Control</li>
              <li>• Open Data (NDAP) Schema Ready</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-[11px] text-slate-500">
          <p>© 2026 StatSkill AI SIH Prototype • Ministry of Statistics and Programme Implementation</p>
          <p className="mt-2 md:mt-0">Design standard: Government Enterprise Platform UI</p>
        </div>
      </div>
    </footer>
  );
};
