
import React, { useState } from 'react';
import { User, Shift } from '../../types';
import { MOCK_TRUCKS } from '../../constants';
import Card from '../../components/Card';
import { v4 as uuidv4 } from 'uuid';

interface ShiftManagementProps {
    user: User;
}

const initialShiftState: Partial<Shift> = {
    truckRegistration: MOCK_TRUCKS[0].registration,
    startMileage: 0,
    endMileage: 0,
    loadTicketNumber: '',
    commodity: '',
    collectionPoint: '',
    deliveryPoint: '',
    notes: '',
};

const ShiftManagement: React.FC<ShiftManagementProps> = ({ user }) => {
    const [shiftData, setShiftData] = useState<Partial<Shift>>(initialShiftState);
    const [submittedInfo, setSubmittedInfo] = useState<{ name: string; time: string } | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setShiftData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setShiftData(prev => ({ ...prev, [name]: value === '' ? '' : parseFloat(value) }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const fullShift: Shift = {
            id: uuidv4(),
            driverId: user.id,
            driverName: user.name,
            startTime: new Date().toISOString(),
            endTime: new Date().toISOString(),
            ...shiftData
        } as Shift;

        console.log("Submitting Shift:", fullShift);
        alert("Shift submitted successfully!");
        setSubmittedInfo({ name: user.name, time: new Date().toLocaleString() });
    };

    const handleReset = () => {
        setShiftData(initialShiftState);
        setSubmittedInfo(null);
    };

    return (
        <Card title="Submit a Job/Shift">
            <form onSubmit={handleSubmit} className="space-y-6">
                <fieldset disabled={!!submittedInfo}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 bg-gray-50 rounded-lg border">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Driver Name</label>
                            <p className="mt-1 text-md text-brand-dark font-semibold">{user.name}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Date</label>
                            <p className="mt-1 text-md text-brand-dark font-semibold">{new Date().toLocaleDateString()}</p>
                        </div>
                         <div>
                            <label htmlFor="truckRegistration" className="block text-sm font-medium text-gray-700">Truck Registration</label>
                            <select
                                id="truckRegistration"
                                name="truckRegistration"
                                value={shiftData.truckRegistration}
                                onChange={handleInputChange}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-light focus:border-brand-blue-light sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                            >
                                {MOCK_TRUCKS.map(truck => (
                                    <option key={truck.id} value={truck.registration}>{truck.registration}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div>
                            <label htmlFor="startMileage" className="block text-sm font-medium text-gray-700">Start Mileage</label>
                            <input
                                type="number"
                                id="startMileage"
                                name="startMileage"
                                value={shiftData.startMileage}
                                onChange={handleNumberInputChange}
                                required
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-light focus:border-brand-blue-light sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                        </div>
                         <div>
                            <label htmlFor="endMileage" className="block text-sm font-medium text-gray-700">End Mileage</label>
                            <input
                                type="number"
                                id="endMileage"
                                name="endMileage"
                                value={shiftData.endMileage}
                                onChange={handleNumberInputChange}
                                required
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-light focus:border-brand-blue-light sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                        </div>
                    </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6">
                         <div>
                            <label htmlFor="loadTicketNumber" className="block text-sm font-medium text-gray-700">Load Ticket Number</label>
                            <input
                                type="text"
                                id="loadTicketNumber"
                                name="loadTicketNumber"
                                value={shiftData.loadTicketNumber}
                                onChange={handleInputChange}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-light focus:border-brand-blue-light sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <label htmlFor="commodity" className="block text-sm font-medium text-gray-700">Commodity</label>
                            <input
                                type="text"
                                id="commodity"
                                name="commodity"
                                value={shiftData.commodity}
                                onChange={handleInputChange}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-light focus:border-brand-blue-light sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <label htmlFor="collectionPoint" className="block text-sm font-medium text-gray-700">Collection From</label>
                            <input
                                type="text"
                                id="collectionPoint"
                                name="collectionPoint"
                                value={shiftData.collectionPoint}
                                onChange={handleInputChange}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-light focus:border-brand-blue-light sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <label htmlFor="deliveryPoint" className="block text-sm font-medium text-gray-700">Delivery To</label>
                            <input
                                type="text"
                                id="deliveryPoint"
                                name="deliveryPoint"
                                value={shiftData.deliveryPoint}
                                onChange={handleInputChange}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-light focus:border-brand-blue-light sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                        </div>
                     </div>

                    <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Extra Notes</label>
                        <textarea
                            id="notes"
                            name="notes"
                            rows={3}
                            value={shiftData.notes}
                            onChange={handleInputChange}
                            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-light focus:border-brand-blue-light sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                    </div>
                </fieldset>

                <div className="mt-6 text-right">
                    {submittedInfo ? (
                         <div className="flex flex-col items-end">
                            <div className="w-full p-3 bg-green-50 border border-green-200 rounded-md text-sm text-green-800 text-center">
                                <p>Submitted by <strong>{submittedInfo.name}</strong> at {submittedInfo.time}.</p>
                            </div>
                            <button type="button" onClick={handleReset} className="mt-4 px-6 py-2 bg-brand-blue hover:bg-brand-blue-light text-white font-bold rounded-lg shadow-md transition-colors">
                                Submit Another Shift
                            </button>
                        </div>
                    ) : (
                        <button type="submit" className="px-6 py-2 bg-brand-blue hover:bg-brand-blue-light text-white font-bold rounded-lg shadow-md transition-colors">
                            Submit
                        </button>
                    )}
                </div>
            </form>
        </Card>
    );
};

export default ShiftManagement;
