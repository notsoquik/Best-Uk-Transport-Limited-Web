import React, { useState, useMemo } from 'react';
import { MOCK_DRIVERS, MOCK_NOTIFICATIONS } from '../../constants';
import { User, Notification as NotificationType } from '../../types';
import Card from '../../components/Card';
import { v4 as uuidv4 } from 'uuid';

interface NotificationsProps {
    user: User;
}

const Notifications: React.FC<NotificationsProps> = ({ user }) => {
    const [selectedDriverId, setSelectedDriverId] = useState(MOCK_DRIVERS[0]?.id || '');
    const [message, setMessage] = useState('');
    const [sentNotifications, setSentNotifications] = useState<NotificationType[]>(MOCK_NOTIFICATIONS);
    const [confirmation, setConfirmation] = useState('');
    const [requestAcknowledgement, setRequestAcknowledgement] = useState(true);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedDriverId || !message.trim()) {
            alert('Please select a driver and enter a message.');
            return;
        }

        const selectedDriver = MOCK_DRIVERS.find(d => d.id === selectedDriverId);
        if (!selectedDriver) return;

        const newNotification: NotificationType = {
            id: uuidv4(),
            driverId: selectedDriver.id,
            driverName: selectedDriver.name,
            message,
            timestamp: new Date().toLocaleString(),
            senderName: user.name,
            response: null,
            actions: requestAcknowledgement ? [{ label: 'Acknowledge', type: 'acknowledge' }] : [],
        };
        
        const updatedNotifications = [newNotification, ...sentNotifications].sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        setSentNotifications(updatedNotifications);
        
        // In a real app, you would also persist this to the backend.
        // For this demo, we'll update the mock constant in memory.
        MOCK_NOTIFICATIONS.splice(0, MOCK_NOTIFICATIONS.length, ...updatedNotifications);

        setConfirmation(`Notification sent to ${selectedDriver.name}.`);
        setMessage('');
        setTimeout(() => setConfirmation(''), 3000);
    };

    const respondedNotifications = useMemo(() =>
        sentNotifications
            .filter(n => n.response)
            .sort((a, b) => new Date(b.response!.timestamp).getTime() - new Date(a.response!.timestamp).getTime()),
        [sentNotifications]
    );

    return (
        <div className="space-y-6">
            {/* New section for recent responses */}
            {respondedNotifications.length > 0 && (
                <Card title="Recent Driver Responses">
                    <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-2">
                        {respondedNotifications.map(notif => (
                            <div key={`resp-${notif.id}`} className="p-3 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
                                <p className="text-sm text-gray-600">
                                    <span className="font-semibold text-brand-dark">{notif.driverName}</span> responded to: "{notif.message}"
                                </p>
                                <div className="mt-2 pl-4 border-l-2 border-green-200">
                                    <p className="font-semibold text-green-800">Response: "{notif.response!.actionLabel}"</p>
                                    {notif.response!.message && (
                                        <p className="text-sm text-gray-700 italic">Message: "{notif.response!.message}"</p>
                                    )}
                                    <p className="text-xs text-gray-500 mt-1">{notif.response!.timestamp}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <Card title="Send Notification">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="driver" className="block text-sm font-medium text-gray-700">Select Driver</label>
                                <select
                                    id="driver"
                                    value={selectedDriverId}
                                    onChange={(e) => setSelectedDriverId(e.target.value)}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-brand-blue-light focus:border-brand-blue-light sm:text-sm rounded-md"
                                >
                                    {MOCK_DRIVERS.map(driver => (
                                        <option key={driver.id} value={driver.id}>{driver.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message / Task</label>
                                <textarea
                                    id="message"
                                    rows={5}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-brand-blue-light focus:border-brand-blue-light"
                                    placeholder="Enter your message here..."
                                />
                            </div>
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input
                                        id="acknowledgement"
                                        name="acknowledgement"
                                        type="checkbox"
                                        checked={requestAcknowledgement}
                                        onChange={(e) => setRequestAcknowledgement(e.target.checked)}
                                        className="focus:ring-brand-blue-light h-4 w-4 text-brand-blue-light border-gray-300 rounded"
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="acknowledgement" className="font-medium text-gray-700">Request Action</label>
                                    <p className="text-gray-500">Adds an "Acknowledge" button for the driver.</p>
                                </div>
                            </div>
                            <div>
                                <button type="submit" className="w-full bg-brand-blue hover:bg-brand-blue-light text-white font-bold py-2 px-4 rounded-md transition duration-300">
                                    Send Notification
                                </button>
                            </div>
                            {confirmation && <p className="text-sm text-green-600 text-center">{confirmation}</p>}
                        </form>
                    </Card>
                </div>

                <div className="lg:col-span-2">
                    <Card title="Sent Notifications History">
                        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                            {sentNotifications.map(notif => (
                                <div key={notif.id} className={`p-3 rounded-lg border ${notif.response ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                                        <div className="flex-grow">
                                            <p className="font-semibold text-brand-dark">To: {notif.driverName}</p>
                                            <p className="mt-1 text-sm text-gray-800">{notif.message}</p>
                                        </div>
                                        <p className="text-xs text-gray-500 whitespace-nowrap sm:ml-4 mt-2 sm:mt-0">{notif.timestamp}</p>
                                    </div>
                                    {notif.response && (
                                        <div className="mt-2 pt-2 border-t border-green-200">
                                            <p className="text-sm font-semibold text-green-800">Response: "{notif.response.actionLabel}"</p>
                                            {notif.response.message && <p className="text-sm text-gray-700 italic">"{notif.response.message}"</p>}
                                            <p className="text-xs text-gray-500 mt-1">{notif.response.timestamp}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Notifications;
