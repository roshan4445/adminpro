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
import { VoiceComplaintAssistant } from '@/components/Voice/VoiceComplaintAssistant';
import { useTranslation } from 'react-i18next';

interface MandalDashboardProps {
  mandal: string;
}

const sectionTitles = {
  '': 'Mandal Dashboard Overview',
  'complaints': 'Mandal Complaint Management',
  'schemes': 'Mandal Schemes Management',
  'traffic': 'Mandal Traffic & Infrastructure',
  'elderly': 'Mandal Elderly Skill Program',
  'scam-alerts': 'Mandal Scam Reports & Alerts',
  'admin-tools': 'Mandal Admin Tools'
};

export function MandalDashboard({ mandal }: MandalDashboardProps) {
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
    const baseTitle = sectionTitles[currentPath as keyof typeof sectionTitles] || 'Mandal Dashboard';
    return `${baseTitle} - ${mandal.toUpperCase()}`;
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={handleSectionChange}
        role="mandal"
      />
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={handleSectionChange}
        role="mandal"
        isMobile={true}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={getCurrentTitle()} />
        
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto p-4 md:p-6">
            <Routes>
              <Route path="/" element={<DashboardOverview role="mandal" mandal={mandal} />} />
              <Route path="/complaints" element={<ComplaintsPanel role="mandal" mandal={mandal} />} />
              <Route path="/schemes" element={<SchemesPanel role="mandal" mandal={mandal} />} />
              <Route path="/traffic" element={<TrafficPanel role="mandal" mandal={mandal} />} />
              <Route path="/elderly" element={<ElderlyPanel role="mandal" mandal={mandal} />} />
              <Route path="/scam-alerts" element={<ScamPanel role="mandal" mandal={mandal} />} />
              <Route path="/admin-tools" element={<AdminToolsPanel role="mandal" mandal={mandal} />} />
            </Routes>
          </div>
        </main>
      </div>
      
      <AIAssistant role="mandal" />
      <VoiceComplaintAssistant />
    </div>
  );
}