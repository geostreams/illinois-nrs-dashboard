'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useTheme, useMediaQuery } from "@mui/material";

interface ScreenSizeContextType {
    isSmallScreen: boolean;
}

// Create context with a default value matching the interface
const ScreenSizeContext = createContext<ScreenSizeContextType | undefined>(undefined);

interface ScreenSizeProviderProps {
    children: ReactNode;
}

export const ScreenSizeProvider: React.FC<ScreenSizeProviderProps> = ({ children }) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
    const [screenSize, setScreenSize] = useState<ScreenSizeContextType>({
        isSmallScreen: isSmallScreen,
    });

    useEffect(() => {
        setScreenSize({ isSmallScreen: isSmallScreen });
    }, [isSmallScreen]);

    return (
        <ScreenSizeContext.Provider value={screenSize}>
            {children}
        </ScreenSizeContext.Provider>
    );
};

export const useScreenSize = (): ScreenSizeContextType => {
    const context = useContext(ScreenSizeContext);
    if (context === undefined) {
        throw new Error('useScreenSize must be used within a ScreenSizeProvider');
    }
    return context;
};
