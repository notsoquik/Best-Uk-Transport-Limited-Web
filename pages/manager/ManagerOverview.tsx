import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MOCK_SHIFTS, MOCK_TRUCKS, MOCK_VEHICLE_CHECKS } from '../../constants';
import Card from '../../components/Card';
import { DailyVehicleCheck, Shift } from '../../types';
import Modal from '../../components/Modal';
import ViewCheckDetails from './ViewCheckDetails';
import ViewShiftDetails from './ViewShiftDetails';


const ManagerOverview: React.FC = () => {
    // State from former ReviewSubmissions component
    const [view, setView] = useState<'checks' | 'shifts'>('checks');
    const [checks] = useState<DailyVehicleCheck[]>(MOCK_VEHICLE_CHECKS);
    const [shifts] = useState<Shift[]>(MOCK_SHIFTS);
    const [selectedCheck, setSelectedCheck] = useState<DailyVehicleCheck | null>(null);
    const [selectedShift, setSelectedShift] = useState<Shift | null>(null);

    const truckStatusData = MOCK_TRUCKS.reduce((acc, truck) => {
        const status = truck.status;
        const existing = acc.find(item => item.name === status);
        if (existing) {
            existing.value += 1;
        } else {
            acc.push({ name: status, value: 1 });
        }
        return acc;
    }, [] as { name: string; value: number }[]);
    
    // Handlers from former ReviewSubmissions component
    const checksWithFaults = checks.filter(c => c.checklist.some(item => item.isFaulty));
    const handleViewCheck = (check: DailyVehicleCheck) => setSelectedCheck(check);
    const handleViewShift = (shift: Shift) => setSelectedShift(shift);
    const closeModal = () => {
        setSelectedCheck(null);
        setSelectedShift(null);
    };

    // New Fleet Readiness Logic
    const today = new Date().toISOString().split('T')[0];
    const activeTrucks = MOCK_TRUCKS.filter(truck => truck.status === 'Active');
    const activeTruckRegs = activeTrucks.map(t => t.registration);

    // Daily Checks Status
    const trucksWithChecksToday = new Set(
        MOCK_VEHICLE_CHECKS
            .filter(check => check.date === today)
            .map(check => check.truckRegistration)
    );
    const checksSubmittedCount = activeTruckRegs.filter(reg => trucksWithChecksToday.has(reg)).length;
    const allChecksSubmitted = checksSubmittedCount === activeTrucks.length;

    // Shift Submission Status
    const trucksWithShiftsToday = new Set(
        MOCK_SHIFTS
            .filter(shift => shift.startTime.startsWith(today))
            .map(shift => shift.truckRegistration)
    );
    const shiftsSubmittedCount = activeTruckRegs.filter(reg => trucksWithShiftsToday.has(reg)).length;
    const allShiftsSubmitted = shiftsSubmittedCount === activeTrucks.length;


    return (
        <>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Key Metrics */}
            <Card className="lg:col-span-2">
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                        <h4 className="text-sm font-medium text-gray-500">Total Trucks</h4>
                        <p className="text-3xl font-bold text-brand-blue">{MOCK_TRUCKS.length}</p>
                    </div>
                     <div>
                        <h4 className="text-sm font-medium text-gray-500">Active Shifts</h4>
                        <p className="text-3xl font-bold text-brand-blue">{MOCK_SHIFTS.filter(s => !s.endTime).length}</p>
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-gray-500">Trucks in Repair</h4>
                        <p className="text-3xl font-bold text-red-500">{MOCK_TRUCKS.filter(t => t.status === 'In Repair').length}</p>
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-gray-500">Jobs Today</h4>
                        <p className="text-3xl font-bold text-brand-blue">{MOCK_SHIFTS.length}</p>
                    </div>
                 </div>
            </Card>

            {/* Truck Status Chart */}
            <Card title="Fleet Status" className="lg:col-span-2">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg border">
                    {/* Daily Check Status */}
                    <div className="flex items-center">
                        <div className={`w-4 h-4 rounded-full mr-3 ${allChecksSubmitted ? 'bg-green-500' : 'bg-yellow-500'}`} title={allChecksSubmitted ? 'All checks submitted' : 'Checks pending'}></div>
                        <div>
                            <p className="font-semibold text-brand-dark">Daily Checks Submitted</p>
                            <p className="text-sm text-gray-600">
                                {checksSubmittedCount} of {activeTrucks.length} active trucks
                            </p>
                        </div>
                    </div>
                    {/* Shift Submission Status */}
                    <div className="flex items-center">
                         <div className={`w-4 h-4 rounded-full mr-3 ${allShiftsSubmitted ? 'bg-green-500' : 'bg-yellow-500'}`} title={allShiftsSubmitted ? 'All shifts started' : 'Shifts pending'}></div>
                        <div>
                            <p className="font-semibold text-brand-dark">Shifts Started Today</p>
                            <p className="text-sm text-gray-600">
                                {shiftsSubmittedCount} of {activeTrucks.length} active trucks
                            </p>
                        </div>
                    </div>
                </div>
                 <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                        data={truckStatusData}
                         margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#1e3a8a" />
                    </BarChart>
                </ResponsiveContainer>
            </Card>
        </div>

        {/* Submissions Section */}
        <div className="mt-6">
            <Card>
                <div className="flex border-b mb-4">
                    <button
                        onClick={() => setView('checks')}
                        className={`px-4 py-2 text-sm font-medium ${view === 'checks' ? 'border-b-2 border-brand-blue text-brand-blue' : 'text-gray-500'}`}
                    >
                        Daily Checks ({checksWithFaults.length} with faults)
                    </button>
                    <button
                        onClick={() => setView('shifts')}
                        className={`px-4 py-2 text-sm font-medium ${view === 'shifts' ? 'border-b-2 border-brand-blue text-brand-blue' : 'text-gray-500'}`}
                    >
                        Shift Logs
                    </button>
                </div>
                
                {view === 'checks' && (
                     <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Driver</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Truck</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {checks.map(check => {
                                    const hasFaults = check.checklist.some(item => item.isFaulty);
                                    return (
                                        <tr key={check.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">{check.driverName}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{check.truckRegistration}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">{new Date(check.date).toLocaleDateString()}</td>
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
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {view === 'shifts' && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Truck</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mileage</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {shifts.map(shift => (
                                    <tr key={shift.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">{shift.driverName}</td>
                                        <td className="px-6 py-4">{new Date(shift.startTime).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">{shift.truckRegistration}</td>
                                        <td className="px-6 py-4">{shift.endMileage && shift.startMileage ? shift.endMileage - shift.startMileage : 'N/A'}</td>
                                        <td className="px-6 py-4 text-right">
                                            <button onClick={() => handleViewShift(shift)} className="text-brand-blue-light hover:text-brand-blue text-sm font-medium">
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Card>
        </div>


        {/* Modals */}
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

export default ManagerOverview;