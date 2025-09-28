import React, { useState } from 'react';
import { MOCK_NOTIFICATIONS } from '../../constants';
import Card from '../../components/Card';
import { BellIcon } from '../../components/icons';
import { Notification as NotificationType, NotificationAction } from '../../types';

interface NotificationsProps {
    userId: string;
}

const Notifications: React.FC<NotificationsProps> = ({ userId }) => {
    // Local state to manage notifications, initialized from the mock data
    const [notifications, setNotifications] = useState<NotificationType[]>(
        MOCK_NOTIFICATIONS
            .filter(n => n.driverId === userId)
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    );

    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyMessage, setReplyMessage] = useState('');

    const handleSubmitResponse = (notificationId: string, actionLabel: string, message?: string) => {
        const response = {
            actionLabel,
            message,
            timestamp: new Date().toLocaleString(),
        };

        // Update local state for immediate UI feedback
        setNotifications(prev => 
            prev.map(n => n.id === notificationId ? { ...n, response } : n)
        );

        // Update the "global" mock object to simulate a backend update
        const mockIndex = MOCK_NOTIFICATIONS.findIndex(n => n.id === notificationId);
        if (mockIndex !== -1) {
            MOCK_NOTIFICATIONS[mockIndex].response = response;
        }

        // Reset reply state if any
        setReplyingTo(null);
        setReplyMessage('');
    };
    
    const handleActionClick = (notificationId: string, action: NotificationAction) => {
        if (action.type === 'reply') {
            setReplyingTo(notificationId);
        } else {
            handleSubmitResponse(notificationId, action.label);
        }
    };

    const handleSendReply = (notificationId: string) => {
        if (replyMessage.trim()) {
            handleSubmitResponse(notificationId, 'Replied', replyMessage);
        }
    };

    return (
        <Card title="My Notifications">
            {notifications.length > 0 ? (
                <div className="space-y-4">
                    {notifications.map(notif => (
                        <div key={notif.id} className="p-4 bg-blue-50 border-l-4 border-brand-blue-light rounded-r-lg shadow-sm">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                                 <div className="flex-grow">
                                    <p className="text-sm text-gray-800">{notif.message}</p>
                                    <p className="mt-2 text-xs text-gray-500">
                                        From: <strong>{notif.senderName}</strong>
                                    </p>
                                </div>
                                <p className="text-xs text-gray-500 whitespace-nowrap sm:ml-4 mt-2 sm:mt-0">{notif.timestamp}</p>
                            </div>

                            {/* Actions or Response */}
                            <div className="mt-3 pt-3 border-t border-blue-200">
                                {notif.response ? (
                                    <div className="text-sm">
                                        <p className="font-semibold text-green-700">Your response: "{notif.response.actionLabel}"</p>
                                        {notif.response.message && <p className="mt-1 text-gray-600 italic">"{notif.response.message}"</p>}
                                        <p className="text-xs text-gray-500 mt-1">{notif.response.timestamp}</p>
                                    </div>
                                ) : replyingTo === notif.id ? (
                                    <div className="flex items-center space-x-2">
                                        <input 
                                            type="text"
                                            value={replyMessage}
                                            onChange={(e) => setReplyMessage(e.target.value)}
                                            placeholder="Type your reply..."
                                            className="flex-grow px-2 py-1 border border-gray-300 rounded-md text-sm focus:ring-brand-blue-light focus:border-brand-blue-light"
                                        />
                                        <button onClick={() => handleSendReply(notif.id)} className="px-3 py-1 bg-brand-blue text-white rounded-md text-sm font-semibold hover:bg-brand-blue-light">Send</button>
                                        <button onClick={() => setReplyingTo(null)} className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300">Cancel</button>
                                    </div>
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {notif.actions?.map(action => (
                                            <button 
                                                key={action.label} 
                                                onClick={() => handleActionClick(notif.id, action)}
                                                className="px-3 py-1 bg-white border border-brand-blue text-brand-blue rounded-full text-sm font-semibold hover:bg-brand-blue hover:text-white transition-colors"
                                            >
                                                {action.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8">
                    <BellIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No new notifications</h3>
                    <p className="mt-1 text-sm text-gray-500">You're all caught up.</p>
                </div>
            )}
        </Card>
    );
};

export default Notifications;
