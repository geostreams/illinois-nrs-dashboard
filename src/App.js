// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import Layout from "./components/layout/Layout";
import { ScreenSizeProvider } from "./context/ScreenSizeContext";

import ReportPage from "./pages/PointSource";

const theme = createTheme();

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <ScreenSizeProvider>
                <CssBaseline />
                <Router>
                    <Layout>
                        <Routes>
                            <Route path="/*" element={<ReportPage />} />
                        </Routes>
                    </Layout>
                </Router>
            </ScreenSizeProvider>
        </ThemeProvider>
    );
};

export default App;
