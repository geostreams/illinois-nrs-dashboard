import React, { createContext, useContext, useState, useEffect } from "react";
import { useTheme, useMediaQuery } from "@mui/material";

const ScreenSizeContext = createContext();

export const ScreenSizeProvider = ({ children }) => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
    const [screenSize, setScreenSize] = useState({
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

export const useScreenSize = () => useContext(ScreenSizeContext);
