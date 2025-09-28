import React, { useState } from 'react';
import { MOCK_DRIVERS, MOCK_MANAGERS } from '../constants';
import { User, UserRole } from '../types';
import { TruckIcon } from '../components/icons';

interface LoginPageProps {
    onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<UserRole>(UserRole.DRIVER);
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        let user: User | undefined;
        if (role === UserRole.DRIVER) {
            user = MOCK_DRIVERS.find(d => d.email === email);
        } else {
            user = MOCK_MANAGERS.find(m => m.email === email);
        }

        // In a real app, you'd also check the password. Here we just check email.
        if (user) {
            onLogin(user);
        } else {
            setError('Invalid credentials. Please try again.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg">
                <div className="text-center">
                    <TruckIcon className="mx-auto h-12 w-auto text-brand-blue-light" />
                    <h2 className="mt-6 text-3xl font-extrabold text-brand-dark">
                        Best UK Transport Portal
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Please sign in to your account
                    </p>
                </div>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-800">
                    <p className="font-semibold">Test Credentials:</p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                        <li><strong>Driver:</strong> <code>driver@test.com</code></li>
                        <li><strong>Manager:</strong> <code>manager@test.com</code></li>
                        <li>Password can be anything.</li>
                    </ul>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email-address" className="sr-only">Email address</label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-brand-blue-light focus:border-brand-blue-light focus:z-10 sm:text-sm"
                                placeholder="Email address (e.g., driver@test.com)"
                            />
                        </div>
                        <div>
                            <label htmlFor="password-sr" className="sr-only">Password</label>
                            <input
                                id="password-sr"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-brand-blue-light focus:border-brand-blue-light focus:z-10 sm:text-sm"
                                placeholder="Password (any)"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                         <div className="text-sm">
                           <p className="font-medium text-gray-600">Login as:</p>
                            <div className="mt-2 flex items-center space-x-4">
                               <label className="flex items-center">
                                   <input type="radio" name="role" value={UserRole.DRIVER} checked={role === UserRole.DRIVER} onChange={() => setRole(UserRole.DRIVER)} className="h-4 w-4 text-brand-blue-light focus:ring-brand-blue-light border-gray-300"/>
                                   <span className="ml-2 text-gray-700">Driver</span>
                               </label>
                               <label className="flex items-center">
                                   <input type="radio" name="role" value={UserRole.MANAGER} checked={role === UserRole.MANAGER} onChange={() => setRole(UserRole.MANAGER)} className="h-4 w-4 text-brand-blue-light focus:ring-brand-blue-light border-gray-300"/>
                                   <span className="ml-2 text-gray-700">Manager</span>
                               </label>
                            </div>
                        </div>
                        <div className="text-sm">
                            <a href="#" className="font-medium text-brand-blue-light hover:text-brand-blue">
                                Forgot your password?
                            </a>
                        </div>
                    </div>

                    {error && <p className="text-sm text-red-600 text-center">{error}</p>}

                    <div>
                        <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-blue hover:bg-brand-blue-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue-light transition-colors duration-300">
                            Sign in
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;