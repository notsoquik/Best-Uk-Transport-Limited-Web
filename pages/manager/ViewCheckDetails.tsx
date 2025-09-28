import React from 'react';
import { DailyVehicleCheck } from '../../types';

const DetailRow: React.FC<{ label: string; value: string | number | undefined }> = ({ label, value }) => (
    <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-md text-brand-dark">{value || 'N/A'}</p>
    </div>
);

const ViewCheckDetails: React.FC<{ check: DailyVehicleCheck }> = ({ check }) => {
    return (
        <div className="space-y-6">
            <div className="p-4 bg-gray-50 rounded-lg border">
                <h3 className="text-lg font-semibold text-brand-dark mb-4">Check Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <DetailRow label="Driver" value={check.driverName} />
                    <DetailRow label="Truck" value={check.truckRegistration} />
                    <DetailRow label="Date" value={new Date(check.date).toLocaleDateString()} />
                    <DetailRow label="Start Mileage" value={check.startMileage} />
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-brand-dark mb-2">Checklist Items</h3>
                <div className="space-y-2">
                    {check.checklist.map(item => (
                        <div key={item.id} className={`p-3 border rounded-md ${item.isFaulty ? 'border-red-200 bg-red-50' : 'bg-white'}`}>
                            <div className="flex justify-between items-center">
                                <p className="font-medium text-brand-dark">{item.name}</p>
                                {item.isFaulty ? (
                                    <span className="px-2 py-1 text-xs font-bold text-red-800 bg-red-200 rounded-full">Faulty</span>
                                ) : (
                                    <span className="px-2 py-1 text-xs font-bold text-green-800 bg-green-200 rounded-full">OK</span>
                                )}
                            </div>
                            {item.isFaulty && (
                                <p className="mt-2 text-sm text-red-700 italic">
                                    <strong>Description:</strong> "{item.description}"
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ViewCheckDetails;
