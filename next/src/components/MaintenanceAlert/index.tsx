'use client';

import * as React from 'react';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import RichContentViewer from '../RichComponentViewer';

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
                    severity="warning"
                    variant="filled"
                    action={
                        <IconButton aria-label="close" color="inherit" size="small" onClick={handleClose}>
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                    sx={{
                        borderRadius: 0,
                        backgroundColor: '#fff8e1',
                        backdropFilter: 'blur(12px) saturate(180%)',
                        color: 'rgba(0, 0, 0, 0.87)',
                        '& .MuiAlert-message': {
                            width: '100%',
                            color: 'rgba(0, 0, 0, 0.87)',
                        },
                        '& .MuiAlert-icon': {
                            color: 'rgba(0, 0, 0, 0.87)',
                        },
                    }}
                >
                    <AlertTitle sx={{ fontWeight: 600, color: 'rgba(0, 0, 0, 0.87)' }}>{title}</AlertTitle>
                    <Box component="span" sx={{ color: 'rgba(0, 0, 0, 0.87)' }}>
                        <RichContentViewer content={text} />
                    </Box>
                </Alert>
            </Box>
        </Collapse>
    );
}
