'use client';

import * as React from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const STORAGE_KEY = 'maintenance-alert-dismissed';
const DISMISSAL_DURATION_MS = 60 * 60 * 1000; // 1 hour in milliseconds

type MaintenanceAlertProps = {
    title: string;
    text: string;
};

/**
 * MaintenanceAlert component displays a maintenance notice to users.
 * The alert can be dismissed and will collapse smoothly when closed.
 * Dismissal state is persisted in localStorage for 1 hour and applies site-wide.
 */
export function MaintenanceAlert({ title, text }: MaintenanceAlertProps) {
    const [open, setOpen] = React.useState(false);
    const [mounted, setMounted] = React.useState(false);

    // Check localStorage on mount to see if alert was previously dismissed within the last hour
    React.useEffect(() => {
        setMounted(true);
        const dismissedTimestamp = localStorage.getItem(STORAGE_KEY);
        if (dismissedTimestamp) {
            const dismissedTime = parseInt(dismissedTimestamp, 10);
            const now = Date.now();
            const isWithinHour = now - dismissedTime < DISMISSAL_DURATION_MS;
            setOpen(!isWithinHour);
            // Clean up expired dismissal
            if (!isWithinHour) {
                localStorage.removeItem(STORAGE_KEY);
            }
        } else {
            setOpen(true);
        }
    }, []);

    const handleClose = () => {
        setOpen(false);
        // Persist dismissal timestamp to localStorage (expires after 1 hour)
        localStorage.setItem(STORAGE_KEY, Date.now().toString());
    };

    // Don't render until mounted to avoid hydration mismatch
    if (!mounted) {
        return null;
    }

    return (
        <Collapse in={open} sx={{ width: '100%' }}>
            <Box component="section" role="status" sx={{ width: '100%' }}>
                <Alert
                    severity="info"
                    action={
                        <IconButton aria-label="close" color="inherit" size="small" onClick={handleClose}>
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                    sx={{
                        borderRadius: 0,
                        backgroundColor: '#E5F6FD !important',
                        color: '#014361',
                        '& .MuiAlert-icon': {
                            color: '#0288D1',
                        },
                    }}
                >
                    <AlertTitle sx={{ fontWeight: 600, color: 'inherit' }}>{title}</AlertTitle>
                    <span dangerouslySetInnerHTML={{ __html: text }} />
                </Alert>
            </Box>
        </Collapse>
    );
}
