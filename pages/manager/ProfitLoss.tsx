import React, { useState } from 'react';
import { MOCK_SHIFTS, MOCK_MAINTENANCE_LOGS, MOCK_FUEL_INTAKES, MOCK_FINANCIAL_TRANSACTIONS } from '../../constants';
import { FinancialTransaction, TransactionType } from '../../types';
import Card from '../../components/Card';
import { v4 as uuidv4 } from 'uuid';

const ProfitLoss: React.FC = () => {
    // Local state to manage transactions for this session
    const [financialTransactions, setFinancialTransactions] = useState<FinancialTransaction[]>(MOCK_FINANCIAL_TRANSACTIONS);
    const [newTransaction, setNewTransaction] = useState({ type: TransactionType.EXPENSE, description: '', amount: '' });

    const handleTransactionChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewTransaction(prev => ({ ...prev, [name]: value }));
    };

    const handleAddTransaction = (e: React.FormEvent) => {
        e.preventDefault();
        const amount = parseFloat(newTransaction.amount);
        if (!newTransaction.description || isNaN(amount) || amount <= 0) {
            alert('Please provide a valid description and amount.');
            return;
        }

        const transactionToAdd: FinancialTransaction = {
            id: uuidv4(),
            type: newTransaction.type as TransactionType,
            description: newTransaction.description,
            amount,
            date: new Date().toISOString().split('T')[0],
        };

        const updatedTransactions = [transactionToAdd, ...financialTransactions];
        setFinancialTransactions(updatedTransactions);
        MOCK_FINANCIAL_TRANSACTIONS.splice(0, MOCK_FINANCIAL_TRANSACTIONS.length, ...updatedTransactions); // Update mock data for consistency across app
        setNewTransaction({ type: TransactionType.EXPENSE, description: '', amount: '' });
    };


    // P&L Calculations
    const shiftRevenue = MOCK_SHIFTS.reduce((sum, shift) => sum + (shift.revenue || 0), 0);
    const maintenanceIncome = MOCK_MAINTENANCE_LOGS.reduce((sum, log) => sum + (log.type === 'Income' ? log.amount : 0), 0);
    const otherIncome = financialTransactions.reduce((sum, t) => sum + (t.type === TransactionType.INCOME ? t.amount : 0), 0);
    const totalRevenue = shiftRevenue + maintenanceIncome + otherIncome;

    const maintenanceCosts = MOCK_MAINTENANCE_LOGS.reduce((sum, log) => sum + (log.type === 'Cost' ? log.amount : 0), 0);
    const fuelCosts = MOCK_FUEL_INTAKES.reduce((sum, intake) => {
        const dieselCost = intake.diesel?.price || 0;
        const adBlueCost = intake.adBlue?.price || 0;
        const otherCost = intake.other?.price || 0;
        return sum + dieselCost + adBlueCost + otherCost;
    }, 0);
    const otherExpenses = financialTransactions.reduce((sum, t) => sum + (t.type === TransactionType.EXPENSE ? t.amount : 0), 0);
    const totalCosts = maintenanceCosts + fuelCosts + otherExpenses;

    const profitLoss = totalRevenue - totalCosts;

    return (
        <div className="space-y-6">
            <Card title="Profit & Loss Statement">
                <div className="p-4 bg-gray-50 rounded-lg border">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                        <div>
                            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Revenue</h4>
                            <p className="mt-2 text-4xl font-bold text-green-600">
                                {totalRevenue.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })}
                            </p>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Costs</h4>
                            <p className="mt-2 text-4xl font-bold text-red-600">
                                {totalCosts.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })}
                            </p>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Net Profit / Loss</h4>
                            <p className={`mt-2 text-4xl font-bold ${profitLoss >= 0 ? 'text-brand-blue' : 'text-red-600'}`}>
                                {profitLoss.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t">
                    <h4 className="text-lg font-semibold text-brand-dark mb-4">Detailed Breakdown</h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-gray-50 p-4 rounded-lg border">
                            <h5 className="font-semibold text-green-700 mb-2">Revenue Streams</h5>
                            <ul className="max-h-60 overflow-y-auto pr-2 divide-y">
                                {MOCK_SHIFTS.filter(s => s.revenue).map(shift => (
                                    <li key={`rev-shift-${shift.id}`} className="flex justify-between items-center text-sm py-2">
                                        <div>
                                            <p className="font-medium">Shift: {shift.driverName} ({new Date(shift.startTime).toLocaleDateString()})</p>
                                            <p className="text-xs text-gray-500">{shift.commodity}</p>
                                        </div>
                                        <span className="font-semibold text-green-600">{ (shift.revenue || 0).toLocaleString('en-GB', { style: 'currency', currency: 'GBP' }) }</span>
                                    </li>
                                ))}
                                {MOCK_MAINTENANCE_LOGS.filter(l => l.type === 'Income').map(log => (
                                     <li key={`rev-log-${log.id}`} className="flex justify-between items-center text-sm py-2">
                                         <div>
                                            <p className="font-medium">Vehicle Income: {log.description}</p>
                                            <p className="text-xs text-gray-500">{log.client}</p>
                                        </div>
                                        <span className="font-semibold text-green-600">{ (log.amount).toLocaleString('en-GB', { style: 'currency', currency: 'GBP' }) }</span>
                                     </li>
                                ))}
                                {financialTransactions.filter(t => t.type === TransactionType.INCOME).map(t => (
                                    <li key={`rev-other-${t.id}`} className="flex justify-between items-center text-sm py-2">
                                        <div><p className="font-medium">Other: {t.description}</p></div>
                                        <span className="font-semibold text-green-600">{t.amount.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                         <div className="bg-gray-50 p-4 rounded-lg border">
                            <h5 className="font-semibold text-red-700 mb-2">Cost Centers</h5>
                             <ul className="max-h-60 overflow-y-auto pr-2 divide-y">
                                 {MOCK_FUEL_INTAKES.map(intake => (
                                    <li key={`cost-fuel-${intake.id}`} className="flex justify-between items-center text-sm py-2">
                                        <div><p className="font-medium">Fuel: {intake.truckRegistration} ({new Date(intake.date).toLocaleDateString()})</p></div>
                                        <span className="font-semibold text-red-600">{ ((intake.diesel?.price || 0) + (intake.adBlue?.price || 0) + (intake.other?.price || 0)).toLocaleString('en-GB', { style: 'currency', currency: 'GBP' }) }</span>
                                    </li>
                                ))}
                                 {MOCK_MAINTENANCE_LOGS.filter(l => l.type === 'Cost').map(log => (
                                    <li key={`cost-maint-${log.id}`} className="flex justify-between items-center text-sm py-2">
                                         <div>
                                            <p className="font-medium">Maintenance: {log.description}</p>
                                            <p className="text-xs text-gray-500">{log.truckRegistration} - {log.client}</p>
                                        </div>
                                        <span className="font-semibold text-red-600">{ (log.amount).toLocaleString('en-GB', { style: 'currency', currency: 'GBP' }) }</span>
                                    </li>
                                ))}
                                {financialTransactions.filter(t => t.type === TransactionType.EXPENSE).map(t => (
                                    <li key={`cost-other-${t.id}`} className="flex justify-between items-center text-sm py-2">
                                        <div><p className="font-medium">Other: {t.description}</p></div>
                                        <span className="font-semibold text-red-600">{t.amount.toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </Card>

             <Card title="Add Financial Transaction">
                <form onSubmit={handleAddTransaction} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Description</label>
                        <input type="text" name="description" value={newTransaction.description} onChange={handleTransactionChange} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-light focus:border-brand-blue-light sm:text-sm" placeholder="e.g. Driver wages, Office supplies" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Amount (£)</label>
                        <input type="number" name="amount" value={newTransaction.amount} onChange={handleTransactionChange} required min="0.01" step="0.01" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-light focus:border-brand-blue-light sm:text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Type</label>
                        <select name="type" value={newTransaction.type} onChange={handleTransactionChange} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-light focus:border-brand-blue-light sm:text-sm">
                            <option value={TransactionType.EXPENSE}>Expense / Spending</option>
                            <option value={TransactionType.INCOME}>Income / Profit</option>
                        </select>
                    </div>
                    <button type="submit" className="md:col-start-4 w-full bg-brand-blue hover:bg-brand-blue-light text-white font-bold py-2 px-4 rounded-md transition duration-300">
                        Add Transaction
                    </button>
                </form>
            </Card>

        </div>
    );
};

export default ProfitLoss;