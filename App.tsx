import React, { useState } from 'react';
import LoginPage from './pages/LoginPage';
import DriverDashboard from './pages/driver/DriverDashboard';
import ManagerDashboard from './pages/manager/ManagerDashboard';
import { User, UserRole } from './types';
import Header from './components/Header';

const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogin = (loggedInUser: User) => {
        setUser(loggedInUser);
    };

    const handleLogout = () => {
        setUser(null);
    };

    const renderDashboard = () => {
        if (!user) {
            return <LoginPage onLogin={handleLogin} />;
        }

        return (
            <div className="min-h-screen bg-gray-100">
                <Header 
                    user={user} 
                    onLogout={handleLogout} 
                    onMenuToggle={() => setIsMenuOpen(prev => !prev)}
                />
                <main className="p-4 sm:p-6 lg:p-8">
                    {user.role === UserRole.DRIVER && <DriverDashboard user={user} isMenuOpen={isMenuOpen} setMenuOpen={setIsMenuOpen} />}
                    {user.role === UserRole.MANAGER && <ManagerDashboard user={user} isMenuOpen={isMenuOpen} setMenuOpen={setIsMenuOpen}/>}
                </main>
            </div>
        );
    };

    return (
        <div className="bg-brand-gray min-h-screen font-sans">
            {renderDashboard()}
        </div>
    );
};

export default App;