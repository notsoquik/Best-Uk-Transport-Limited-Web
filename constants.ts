import { DailyVehicleCheck, DriverDetails, MaintenanceLog, Shift, Truck, User, UserRole, VehicleCheckItem, FuelIntake, Notification, FinancialTransaction, TransactionType } from "./types";
import { v4 as uuidv4 } from 'uuid';

export const MOCK_DRIVERS: User[] = [
    { id: 'd1', name: 'John Doe', email: 'driver@test.com', role: UserRole.DRIVER },
    { id: 'd2', name: 'Jane Smith', email: 'driver2@test.com', role: UserRole.DRIVER },
];

export const MOCK_MANAGERS: User[] = [
    { id: 'm1', name: 'Admin Manager', email: 'manager@test.com', role: UserRole.MANAGER },
];

export const MOCK_DRIVER_DETAILS: Record<string, DriverDetails> = {
    'd1': {
        fullName: 'John Doe',
        address: '123 Fake Street, London, AB1 2CD',
        nationalInsuranceNumber: 'AB123456C',
        drivingLicenceNumber: 'DOE123456789JD',
        drivingLicenceExpiry: '2030-01-01',
        cpcNumber: 'CPC12345',
        cpcExpiry: '2025-12-31',
        digiCardNumber: 'DIGI98765',
        digiCardExpiry: '2028-05-20',
        mpqcNumber: 'MPQC98765',
        mpqcExpiry: '2026-06-15',
        contactNumber: '07123456789',
        email: 'driver@test.com',
        customDetails: [
            { id: uuidv4(), label: 'ADR Card Number', value: 'ADR12345' }
        ],
    },
     'd2': {
        fullName: 'Jane Smith',
        address: '456 Other Ave, Manchester, M1 2BC',
        nationalInsuranceNumber: 'CD789012E',
        drivingLicenceNumber: 'SMITH987654321JS',
        drivingLicenceExpiry: '2032-02-02',
        cpcNumber: 'CPC54321',
        cpcExpiry: '2027-11-10',
        digiCardNumber: 'DIGI12345',
        digiCardExpiry: '2029-08-01',
        mpqcNumber: '',
        mpqcExpiry: '',
        contactNumber: '07987654321',
        email: 'driver2@test.com',
        customDetails: [],
    }
};

export const MOCK_TRUCKS: Truck[] = [
    { id: 't1', registration: 'TRUCK1', make: 'Scania', model: 'R 450', year: 2020, location: 'London Depot', motDueDate: '2024-10-15', motReminder: true, tachoCalibrationDate: '2025-01-20', tachoReminder: true, pmiDate: '2024-07-25', pmiReminder: true, serviceDueDate: '2024-08-30', brakeTestDue: true, status: 'Active' },
    { id: 't2', registration: 'TRUCK2', make: 'Volvo', model: 'FH 500', year: 2021, location: 'Manchester Depot', motDueDate: '2025-02-10', motReminder: true, tachoCalibrationDate: '2025-03-15', tachoReminder: false, pmiDate: '2024-08-05', pmiReminder: true, serviceDueDate: '2024-09-15', brakeTestDue: false, status: 'Active' },
    { id: 't3', registration: 'TRUCK3', make: 'DAF', model: 'XF', year: 2019, location: 'London Depot', motDueDate: '2024-11-20', motReminder: false, tachoCalibrationDate: '2024-12-28', tachoReminder: true, pmiDate: '2024-07-10', pmiReminder: false, serviceDueDate: '2024-07-20', brakeTestDue: true, status: 'In Repair' },
];

export const DEFAULT_VEHICLE_CHECKS: Omit<VehicleCheckItem, 'isFaulty' | 'description'>[] = [
    { id: '1', name: 'Operating licence disk' },
    { id: '2', name: 'Windscreen' },
    { id: '3', name: 'Front Side Windows' },
    { id: '4', name: 'Mirrors' },
    { id: '5', name: 'Camera/Mirrors' },
    { id: '6', name: 'Windscreen Wipers' },
    { id: '7', name: 'Windscreen Washer/Liquid' },
    { id: '8', name: 'Warning Lights' },
    { id: '9', name: 'Steering Column' },
    { id: '10', name: 'Horn' },
    { id: '11', name: 'Tachograph and speed limiter' },
    { id: '12', name: 'Service Brake/Hand brake' },
    { id: '13', name: 'Vehicle Height Marker' },
    { id: '14', name: 'Wheels' },
    { id: '15', name: 'Wheel nuts and markers' },
    { id: '16', name: 'Tyres' },
    { id: '17', name: 'Air leaks' },
    { id: '18', name: 'Fuel Filler Cap' },
    { id: '19', name: 'AdBlue' },
    { id: '20', name: 'Oil & Fuel leaks' },
    { id: '21', name: 'Exhaust' },
    { id: '22', name: 'Smoke Emissions' },
    { id: '23', name: 'Spray Suppression Flaps' },
    { id: '24', name: 'Body Panels' },
    { id: '25', name: 'Stop Lamps' },
    { id: '26', name: 'Number Plate' },
    { id: '27', name: 'Reflectors' },
    { id: '28', name: 'Vehicle Markings' },
    { id: '29', name: 'Load Securing Systems' },
    { id: '30', name: 'Body condition' },
];


export const MOCK_SHIFTS: Shift[] = [
    {
        id: 's1', driverId: 'd1', driverName: 'John Doe', startTime: '2024-07-15T07:00:00Z', endTime: '2024-07-15T17:30:00Z', truckRegistration: 'TRUCK1', startMileage: 125000, endMileage: 125350,
        loadTicketNumber: 'TICKET-001',
        commodity: 'Sand',
        collectionPoint: 'Quarry A',
        deliveryPoint: 'Site B',
        revenue: 550,
        notes: 'Traffic was heavy on the M25.'
    },
    {
        id: 's2', driverId: 'd1', driverName: 'John Doe', startTime: '2024-07-14T07:05:00Z', endTime: '2024-07-14T17:00:00Z', truckRegistration: 'TRUCK2', startMileage: 89200, endMileage: 89520,
        loadTicketNumber: 'TICKET-002',
        commodity: 'Aggregates',
        collectionPoint: 'Depot C',
        deliveryPoint: 'Site D',
        revenue: 620,
        notes: 'Smooth day.'
    }
];

export const MOCK_VEHICLE_CHECKS: DailyVehicleCheck[] = [
    {
        id: 'c1', driverId: 'd1', driverName: 'John Doe', truckRegistration: 'TRUCK1', date: '2024-07-15', startMileage: 125000,
        checklist: DEFAULT_VEHICLE_CHECKS.map(c => ({ ...c, isFaulty: false, description: '' })).map(c => c.id === '16' ? { ...c, isFaulty: true, description: 'Front-left tyre showing some wear.' } : c)
    },
    {
        id: 'c2', driverId: 'd1', driverName: 'John Doe', truckRegistration: 'TRUCK2', date: '2024-07-14', startMileage: 89200,
        checklist: DEFAULT_VEHICLE_CHECKS.map(c => ({ ...c, isFaulty: false, description: '' }))
    }
];

export const MOCK_MAINTENANCE_LOGS: MaintenanceLog[] = [
    { id: 'm1', truckRegistration: 'TRUCK1', date: '2024-07-16', description: 'Replaced front-left tyre.', relatedCheckId: 'c1', type: 'Cost', amount: 350, client: 'QuickFit' }
];

export const MOCK_FUEL_INTAKES: FuelIntake[] = [
    {
        id: 'f1',
        driverId: 'd1',
        driverName: 'John Doe',
        truckRegistration: 'TRUCK1',
        date: '2024-07-15',
        mileage: 125350,
        diesel: { amount: 300, price: 420.00 },
        adBlue: { amount: 20, price: 25.00 },
        other: { description: 'Screenwash', price: 5.50 },
    },
    {
        id: 'f2',
        driverId: 'd2',
        driverName: 'Jane Smith',
        truckRegistration: 'TRUCK2',
        date: '2024-07-14',
        mileage: 89520,
        diesel: { amount: 350, price: 495.00 },
        adBlue: {},
        other: {},
    }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: uuidv4(),
        driverId: 'd1',
        driverName: 'John Doe',
        message: 'Please remember to top up the AdBlue on TRUCK1 before finishing your shift today.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toLocaleString(), // 2 hours ago
        senderName: 'Admin Manager',
        actions: [{ label: 'Will Do', type: 'acknowledge' }, { label: 'Reply', type: 'reply' }],
        response: null,
    },
    {
        id: uuidv4(),
        driverId: 'd2',
        driverName: 'Jane Smith',
        message: 'Your next CPC training is scheduled for next Monday. Please confirm your availability.',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleString(), // yesterday
        senderName: 'Admin Manager',
        actions: [{ label: 'Confirm Attendance', type: 'confirm' }, { label: 'Cannot Attend', type: 'decline' }],
        response: null,
    },
    {
        id: uuidv4(),
        driverId: 'd1',
        driverName: 'John Doe',
        message: 'New safety guidelines are available in the office. Please review them when you are next in.',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toLocaleString(), // 2 days ago
        senderName: 'Admin Manager',
        actions: [{ label: 'Acknowledge', type: 'acknowledge' }],
        response: null,
    }
];

export const MOCK_FINANCIAL_TRANSACTIONS: FinancialTransaction[] = [
    { id: uuidv4(), type: TransactionType.INCOME, description: "Invoice #123 Paid - Client X", amount: 1200, date: '2024-07-18' },
    { id: uuidv4(), type: TransactionType.EXPENSE, description: "Driver Wages - John Doe", amount: 850, date: '2024-07-17' }
];