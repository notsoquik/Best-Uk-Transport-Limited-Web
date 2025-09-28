import React, { useState, useMemo } from 'react';
import { MOCK_VEHICLE_CHECKS, MOCK_SHIFTS } from '../../constants';
import { DailyVehicleCheck, Shift, User } from '../../types';
import Card from '../../components/Card';
import Modal from '../../components/Modal';
import ViewCheckDetails from '../manager/ViewCheckDetails';
import ViewShiftDetails from '../manager/ViewShiftDetails';

interface SubmissionsHistoryProps {
    user: User;
}

const SubmissionsHistory: React.FC<SubmissionsHistoryProps> = ({ user }) => {
    const [view, setView] = useState<'checks' | 'shifts'>('checks');
    
    const driverChecks = useMemo(() => MOCK_VEHICLE_CHECKS.filter(c => c.driverId === user.id), [user.id]);
    const driverShifts = useMemo(() => MOCK_SHIFTS.filter(s => s.driverId === user.id), [user.id]);

    const [selectedCheck, setSelectedCheck] = useState<DailyVehicleCheck | null>(null);
    const [selectedShift, setSelectedShift] = useState<Shift | null>(null);

    const handleViewCheck = (check: DailyVehicleCheck) => {
        setSelectedCheck(check);
    };

    const handleViewShift = (shift: Shift) => {
        setSelectedShift(shift);
    };

    const closeModal = () => {
        setSelectedCheck(null);
        setSelectedShift(null);
    };

    return (
        <>
            <Card title="My Submission History">
                <div className="flex border-b mb-4">
                    <button
                        onClick={() => setView('checks')}
                        className={`px-4 py-2 text-sm font-medium ${view === 'checks' ? 'border-b-2 border-brand-blue text-brand-blue' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Daily Checks History
                    </button>
                    <button
                        onClick={() => setView('shifts')}
                        className={`px-4 py-2 text-sm font-medium ${view === 'shifts' ? 'border-b-2 border-brand-blue text-brand-blue' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Shift History
                    </button>
                </div>
                
                {view === 'checks' && (
                     <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Truck</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {driverChecks.length > 0 ? driverChecks.map(check => {
                                    const hasFaults = check.checklist.some(item => item.isFaulty);
                                    return (
                                        <tr key={check.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">{new Date(check.date).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{check.truckRegistration}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {hasFaults ? (
                                                     <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Faults Reported</span>
                                                ) : (
                                                     <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">OK</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <button onClick={() => handleViewCheck(check)} className="text-brand-blue-light hover:text-brand-blue text-sm font-medium">
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                }) : (
                                    <tr><td colSpan={4} className="text-center py-4 text-gray-500">No vehicle checks found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {view === 'shifts' && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                             <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Truck</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mileage</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                             <tbody className="bg-white divide-y divide-gray-200">
                                {driverShifts.length > 0 ? driverShifts.map(shift => (
                                    <tr key={shift.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">{new Date(shift.startTime).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">{shift.truckRegistration}</td>
                                        <td className="px-6 py-4">{shift.endMileage && shift.startMileage ? shift.endMileage - shift.startMileage : 'N/A'} miles</td>
                                        <td className="px-6 py-4 text-right">
                                            <button onClick={() => handleViewShift(shift)} className="text-brand-blue-light hover:text-brand-blue text-sm font-medium">
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan={4} className="text-center py-4 text-gray-500">No shifts found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>

            {selectedCheck && (
                <Modal isOpen={!!selectedCheck} onClose={closeModal} title={`Daily Check Details: ${selectedCheck.truckRegistration}`}>
                    <ViewCheckDetails check={selectedCheck} />
                </Modal>
            )}

            {selectedShift && (
                 <Modal isOpen={!!selectedShift} onClose={closeModal} title={`Shift Details: ${selectedShift.driverName}`}>
                    <ViewShiftDetails shift={selectedShift} />
                </Modal>
            )}
        </>
    );
};

export default SubmissionsHistory;