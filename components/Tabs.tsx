import React from 'react';

interface Tab {
    label: string;
    icon: React.ReactNode;
}

interface TabsProps {
    tabs: Tab[];
    activeTab: number;
    onTabClick: (index: number) => void;
    className?: string;
}

const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabClick, className = '' }) => {
    return (
        <div className={`mb-6 border-b border-gray-200 ${className}`}>
            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                {tabs.map((tab, index) => (
                    <button
                        key={tab.label}
                        onClick={() => onTabClick(index)}
                        className={`
                            ${
                                activeTab === index
                                    ? 'border-brand-blue-light text-brand-blue-light'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }
                            whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors duration-200
                        `}
                    >
                        <span className="mr-2">{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default Tabs;