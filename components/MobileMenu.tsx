import React from 'react';
import { XIcon } from './icons';

interface Tab {
    label: string;
    icon: React.ReactNode;
}

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    tabs: Tab[];
    activeTab: number;
    onTabClick: (index: number) => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, tabs, activeTab, onTabClick }) => {
    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            ></div>

            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-40 sidebar-transition ${isOpen ? 'transform translate-x-0' : 'transform -translate-x-full'}`}
            >
                <div className="p-4 flex justify-between items-center border-b">
                    <h2 className="font-bold text-lg text-brand-blue">Menu</h2>
                    <button onClick={onClose} className="text-gray-600 hover:text-gray-900">
                        <XIcon className="h-6 w-6" />
                    </button>
                </div>
                <nav className="mt-4">
                    <ul>
                        {tabs.map((tab, index) => (
                            <li key={tab.label}>
                                <button
                                    onClick={() => onTabClick(index)}
                                    className={`
                                        w-full text-left flex items-center px-4 py-3
                                        ${activeTab === index 
                                            ? 'bg-brand-blue-light text-white' 
                                            : 'text-gray-700 hover:bg-gray-100'
                                        }
                                    `}
                                >
                                    <span className="mr-3">{tab.icon}</span>
                                    <span className="font-medium">{tab.label}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </>
    );
};

export default MobileMenu;