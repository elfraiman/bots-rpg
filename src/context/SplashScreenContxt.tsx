
import React, { ReactNode, createContext, useContext, useState } from 'react';

// Define the shape of the context
interface ISplashScreenContextValue {
    isSplashScreenActive: boolean;
    triggerSplashScreen: (milliseconds: number) => void;
    // Add any function to change this state if needed
}

const defaultContext: ISplashScreenContextValue = {
    isSplashScreenActive: false,
    triggerSplashScreen: () => 5000
}

// Create the context
export const SplashScreenContext = createContext<ISplashScreenContextValue>(defaultContext);

// Create a provider component
export const SplashScreenProvider = ({ children }: { children: ReactNode }) => {
    const [isSplashScreenActive, setIsSplashScreenActive] = useState<boolean>(false);


    const triggerSplashScreen = (milliseconds: number = 5000) => {
        setIsSplashScreenActive(true);
        setTimeout(() => {
            setIsSplashScreenActive(false);
        }, milliseconds)
    }

    return (
        <SplashScreenContext.Provider value={{ isSplashScreenActive, triggerSplashScreen }}>
            {children}
        </SplashScreenContext.Provider>
    );
};

// Custom hook to use the splash screen context
export const useSplashScreen = () => {
    const context = useContext(SplashScreenContext);
    if (context === undefined) {
        throw new Error('useSplashScreen must be used within a SplashScreenProvider');
    }
    return context;
};
