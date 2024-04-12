
import React, { ReactNode, createContext, useContext, useState } from 'react';

// Define the shape of the context
interface IDisableNavigationContextValue {
    isNavigationDisabled: boolean;
    triggerDisableWithTimer: (milliseconds: number) => void;
    setIsNavigationDisabled: React.Dispatch<React.SetStateAction<boolean>>
    // Add any function to change this state if needed
}

const defaultContext: IDisableNavigationContextValue = {
    isNavigationDisabled: false,
    triggerDisableWithTimer: () => 5000,
    setIsNavigationDisabled: () => false
}

// Create the context
export const DisableNavigationContext = createContext<IDisableNavigationContextValue>(defaultContext);

// Create a provider component
export const DisableNavigationProvider = ({ children }: { children: ReactNode }) => {
    const [isNavigationDisabled, setIsNavigationDisabled] = useState<boolean>(false);


    const triggerDisableWithTimer = (milliseconds: number = 5000) => {
        setIsNavigationDisabled(true);
        setTimeout(() => {
            setIsNavigationDisabled(false);
        }, milliseconds)
    }

    return (
        <DisableNavigationContext.Provider value={{ isNavigationDisabled, triggerDisableWithTimer, setIsNavigationDisabled }}>
            {children}
        </DisableNavigationContext.Provider>
    );
};

// Custom hook to use the splash screen context
export const useNavigationDisable = () => {
    const context = useContext(DisableNavigationContext);
    if (context === undefined) {
        throw new Error('useSplashScreen must be used within a SplashScreenProvider');
    }
    return context;
};
