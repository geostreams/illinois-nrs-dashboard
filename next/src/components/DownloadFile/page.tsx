'use client';

import { useState, FC } from 'react';
import { Button } from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';

interface DownloadFileProps {
    displayText: string;
    fileData: {
        url: string;
        name?: string;
    };
}

const DownloadFile: FC<DownloadFileProps> = ({ displayText, fileData }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleDownload = async () => {
        if (!fileData?.url) return;

        setIsLoading(true);
        try {
            const fileUrl = fileData.url.startsWith('http')
                ? fileData.url
                : `${process.env.CMS_API_URL}${fileData.url}`;

            const response = await fetch(fileUrl);
            if (!response.ok) throw new Error('Download failed');

            const blob = await response.blob();
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = fileData?.name || 'download';
            link.click();
            window.URL.revokeObjectURL(link.href);
        } catch (error) {
            console.error('Error downloading file:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={handleDownload}
            disabled={isLoading || !fileData?.url}
            sx={{
                marginBottom: '10px',
                backgroundColor: '#295A79',
                color: 'white',
                borderRadius: '50px',
                padding: '6px 24px',
                textTransform: 'uppercase',
                fontWeight: 'bold',
                '&:hover': {
                    backgroundColor: '#1D4258',
                },
            }}
        >
            {isLoading ? 'Downloading...' : displayText}
        </Button>
    );
};

export default DownloadFile;
