
import React, { useState } from 'react';
import { User, VehicleCheckItem, DailyVehicleCheck } from '../../types';
import { DEFAULT_VEHICLE_CHECKS, MOCK_TRUCKS } from '../../constants';
import Card from '../../components/Card';
import { v4 as uuidv4 } from 'uuid';

interface DailyVehicleChecksProps {
    user: User;
}

const DailyVehicleChecks: React.FC<DailyVehicleChecksProps> = ({ user }) => {
    const [checklist, setChecklist] = useState<VehicleCheckItem[]>(
        DEFAULT_VEHICLE_CHECKS.map(item => ({ ...item, isFaulty: false, description: '' }))
    );
    const [truckRegistration, setTruckRegistration] = useState(MOCK_TRUCKS[0].registration);
    const [startMileage, setStartMileage] = useState(0);
    const [submittedInfo, setSubmittedInfo] = useState<{ name: string; time: string } | null>(null);

    const handleCheckChange = (id: string, isFaulty: boolean) => {
        setChecklist(prev =>
            prev.map(item => (item.id === id ? { ...item, isFaulty, description: isFaulty ? item.description : '' } : item))
        );
    };

    const handleDescriptionChange = (id: string, description: string) => {
        setChecklist(prev =>
            prev.map(item => (item.id === id ? { ...item, description } : item))
        );
    };

    const handleTruckRegistrationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setTruckRegistration(e.target.value);
    };

    const handleStartMileageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStartMileage(parseFloat(e.target.value) || 0);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newCheck: DailyVehicleCheck = {
            id: uuidv4(),
            driverId: user.id,
            driverName: user.name,
            truckRegistration,
            date: new Date().toISOString().split('T')[0],
            startMileage,
            checklist
        };
        console.log('Submitting vehicle check:', newCheck);
        alert('Daily vehicle check submitted successfully!');
        setSubmittedInfo({ name: user.name, time: new Date().toLocaleString() });
    };

    const handleReset = () => {
        setChecklist(DEFAULT_VEHICLE_CHECKS.map(item => ({ ...item, isFaulty: false, description: '' })));
        setStartMileage(0);
        setTruckRegistration(MOCK_TRUCKS[0].registration);
        setSubmittedInfo(null);
    };

    return (
        <Card title="Daily Vehicle Walkaround Check">
            <form onSubmit={handleSubmit}>
                <fieldset disabled={!!submittedInfo}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 p-4 bg-gray-50 rounded-lg border">
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Truck Registration</label>
                            <select
                                value={truckRegistration}
                                onChange={handleTruckRegistrationChange}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-light focus:border-brand-blue-light sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                            >
                                {MOCK_TRUCKS.map(truck => (
                                    <option key={truck.id} value={truck.registration}>{truck.registration}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Starting Mileage</label>
                            <input
                                type="number"
                                value={startMileage}
                                onChange={handleStartMileageChange}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-light focus:border-brand-blue-light sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Date</label>
                            <input
                                type="date"
                                readOnly
                                value={new Date().toISOString().split('T')[0]}
                                className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm sm:text-sm disabled:cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        {checklist.map((item, index) => (
                            <div key={item.id} className={`p-4 border rounded-lg shadow-sm ${submittedInfo ? 'bg-gray-50' : 'bg-white'}`}>
                                <div className="flex flex-wrap items-center justify-between">
                                    <span className="font-medium text-brand-dark">{index + 1}. {item.name}</span>
                                    <div className="flex items-center space-x-4 mt-2 sm:mt-0">
                                        <label className="flex items-center">
                                            <input type="radio" name={`check-${item.id}`} checked={!item.isFaulty} onChange={() => handleCheckChange(item.id, false)} className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 disabled:cursor-not-allowed"/>
                                            <span className="ml-2 text-green-700">Not Faulty</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input type="radio" name={`check-${item.id}`} checked={item.isFaulty} onChange={() => handleCheckChange(item.id, true)} className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 disabled:cursor-not-allowed"/>
                                            <span className="ml-2 text-red-700">Faulty</span>
                                        </label>
                                    </div>
                                </div>
                                {item.isFaulty && (
                                    <div className="mt-3">
                                        <textarea
                                            placeholder="Describe the fault..."
                                            value={item.description}
                                            onChange={(e) => handleDescriptionChange(item.id, e.target.value)}
                                            className="block w-full px-3 py-2 bg-red-50 border border-red-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm disabled:bg-red-50/50 disabled:cursor-not-allowed"
                                            rows={2}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </fieldset>
                
                <div className="mt-8 text-right">
                    {submittedInfo ? (
                        <div className="flex flex-col items-end">
                             <div className="w-full p-3 bg-green-50 border border-green-200 rounded-md text-sm text-green-800 text-center">
                                <p>Submitted by <strong>{submittedInfo.name}</strong> at {submittedInfo.time}.</p>
                            </div>
                            <button type="button" onClick={handleReset} className="mt-4 px-6 py-3 bg-brand-blue hover:bg-brand-blue-light text-white font-bold rounded-lg shadow-md transition-colors">
                                Submit New Check
                            </button>
                        </div>
                    ) : (
                        <button
                            type="submit"
                            className="px-6 py-3 bg-brand-blue hover:bg-brand-blue-light text-white font-bold rounded-lg shadow-md transition-colors"
                        >
                            Submit Daily Check
                        </button>
                    )}
                </div>
            </form>
        </Card>
    );
};

export default DailyVehicleChecks;
