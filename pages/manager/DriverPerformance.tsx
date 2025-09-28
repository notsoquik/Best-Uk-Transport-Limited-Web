
import React, { useState } from 'react';
import { MOCK_SHIFTS, MOCK_DRIVERS, MOCK_DRIVER_DETAILS } from '../../constants';
import { Shift, User, UserRole, DriverDetails } from '../../types';
import Card from '../../components/Card';
import Modal from '../../components/Modal';
import { PlusCircleIcon } from '../../components/icons';
import { v4 as uuidv4 } from 'uuid';

const initialDriverState: Omit<DriverDetails, 'customDetails'> = {
    fullName: '',
    email: '',
    contactNumber: '',
    nationalInsuranceNumber: '',
    address: '',
    drivingLicenceNumber: '',
    drivingLicenceExpiry: '',
    cpcNumber: '',
    cpcExpiry: '',
    digiCardNumber: '',
    digiCardExpiry: '',
    mpqcNumber: '',
    mpqcExpiry: '',
};

const FormField: React.FC<{ label: string; children: React.ReactNode; className?: string }> = ({ label, children, className }) => (
    <div className={className}>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <div className="mt-1">{children}</div>
    </div>
);

const DriverPerformance: React.FC = () => {
    const [shifts] = useState<Shift[]>(MOCK_SHIFTS);
    const [drivers, setDrivers] = useState<User[]>(MOCK_DRIVERS);
    const [driverDetails, setDriverDetails] = useState<Record<string, DriverDetails>>(MOCK_DRIVER_DETAILS);
    const [newDriver, setNewDriver] = useState(initialDriverState);
    const [hasMpqc, setHasMpqc] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const calculateMileage = (shift: Shift) => {
        if (shift.endMileage && shift.startMileage) {
            return shift.endMileage - shift.startMileage;
        }
        return 0;
    }
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewDriver(prev => ({ ...prev, [name]: value }));
    };
    
    const handleAddDriver = (e: React.FormEvent) => {
        e.preventDefault();
        const newDriverId = uuidv4();
        const newDriverUser: User = {
            id: newDriverId,
            name: newDriver.fullName,
            email: newDriver.email,
            role: UserRole.DRIVER,
        };
        
        const newDriverDetails: DriverDetails = {
            ...newDriver,
            mpqcNumber: hasMpqc ? newDriver.mpqcNumber : '',
            mpqcExpiry: hasMpqc ? newDriver.mpqcExpiry : '',
            customDetails: [],
        };
        
        setDrivers(prev => [...prev, newDriverUser]);
        setDriverDetails(prev => ({...prev, [newDriverId]: newDriverDetails}));

        alert(`Driver ${newDriver.fullName} added successfully.`);
        setNewDriver(initialDriverState);
        setHasMpqc(false);
        setIsAddModalOpen(false);
    };

    const addDriverForm = (
         <form onSubmit={handleAddDriver} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Personal Info */}
                <FormField label="Full Name">
                    <input type="text" name="fullName" value={newDriver.fullName} onChange={handleInputChange} required className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-light focus:border-brand-blue-light sm:text-sm" />
                </FormField>
                <FormField label="Email Address">
                    <input type="email" name="email" value={newDriver.email} onChange={handleInputChange} required className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-light focus:border-brand-blue-light sm:text-sm" />
                </FormField>
                <FormField label="Phone Number">
                    <input type="tel" name="contactNumber" value={newDriver.contactNumber} onChange={handleInputChange} required className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-light focus:border-brand-blue-light sm:text-sm" />
                </FormField>
                <FormField label="Address" className="md:col-span-2">
                     <input type="text" name="address" value={newDriver.address} onChange={handleInputChange} required className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-light focus:border-brand-blue-light sm:text-sm" />
                </FormField>
                 <FormField label="National Insurance Number">
                    <input type="text" name="nationalInsuranceNumber" value={newDriver.nationalInsuranceNumber} onChange={handleInputChange} required className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-light focus:border-brand-blue-light sm:text-sm" />
                </FormField>
            </div>

            <div className="border-t border-gray-200 pt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Licence & Cards */}
                <FormField label="Driving Licence Number">
                     <input type="text" name="drivingLicenceNumber" value={newDriver.drivingLicenceNumber} onChange={handleInputChange} required className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-light focus:border-brand-blue-light sm:text-sm" />
                </FormField>
                <FormField label="Licence Expiry Date">
                     <input type="date" name="drivingLicenceExpiry" value={newDriver.drivingLicenceExpiry} onChange={handleInputChange} required className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-light focus:border-brand-blue-light sm:text-sm" />
                </FormField>
                <div /> {/* Spacer */}

                <FormField label="CPC Number">
                     <input type="text" name="cpcNumber" value={newDriver.cpcNumber} onChange={handleInputChange} required className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-light focus:border-brand-blue-light sm:text-sm" />
                </FormField>
                <FormField label="CPC Expiry Date">
                     <input type="date" name="cpcExpiry" value={newDriver.cpcExpiry} onChange={handleInputChange} required className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-light focus:border-brand-blue-light sm:text-sm" />
                </FormField>
                <div /> {/* Spacer */}

                 <FormField label="Digi Card Number">
                     <input type="text" name="digiCardNumber" value={newDriver.digiCardNumber} onChange={handleInputChange} required className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-light focus:border-brand-blue-light sm:text-sm" />
                </FormField>
                <FormField label="Digi Card Expiry Date">
                     <input type="date" name="digiCardExpiry" value={newDriver.digiCardExpiry} onChange={handleInputChange} required className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-light focus:border-brand-blue-light sm:text-sm" />
                </FormField>
                <div /> {/* Spacer */}

                <div className="flex items-center pt-5">
                    <input id="hasMpqc" name="hasMpqc" type="checkbox" checked={hasMpqc} onChange={(e) => setHasMpqc(e.target.checked)} className="h-4 w-4 text-brand-blue-light focus:ring-brand-blue-light border-gray-300 rounded" />
                    <label htmlFor="hasMpqc" className="ml-2 block text-sm font-medium text-gray-900">Has MPQC Card?</label>
                </div>
                {hasMpqc && (
                    <>
                        <FormField label="MPQC Number">
                            <input type="text" name="mpqcNumber" value={newDriver.mpqcNumber} onChange={handleInputChange} required={hasMpqc} className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-light focus:border-brand-blue-light sm:text-sm" />
                        </FormField>
                        <FormField label="MPQC Expiry Date">
                            <input type="date" name="mpqcExpiry" value={newDriver.mpqcExpiry} onChange={handleInputChange} required={hasMpqc} className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue-light focus:border-brand-blue-light sm:text-sm" />
                        </FormField>
                    </>
                )}
            </div>
             <div className="pt-5 flex justify-end space-x-3">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue-light">
                    Cancel
                </button>
                <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand-blue hover:bg-brand-blue-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue-light">
                    Add Driver
                </button>
            </div>
        </form>
    );

    return (
        <>
            <Card title="Driver Management" action={
                <button onClick={() => setIsAddModalOpen(true)} className="flex items-center px-4 py-2 bg-brand-blue hover:bg-brand-blue-light text-white rounded-md text-sm font-medium transition-colors">
                    <PlusCircleIcon className="h-5 w-5 mr-2" />
                    Add New Driver
                </button>
            }>
                <div className="mb-8">
                    <h3 className="text-xl font-semibold leading-6 text-brand-dark mb-4">Registered Drivers</h3>
                     <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Number</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Licence Expiry</th>
                                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {drivers.map((driver) => {
                                    const details = driverDetails[driver.id];
                                    return (
                                        <tr key={driver.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-brand-dark">{driver.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{driver.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{details?.contactNumber || 'N/A'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{details?.drivingLicenceExpiry ? new Date(details.drivingLicenceExpiry).toLocaleDateString() : 'N/A'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <a href="#" className="text-brand-blue-light hover:text-brand-blue">View Details</a>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>


                <div className="pt-8 border-t border-gray-200">
                    <h3 className="text-xl font-semibold leading-6 text-brand-dark mb-4">Driver Performance</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Driver</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shift Date</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Truck</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mileage</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commodity</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {shifts.map((shift) => (
                                    <tr key={shift.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-brand-dark">{shift.driverName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(shift.startTime).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{shift.truckRegistration}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{calculateMileage(shift)} miles</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{shift.commodity}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Card>

            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Driver">
               {addDriverForm}
            </Modal>
        </>
    );
};

export default DriverPerformance;
