

export enum UserRole {
    DRIVER = 'driver',
    MANAGER = 'manager',
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
}

export interface DriverDetails {
    fullName: string;
    address: string;
    nationalInsuranceNumber: string;
    drivingLicenceNumber: string;
    drivingLicenceExpiry: string;
    cpcNumber: string;
    cpcExpiry: string;
    digiCardNumber: string;
    digiCardExpiry: string;
    mpqcNumber: string;
    mpqcExpiry: string;
    contactNumber: string;
    email: string;
    customDetails: { id: string, label: string; value: string }[];
}

export interface Truck {
    id: string;
    registration: string;
    make: string;
    model: string;
    year: number;
    location: string;
    motDueDate: string;
    motReminder: boolean;
    tachoCalibrationDate: string;
    tachoReminder: boolean;
    pmiDate: string;
    pmiReminder: boolean;
    serviceDueDate: string;
    brakeTestDue: boolean;
    status: 'Active' | 'In Repair' | 'Sold';
}

export interface Shift {
    id: string;
    driverId: string;
    driverName: string;
    startTime: string;
    endTime?: string;
    truckRegistration: string;
    startMileage: number;
    endMileage?: number;
    loadTicketNumber?: string;
    commodity?: string;
    collectionPoint?: string;
    deliveryPoint?: string;
    revenue?: number;
    notes?: string;
}

export interface VehicleCheckItem {
    id: string;
    name: string;
    isFaulty: boolean;
    description: string;
}

export interface DailyVehicleCheck {
    id: string;
    driverId: string;
    driverName: string;
    truckRegistration: string;
    date: string;
    startMileage: number;
    checklist: VehicleCheckItem[];
}

export interface MaintenanceLog {
    id: string;
    truckRegistration: string;
    date: string;
    description: string;
    type: 'Cost' | 'Income';
    amount: number;
    client?: string;
    partsUsed?: string;
    relatedCheckId?: string;
}

export interface FuelIntake {
    id: string;
    driverId: string;
    driverName: string;
    truckRegistration: string;
    date: string;
    mileage: number;
    diesel: { amount?: number; price?: number };
    adBlue: { amount?: number; price?: number };
    other: { description?: string; price?: number };
}

export interface NotificationAction {
    label: string;
    type: 'confirm' | 'decline' | 'acknowledge' | 'reply';
}

export interface NotificationResponse {
    actionLabel: string;
    message?: string;
    timestamp: string;
}

export interface Notification {
    id: string;
    driverId: string;
    driverName: string;
    message: string;
    timestamp: string;
    senderName: string;
    actions?: NotificationAction[];
    response?: NotificationResponse | null;
}

export enum TransactionType {
    INCOME = 'income',
    EXPENSE = 'expense',
}

export interface FinancialTransaction {
    id: string;
    type: TransactionType;
    description: string;
    amount: number;
    date: string;
}