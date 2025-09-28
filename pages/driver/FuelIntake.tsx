
import React, { useState } from 'react';
import { User, FuelIntake as FuelIntakeType } from '../../types';
import { MOCK_TRUCKS } from '../../constants';
import Card from '../../components/Card';
import { v4 as uuidv4 } from 'uuid';

interface FuelIntakeProps {
    user: User;
}

const initialFuelState = {
    truckRegistration: MOCK_TRUCKS[0].registration,
    mileage: '',
    diesel: { amount: '', price: '' },
    adBlue: { amount: '', price: '' },
    other: { description: '', price: '' },
};

const FuelIntake: React.FC<FuelIntakeProps> = ({ user }) => {
    const [formData, setFormData] = useState(initialFuelState);
    const [submittedInfo, setSubmittedInfo] = useState<{ name: string; time: string } | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleNestedInputChange = (category: 'diesel' | 'adBlue' | 'other', field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [field]: value
            }
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newFuelIntake: FuelIntakeType = {
            id: uuidv4(),
            driverId: user.id,
            driverName: user.name,
            truckRegistration: formData.truckRegistration,
            date: new Date().toISOString(),
            mileage: parseFloat(formData.mileage || '0'),
            diesel: {
                amount: parseFloat(formData.diesel.amount || '0'),
                price: parseFloat(formData.diesel.price || '0'),
            },
            adBlue: {
                amount: parseFloat(formData.adBlue.amount || '0'),
                price: parseFloat(formData.adBlue.price || '0'),
            },
            other: {
                description: formData.other.description,
                price: parseFloat(formData.other.price || '0'),
            }
        };

        console.log("Submitting Fuel Intake:", newFuelIntake);
        alert("Fuel intake submitted successfully!");
        setSubmittedInfo({ name: user.name, time: new Date().toLocaleString() });
    };

    const handleReset = () => {
        setFormData(initialFuelState);
        setSubmittedInfo(null);
    };


    return (
        <Card title="Log Fuel Intake">
            <form onSubmit={handleSubmit} className="space-y-6">
                <fieldset disabled={!!submittedInfo}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label htmlFor="truckRegistration" className="block text-sm font-medium text-gray-700">Truck Registration</label>
                            <select
                                id="truckRegistration"
                                name="truckRegistration"
                                value={formData.truckRegistration}
                                onChange={handleInputChange}
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-light focus:border-brand-blue-light sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                            >
                                {MOCK_TRUCKS.map(truck => (
                                    <option key={truck.id} value={truck.registration}>{truck.registration}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                            <input
                                type="date"
                                id="date"
                                name="date"
                                readOnly
                                value={new Date().toISOString().split('T')[0]}
                                className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm sm:text-sm disabled:cursor-not-allowed"
                            />
                        </div>
                        <div>
                            <label htmlFor="mileage" className="block text-sm font-medium text-gray-700">Mileage</label>
                            <input
                                type="number"
                                id="mileage"
                                name="mileage"
                                value={formData.mileage}
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-light focus:border-brand-blue-light sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t">
                        <div className="p-4 border rounded-lg">
                            <h4 className="font-semibold text-brand-dark mb-2">Diesel</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <input type="number" placeholder="Litres Added" value={formData.diesel.amount} onChange={(e) => handleNestedInputChange('diesel', 'amount', e.target.value)} className="w-full px-2 py-1 border rounded-md disabled:bg-gray-100 disabled:cursor-not-allowed"/>
                                <input type="number" placeholder="Total Price (£)" value={formData.diesel.price} onChange={(e) => handleNestedInputChange('diesel', 'price', e.target.value)} className="w-full px-2 py-1 border rounded-md disabled:bg-gray-100 disabled:cursor-not-allowed"/>
                            </div>
                        </div>

                         <div className="p-4 border rounded-lg">
                            <h4 className="font-semibold text-brand-dark mb-2">AdBlue</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <input type="number" placeholder="Litres Added" value={formData.adBlue.amount} onChange={(e) => handleNestedInputChange('adBlue', 'amount', e.target.value)} className="w-full px-2 py-1 border rounded-md disabled:bg-gray-100 disabled:cursor-not-allowed"/>
                                <input type="number" placeholder="Total Price (£)" value={formData.adBlue.price} onChange={(e) => handleNestedInputChange('adBlue', 'price', e.target.value)} className="w-full px-2 py-1 border rounded-md disabled:bg-gray-100 disabled:cursor-not-allowed"/>
                            </div>
                        </div>

                         <div className="p-4 border rounded-lg">
                            <h4 className="font-semibold text-brand-dark mb-2">Any Other Items</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" placeholder="Item Description (e.g., Screenwash)" value={formData.other.description} onChange={(e) => handleNestedInputChange('other', 'description', e.target.value)} className="w-full px-2 py-1 border rounded-md disabled:bg-gray-100 disabled:cursor-not-allowed"/>
                                <input type="number" placeholder="Total Price (£)" value={formData.other.price} onChange={(e) => handleNestedInputChange('other', 'price', e.target.value)} className="w-full px-2 py-1 border rounded-md disabled:bg-gray-100 disabled:cursor-not-allowed"/>
                            </div>
                        </div>
                    </div>
                </fieldset>


                <div className="mt-6 text-right">
                   {submittedInfo ? (
                        <div className="flex flex-col items-end">
                            <div className="w-full p-3 bg-green-50 border border-green-200 rounded-md text-sm text-green-800 text-center">
                                <p>Submitted by <strong>{submittedInfo.name}</strong> at {submittedInfo.time}.</p>
                            </div>
                            <button type="button" onClick={handleReset} className="mt-4 px-6 py-2 bg-brand-blue hover:bg-brand-blue-light text-white font-bold rounded-lg shadow-md transition-colors">
                                Log Another Intake
                            </button>
                        </div>
                    ) : (
                        <button type="submit" className="px-6 py-2 bg-brand-blue hover:bg-brand-blue-light text-white font-bold rounded-lg shadow-md transition-colors">
                            Submit Fuel Intake
                        </button>
                    )}
                </div>
            </form>
        </Card>
    );
};

export default FuelIntake;
