import React from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from './supabase'; // Import your Supabase instances
import { BroadcastChannel } from 'broadcast-channel'; // Import the BroadcastChannel package

interface ProtectedRouteProps {
    element: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
    const [authStatus, setAuthStatus] = React.useState<boolean | null>(null);
    const [channel] = React.useState(() => new BroadcastChannel('auth'));

    // Check authentication status on component mount
    React.useEffect(() => {
        const checkAuthStatus = async () => {
            // Verify that 'supabase' is not null before using it
            if (!supabase) {
                console.error("Supabase instance is not available.");
                setAuthStatus(false);
                return;
            }

            // Check the user's authentication status using Supabase
            const { data: authData, error } = await supabase.auth.getUser();

            if (error) {
                console.error("Error checking authentication status:", error);
                setAuthStatus(false);
              } else {
                setAuthStatus(authData?.user !== null);
              }
            };
        // Listen for cross-tab communication
        channel.onmessage = (event: MessageEvent) => {
            if (event.data === 'logged_out') {
                setAuthStatus(false);
            }
        };

        // Check the initial authentication status
        checkAuthStatus();

        return () => {
            // Clean up the event listener
            channel.close();
        };
    }, [channel]);

    // If authStatus is null, we are still checking the authentication status
    if (authStatus === null) {
        return <div>Loading...</div>;
      }

    // If the user is authenticated, render the provided element
    // If not, redirect to the login page ("/")
    if (authStatus === false) {
        return <Navigate to="/" replace />;
      }
    ; return <>{element}</>;
};

export default ProtectedRoute;
