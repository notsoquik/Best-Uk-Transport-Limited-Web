

import React, { useState } from 'react';
import { MOCK_TRUCKS } from '../../constants';
import { Truck } from '../../types';
import Card from '../../components/Card';
import Modal from '../../components/Modal';
import { PlusCircleIcon } from '../../components/icons';
import { v4 as uuidv4 } from 'uuid';

const initialTruckState: Partial<Truck> = {
    registration: '',
    location: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    motDueDate: '',
    motReminder: true,
    tachoCalibrationDate: '',
    tachoReminder: true,
    pmiDate: '',
    pmiReminder: true,
    status: 'Active',
    serviceDueDate: '',
    brakeTestDue: false,
};

const FormField: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <div className="mt-1">{children}</div>
    </div>
);

const TruckManagement: React.FC = () => {
    const [trucks, setTrucks] = useState<Truck[]>(MOCK_TRUCKS);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTruck, setNewTruck] = useState<Partial<Truck>>(initialTruckState);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setNewTruck(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSaveTruck = (e: React.FormEvent) => {
        e.preventDefault();
        const truckToAdd: Truck = {
            id: uuidv4(),
            ...initialTruckState,
            ...newTruck,
            year: Number(newTruck.year),
        } as Truck;
        
        setTrucks(prev => [truckToAdd, ...prev].sort((a, b) => a.registration.localeCompare(b.registration)));
        setIsModalOpen(false);
        setNewTruck(initialTruckState);
    };
    
    const openAddModal = () => {
        setNewTruck(initialTruckState);
        setIsModalOpen(true);
    };

    return (
        <>
            <Card title="Fleet Management" action={
                <button onClick={openAddModal} className="flex items-center px-4 py-2 bg-brand-blue hover:bg-brand-blue-light text-white rounded-md text-sm font-medium transition-colors">
                    <PlusCircleIcon className="h-5 w-5 mr-2" />
                    Add New Truck
                </button>
            }>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Make/Model</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">MOT Due</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PMI Due</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {trucks.map((truck) => (
                                <tr key={truck.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-brand-dark">{truck.registration}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{truck.location}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{truck.make} {truck.model} ({truck.year})</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            truck.status === 'Active' ? 'bg-green-100 text-green-800' : 
                                            truck.status === 'In Repair' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {truck.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{truck.motDueDate}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{truck.pmiDate}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <a href="#" className="text-brand-blue-light hover:text-brand-blue">View/Edit</a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
            
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Vehicle">
                <form onSubmit={handleSaveTruck} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField label="Truck Registration">
                            <input type="text" name="registration" value={newTruck.registration} onChange={handleInputChange} required className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-light focus:border-brand-blue-light sm:text-sm" />
                        </FormField>
                        <FormField label="Truck Location">
                             <input type="text" name="location" value={newTruck.location} onChange={handleInputChange} required className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-light focus:border-brand-blue-light sm:text-sm" />
                        </FormField>
                         <FormField label="Make">
                             <input type="text" name="make" value={newTruck.make} onChange={handleInputChange} required className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-light focus:border-brand-blue-light sm:text-sm" />
                        </FormField>
                         <FormField label="Model">
                             <input type="text" name="model" value={newTruck.model} onChange={handleInputChange} required className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-light focus:border-brand-blue-light sm:text-sm" />
                        </FormField>
                        <FormField label="Year of Manufacture">
                            <input type="number" name="year" value={newTruck.year} onChange={handleInputChange} required className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-light focus:border-brand-blue-light sm:text-sm" />
                        </FormField>
                    </div>

                    <fieldset className="p-4 border rounded-md">
                        <legend className="text-sm font-medium text-gray-900 px-1">MOT</legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end mt-2">
                             <FormField label="MOT Date">
                                 <input type="date" name="motDueDate" value={newTruck.motDueDate} onChange={handleInputChange} required className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-light focus:border-brand-blue-light sm:text-sm" />
                            </FormField>
                            <div className="flex items-center pb-2">
                               <input id="motReminder" name="motReminder" type="checkbox" checked={newTruck.motReminder} onChange={handleInputChange} className="h-4 w-4 text-brand-blue-light focus:ring-brand-blue-light border-gray-300 rounded" />
                               <label htmlFor="motReminder" className="ml-2 block text-sm text-gray-900">Set yearly reminder</label>
                           </div>
                        </div>
                    </fieldset>

                     <fieldset className="p-4 border rounded-md">
                        <legend className="text-sm font-medium text-gray-900 px-1">Tacho</legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end mt-2">
                             <FormField label="Tacho Calibration Date">
                                 <input type="date" name="tachoCalibrationDate" value={newTruck.tachoCalibrationDate} onChange={handleInputChange} required className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-light focus:border-brand-blue-light sm:text-sm" />
                            </FormField>
                             <div className="flex items-center pb-2">
                               <input id="tachoReminder" name="tachoReminder" type="checkbox" checked={newTruck.tachoReminder} onChange={handleInputChange} className="h-4 w-4 text-brand-blue-light focus:ring-brand-blue-light border-gray-300 rounded" />
                               <label htmlFor="tachoReminder" className="ml-2 block text-sm text-gray-900">Set 2 years reminder</label>
                           </div>
                        </div>
                    </fieldset>

                    <fieldset className="p-4 border rounded-md">
                        <legend className="text-sm font-medium text-gray-900 px-1">PMI (Preventative Maintenance Inspection)</legend>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end mt-2">
                             <FormField label="PMI Date">
                                 <input type="date" name="pmiDate" value={newTruck.pmiDate} onChange={handleInputChange} required className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-light focus:border-brand-blue-light sm:text-sm" />
                            </FormField>
                             <div className="flex items-center pb-2">
                               <input id="pmiReminder" name="pmiReminder" type="checkbox" checked={newTruck.pmiReminder} onChange={handleInputChange} className="h-4 w-4 text-brand-blue-light focus:ring-brand-blue-light border-gray-300 rounded" />
                               <label htmlFor="pmiReminder" className="ml-2 block text-sm text-gray-900">Set 8 weeks reminder</label>
                           </div>
                        </div>
                    </fieldset>

                    <div className="pt-5 flex justify-end space-x-3">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue-light">
                            Cancel
                        </button>
                        <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand-blue hover:bg-brand-blue-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue-light">
                            Save Truck
                        </button>
                    </div>
                </form>
            </Modal>
        </>
    );
};

export default TruckManagement;