

import React, { useState } from 'react';
import { MOCK_MAINTENANCE_LOGS, MOCK_TRUCKS } from '../../constants';
import { MaintenanceLog } from '../../types';
import Card from '../../components/Card';
import Modal from '../../components/Modal';
import { PlusCircleIcon } from '../../components/icons';
import { v4 as uuidv4 } from 'uuid';

const initialLogState: Partial<MaintenanceLog> = {
    truckRegistration: MOCK_TRUCKS[0]?.registration || '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    type: 'Cost',
    amount: 0,
    client: '',
};

const FormField: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <div className="mt-1">{children}</div>
    </div>
);


const MaintenanceLogs: React.FC = () => {
    const [logs, setLogs] = useState<MaintenanceLog[]>(MOCK_MAINTENANCE_LOGS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newLog, setNewLog] = useState<Partial<MaintenanceLog>>(initialLogState);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewLog(prev => ({
            ...prev,
            [name]: name === 'amount' ? parseFloat(value) : value,
        }));
    };

    const handleSaveLog = (e: React.FormEvent) => {
        e.preventDefault();
        const logToAdd: MaintenanceLog = {
            id: uuidv4(),
            ...initialLogState,
            ...newLog,
        } as MaintenanceLog;
        
        const updatedLogs = [logToAdd, ...logs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setLogs(updatedLogs);
        
        // Update mock data for consistency across app
        MOCK_MAINTENANCE_LOGS.splice(0, MOCK_MAINTENANCE_LOGS.length, ...updatedLogs);

        setIsModalOpen(false);
        setNewLog(initialLogState);
    };
    
    const openAddModal = () => {
        setNewLog(initialLogState);
        setIsModalOpen(true);
    };

    const LogForm = (
        <form onSubmit={handleSaveLog} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Truck Registration">
                    <select name="truckRegistration" value={newLog.truckRegistration} onChange={handleInputChange} required className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-light focus:border-brand-blue-light sm:text-sm">
                        {MOCK_TRUCKS.map(truck => <option key={truck.id} value={truck.registration}>{truck.registration}</option>)}
                    </select>
                </FormField>
                <FormField label="Date">
                    <input type="date" name="date" value={newLog.date} onChange={handleInputChange} required className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-light focus:border-brand-blue-light sm:text-sm" />
                </FormField>
                <FormField label="Transaction Type">
                    <select name="type" value={newLog.type} onChange={handleInputChange} required className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-light focus:border-brand-blue-light sm:text-sm">
                        <option value="Cost">Cost / Spending</option>
                        <option value="Income">Income</option>
                    </select>
                </FormField>
                <FormField label="Amount (£)">
                     <input type="number" name="amount" value={newLog.amount || ''} onChange={handleInputChange} required min="0" step="0.01" className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-light focus:border-brand-blue-light sm:text-sm" />
                </FormField>
                <FormField label="Client / Vendor / Mechanic">
                     <input type="text" name="client" value={newLog.client} onChange={handleInputChange} placeholder="e.g., QuickFit, Client X" className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-light focus:border-brand-blue-light sm:text-sm" />
                </FormField>
            </div>
            <FormField label="Notes / Description">
                <textarea name="description" value={newLog.description} onChange={handleInputChange} rows={4} required placeholder="What was the spending for, or what was the income from?" className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-light focus:border-brand-blue-light sm:text-sm"></textarea>
            </FormField>
            <div className="pt-5 flex justify-end space-x-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue-light">
                    Cancel
                </button>
                <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand-blue hover:bg-brand-blue-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue-light">
                    Save Log
                </button>
            </div>
        </form>
    );

    return (
        <>
        <Card title="Maintenance & Vehicle Logs" action={
             <button onClick={openAddModal} className="flex items-center px-4 py-2 bg-brand-blue hover:bg-brand-blue-light text-white rounded-md text-sm font-medium transition-colors">
                <PlusCircleIcon className="h-5 w-5 mr-2" />
                Add Log Entry
            </button>
        }>
             <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Truck</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client/Vendor</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {logs.map((log) => (
                            <tr key={log.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(log.date).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-brand-dark">{log.truckRegistration}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-sm truncate" title={log.description}>{log.description}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.type}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.client}</td>
                                <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-semibold ${log.type === 'Income' ? 'text-green-600' : 'text-red-600'}`}>
                                    {log.type === 'Income' ? '+' : '-'}
                                    {log.amount.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Maintenance/Vehicle Log">
            {LogForm}
        </Modal>
        </>
    );
};

export default MaintenanceLogs;