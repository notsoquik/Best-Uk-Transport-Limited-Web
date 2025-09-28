import React, { useState } from 'react';
import { User } from '../../types';
import Tabs from '../../components/Tabs';
import { BarChartIcon, TruckIcon, SettingsIcon, UserIcon, CheckSquareIcon, BellIcon } from '../../components/icons';
import ManagerOverview from './ManagerOverview';
import TruckManagement from './TruckManagement';
import MaintenanceLogs from './MaintenanceLogs';
import DriverPerformance from './DriverPerformance';
import MobileMenu from '../../components/MobileMenu';
import Notifications from './Notifications';
import ProfitLoss from './ProfitLoss';

interface ManagerDashboardProps {
    user: User;
    isMenuOpen: boolean;
    setMenuOpen: (isOpen: boolean) => void;
}

const ManagerDashboard: React.FC<ManagerDashboardProps> = ({ user, isMenuOpen, setMenuOpen }) => {
    const [activeTab, setActiveTab] = useState(0);

    const tabs = [
        { label: 'Overview & Submissions', icon: <CheckSquareIcon className="h-5 w-5" /> },
        { label: 'Fleet Management', icon: <TruckIcon className="h-5 w-5" /> },
        { label: 'Driver Management', icon: <UserIcon className="h-5 w-5" /> },
        { label: 'Maintenance Logs', icon: <SettingsIcon className="h-5 w-5" /> },
        { label: 'Notifications', icon: <BellIcon className="h-5 w-5" /> },
        { label: 'Profit & Loss', icon: <BarChartIcon className="h-5 w-5" /> },
    ];

    const handleTabClick = (index: number) => {
        setActiveTab(index);
        setMenuOpen(false);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 0:
                return <ManagerOverview />;
            case 1:
                return <TruckManagement />;
            case 2:
                return <DriverPerformance />;
            case 3:
                return <MaintenanceLogs />;
            case 4:
                return <Notifications user={user} />;
            case 5:
                return <ProfitLoss />;
            default:
                return null;
        }
    };

    return (
        <div className="container mx-auto">
             <MobileMenu 
                isOpen={isMenuOpen} 
                onClose={() => setMenuOpen(false)}
                tabs={tabs}
                activeTab={activeTab}
                onTabClick={handleTabClick}
            />
            <h2 className="text-2xl md:text-3xl font-bold text-brand-dark mb-4">Manager Dashboard</h2>
            <Tabs tabs={tabs} activeTab={activeTab} onTabClick={setActiveTab} className="hidden md:flex" />
            <div>
                {renderContent()}
            </div>
        </div>
    );
};

export default ManagerDashboard;