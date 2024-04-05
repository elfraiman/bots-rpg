
import React, { ReactNode, createContext, useContext, useState } from 'react';

// Define the shape of the context
interface ISplashScreenContextValue {
    isSplashScreenActive: boolean;
    setIsSplashScreenActive: React.Dispatch<React.SetStateAction<boolean>>;
    // Add any function to change this state if needed
}

const defaultContext: ISplashScreenContextValue = {
    isSplashScreenActive: false,
    setIsSplashScreenActive: () => false
}

// Create the context
export const SplashScreenContext = createContext<ISplashScreenContextValue>(defaultContext);

// Create a provider component
export const SplashScreenProvider = ({ children }: { children: ReactNode }) => {
    const [isSplashScreenActive, setIsSplashScreenActive] = useState<boolean>(false);

    console.log(isSplashScreenActive, 'is splash active? #')

    return (
        <SplashScreenContext.Provider value={{ isSplashScreenActive, setIsSplashScreenActive }}>
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
