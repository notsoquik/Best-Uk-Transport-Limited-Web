import React from 'react';
import { User } from '../types';
import { TruckIcon, MenuIcon } from './icons';

interface HeaderProps {
    user: User;
    onLogout: () => void;
    onMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, onMenuToggle }) => {
    return (
        <header className="bg-brand-blue shadow-md">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                         <button onClick={onMenuToggle} className="text-white mr-4 md:hidden">
                            <MenuIcon className="h-6 w-6" />
                        </button>
                        <TruckIcon className="h-8 w-8 text-white" />
                        <h1 className="ml-3 text-xl md:text-2xl font-bold text-white tracking-wider">
                            Best UK Transport Ltd
                        </h1>
                    </div>
                    <div className="flex items-center">
                        <div className="text-right mr-4 hidden sm:block">
                            <p className="text-white font-medium">{user.name}</p>
                            <p className="text-sm text-gray-300 capitalize">{user.role}</p>
                        </div>
                        <button
                            onClick={onLogout}
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;