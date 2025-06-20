import { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Sidebar } from '@/components/Layout/Sidebar';
import { Header } from '@/components/Layout/Header';
import { DashboardOverview } from '@/components/Dashboard/DashboardOverview';
import { ComplaintsPanel } from '@/components/Complaints/ComplaintsPanel';
import { SchemesPanel } from '@/components/Schemes/SchemesPanel';
import { TrafficPanel } from '@/components/Traffic/TrafficPanel';
import { ElderlyPanel } from '@/components/Elderly/ElderlyPanel';
import { ScamPanel } from '@/components/Scam/ScamPanel';
import { AdminToolsPanel } from '@/components/AdminTools/AdminToolsPanel';
import { AIAssistant } from '@/components/AI/AIAssistant';
import { useTranslation } from 'react-i18next';

interface DistrictDashboardProps {
  district: string;
}

const sectionTitles = {
  '': 'District Dashboard Overview',
  'complaints': 'District Complaint Management',
  'schemes': 'District Schemes Management',
  'traffic': 'District Traffic & Infrastructure',
  'elderly': 'District Elderly Skill Program',
  'scam-alerts': 'District Scam Reports & Alerts',
  'admin-tools': 'District Admin Tools'
};

export function DistrictDashboard({ district }: DistrictDashboardProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  // Extract current section from URL
  const currentPath = location.pathname.split('/dashboard/')[1] || '';
  const activeSection = currentPath || 'dashboard';

  const handleSectionChange = (section: string) => {
    if (section === 'dashboard') {
      navigate('/dashboard');
    } else {
      navigate(`/dashboard/${section}`);
    }
  };

  const getCurrentTitle = () => {
    const baseTitle = sectionTitles[currentPath as keyof typeof sectionTitles] || 'District Dashboard';
    return `${baseTitle} - ${district.toUpperCase()}`;
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={handleSectionChange}
        role="district"
      />
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={handleSectionChange}
        role="district"
        isMobile={true}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={getCurrentTitle()} />
        
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-4 md:p-6">
            <Routes>
              <Route path="/" element={<DashboardOverview role="district" district={district} />} />
              <Route path="/complaints" element={<ComplaintsPanel role="district" district={district} />} />
              <Route path="/schemes" element={<SchemesPanel role="district" district={district} />} />
              <Route path="/traffic" element={<TrafficPanel role="district" district={district} />} />
              <Route path="/elderly" element={<ElderlyPanel role="district" district={district} />} />
              <Route path="/scam-alerts" element={<ScamPanel role="district" district={district} />} />
              <Route path="/admin-tools" element={<AdminToolsPanel role="district" district={district} />} />
            </Routes>
          </div>
        </main>
      </div>
      
      <AIAssistant role="district" />
    </div>
  );
}