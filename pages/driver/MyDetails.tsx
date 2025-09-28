
import React, { useState } from 'react';
import { MOCK_DRIVER_DETAILS } from '../../constants';
import { DriverDetails } from '../../types';
import Card from '../../components/Card';
import { PlusCircleIcon, XCircleIcon } from '../../components/icons';
import { v4 as uuidv4 } from 'uuid';

interface MyDetailsProps {
    userId: string;
}

const MyDetails: React.FC<MyDetailsProps> = ({ userId }) => {
    const [details, setDetails] = useState<DriverDetails>(MOCK_DRIVER_DETAILS[userId]);
    const [isEditing, setIsEditing] = useState(false);
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDetails(prev => ({ ...prev, [name]: value }));
    };
    
    const handleCustomDetailChange = (id: string, field: 'label' | 'value', value: string) => {
        setDetails(prev => ({
            ...prev,
            customDetails: prev.customDetails.map(cd =>
                cd.id === id ? { ...cd, [field]: value } : cd
            ),
        }));
    };

    const addCustomDetail = () => {
        setDetails(prev => ({
            ...prev,
            customDetails: [...prev.customDetails, { id: uuidv4(), label: '', value: '' }],
        }));
    };

    const removeCustomDetail = (id: string) => {
        setDetails(prev => ({
            ...prev,
            customDetails: prev.customDetails.filter(cd => cd.id !== id),
        }));
    };

    const handleSave = () => {
        // Here you would typically make an API call to save the data
        console.log('Saving details:', details);
        setIsEditing(false);
    };

    const DetailItem: React.FC<{ label: string; value: string; name?: string; isEditing: boolean; onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ label, value, name, isEditing, onChange }) => (
        <div>
            <label className="block text-sm font-medium text-gray-500">{label}</label>
            {isEditing ? (
                <input
                    type="text"
                    name={name}
                    value={value}
                    onChange={onChange}
                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-light focus:border-brand-blue-light sm:text-sm"
                />
            ) : (
                <p className="mt-1 text-md text-brand-dark">{value}</p>
            )}
        </div>
    );

    return (
        <Card title="My Details" action={
            !isEditing ? (
                <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-brand-blue hover:bg-brand-blue-light text-white rounded-md text-sm font-medium transition-colors">Edit</button>
            ) : (
                <div className="space-x-2">
                    <button onClick={() => { setIsEditing(false); setDetails(MOCK_DRIVER_DETAILS[userId]); }} className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-md text-sm font-medium transition-colors">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 bg-brand-green hover:bg-green-600 text-white rounded-md text-sm font-medium transition-colors">Save</button>
                </div>
            )
        }>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DetailItem label="Full Name" name="fullName" value={details.fullName} isEditing={isEditing} onChange={handleInputChange} />
                <DetailItem label="Address" name="address" value={details.address} isEditing={isEditing} onChange={handleInputChange} />
                <DetailItem label="National Insurance Number" name="nationalInsuranceNumber" value={details.nationalInsuranceNumber} isEditing={isEditing} onChange={handleInputChange} />
                <DetailItem label="Driving Licence Number" name="drivingLicenceNumber" value={details.drivingLicenceNumber} isEditing={isEditing} onChange={handleInputChange} />
                <DetailItem label="MPQC Number" name="mpqcNumber" value={details.mpqcNumber} isEditing={isEditing} onChange={handleInputChange} />
                <DetailItem label="Contact Number" name="contactNumber" value={details.contactNumber} isEditing={isEditing} onChange={handleInputChange} />
                <DetailItem label="Email Address" name="email" value={details.email} isEditing={isEditing} onChange={handleInputChange} />
            </div>
            
            <div className="mt-8 border-t pt-6">
                <h4 className="text-md font-semibold text-brand-dark mb-4">Custom Details</h4>
                <div className="space-y-4">
                    {details.customDetails.map((detail, index) => (
                        <div key={detail.id} className="grid grid-cols-1 md:grid-cols-8 gap-4 items-center">
                           <div className="md:col-span-3">
                                {isEditing ? (
                                    <input type="text" placeholder="Label" value={detail.label} onChange={(e) => handleCustomDetailChange(detail.id, 'label', e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-light focus:border-brand-blue-light sm:text-sm" />
                                ) : (
                                    <p className="font-medium text-gray-500">{detail.label}</p>
                                )}
                            </div>
                           <div className="md:col-span-4">
                                {isEditing ? (
                                    <input type="text" placeholder="Value" value={detail.value} onChange={(e) => handleCustomDetailChange(detail.id, 'value', e.target.value)} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-light focus:border-brand-blue-light sm:text-sm" />
                                ) : (
                                    <p className="text-md text-brand-dark">{detail.value}</p>
                                )}
                            </div>
                            {isEditing && (
                                <div className="md:col-span-1">
                                    <button onClick={() => removeCustomDetail(detail.id)} className="text-red-500 hover:text-red-700">
                                        <XCircleIcon className="h-6 w-6" />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                 {isEditing && (
                    <button onClick={addCustomDetail} className="mt-4 flex items-center text-sm font-medium text-brand-blue-light hover:text-brand-blue">
                        <PlusCircleIcon className="h-5 w-5 mr-2" />
                        Add Custom Detail
                    </button>
                )}
            </div>
        </Card>
    );
};

export default MyDetails;
