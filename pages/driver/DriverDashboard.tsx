import React, { useState } from 'react';
import { User } from '../../types';
import Tabs from '../../components/Tabs';
import { UserIcon, ClockIcon, ClipboardListIcon, HistoryIcon, FuelIcon, BellIcon } from '../../components/icons';
import MyDetails from './MyDetails';
import ShiftManagement from './ShiftManagement';
import DailyVehicleChecks from './DailyVehicleChecks';
import SubmissionsHistory from './SubmissionsHistory';
import FuelIntake from './FuelIntake';
import MobileMenu from '../../components/MobileMenu';
import Notifications from './Notifications';

interface DriverDashboardProps {
    user: User;
    isMenuOpen: boolean;
    setMenuOpen: (isOpen: boolean) => void;
}

const DriverDashboard: React.FC<DriverDashboardProps> = ({ user, isMenuOpen, setMenuOpen }) => {
    const [activeTab, setActiveTab] = useState(0);

    const tabs = [
        { label: 'Notifications', icon: <BellIcon className="h-5 w-5" /> },
        { label: 'My Details', icon: <UserIcon className="h-5 w-5" /> },
        { label: 'Shift Management', icon: <ClockIcon className="h-5 w-5" /> },
        { label: 'Daily Vehicle Checks', icon: <ClipboardListIcon className="h-5 w-5" /> },
        { label: 'Fuel Intake', icon: <FuelIcon className="h-5 w-5" /> },
        { label: 'Submissions History', icon: <HistoryIcon className="h-5 w-5" /> },
    ];

    const handleTabClick = (index: number) => {
        setActiveTab(index);
        setMenuOpen(false);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 0:
                return <Notifications userId={user.id} />;
            case 1:
                return <MyDetails userId={user.id} />;
            case 2:
                return <ShiftManagement user={user} />;
            case 3:
                return <DailyVehicleChecks user={user} />;
            case 4:
                return <FuelIntake user={user} />;
            case 5:
                return <SubmissionsHistory user={user} />;
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
            <h2 className="text-2xl md:text-3xl font-bold text-brand-dark mb-4">Driver Dashboard</h2>
            <Tabs tabs={tabs} activeTab={activeTab} onTabClick={setActiveTab} className="hidden md:flex" />
            <div>
                {renderContent()}
            </div>
        </div>
    );
};

export default DriverDashboard;
