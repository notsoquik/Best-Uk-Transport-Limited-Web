import React from 'react';
import { Shift } from '../../types';

interface ViewShiftDetailsProps {
    shift: Shift;
}

const DetailRow: React.FC<{ label: string; value: string | number | undefined }> = ({ label, value }) => (
    <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-md text-brand-dark">{value || 'N/A'}</p>
    </div>
);

const ViewShiftDetails: React.FC<ViewShiftDetailsProps> = ({ shift }) => {
    return (
        <div className="space-y-6">
            <div className="p-4 bg-gray-50 rounded-lg border">
                <h3 className="text-lg font-semibold text-brand-dark mb-4">Shift Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <DetailRow label="Driver" value={shift.driverName} />
                    <DetailRow label="Truck" value={shift.truckRegistration} />
                    <DetailRow label="Date" value={new Date(shift.startTime).toLocaleDateString()} />
                    <DetailRow label="Start Mileage" value={shift.startMileage} />
                    <DetailRow label="End Mileage" value={shift.endMileage} />
                     <DetailRow label="Total Mileage" value={shift.endMileage && shift.startMileage ? shift.endMileage - shift.startMileage : 'N/A'} />
                </div>
            </div>
            
            <div>
                <h3 className="text-lg font-semibold text-brand-dark mb-2">Load Details</h3>
                <div className="p-3 border rounded-md bg-white">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <DetailRow label="Load Ticket #" value={shift.loadTicketNumber} />
                        <DetailRow label="Commodity" value={shift.commodity} />
                        <DetailRow label="Collection Point" value={shift.collectionPoint} />
                        <DetailRow label="Delivery Point" value={shift.deliveryPoint} />
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold text-brand-dark mb-2">Notes</h3>
                <p className="text-sm text-gray-700 p-3 border rounded-md bg-gray-50 italic">
                    {shift.notes || 'No extra notes provided.'}
                </p>
            </div>
        </div>
    );
};

export default ViewShiftDetails;
