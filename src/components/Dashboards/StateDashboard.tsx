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

const sectionTitles = {
  '': 'State Dashboard Overview',
  'complaints': 'State Complaint Management',
  'schemes': 'State Schemes Management',
  'traffic': 'State Traffic & Infrastructure',
  'elderly': 'State Elderly Skill Program',
  'scam-alerts': 'State Scam Reports & Alerts',
  'admin-tools': 'State Admin Tools'
};

export function StateDashboard() {
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
    return sectionTitles[currentPath as keyof typeof sectionTitles] || 'State Dashboard';
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={handleSectionChange}
        role="state"
      />
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={handleSectionChange}
        role="state"
        isMobile={true}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={getCurrentTitle()} />
        
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-4 md:p-6">
            <Routes>
              <Route path="/" element={<DashboardOverview role="state" />} />
              <Route path="/complaints" element={<ComplaintsPanel role="state" />} />
              <Route path="/schemes" element={<SchemesPanel role="state" />} />
              <Route path="/traffic" element={<TrafficPanel role="state" />} />
              <Route path="/elderly" element={<ElderlyPanel role="state" />} />
              <Route path="/scam-alerts" element={<ScamPanel role="state" />} />
              <Route path="/admin-tools" element={<AdminToolsPanel role="state" />} />
            </Routes>
          </div>
        </main>
      </div>
      
      <AIAssistant role="state" />
    </div>
  );
}