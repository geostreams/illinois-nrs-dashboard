'use client';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

interface CKReaderProps {
    content: any;
}

const CKReader = ({ content }: CKReaderProps) => {
    return (
        <CKEditor
            config={{
                licenseKey: 'GPL',
            }}
            editor={ClassicEditor}
            disabled={true}
            data={content.replaceAll(
                '"/uploads',
                `"${process.env.NEXT_PUBLIC_CMS_API_URL}/uploads`
            )}
            onReady={(editor) => {
                if (editor.ui.view.toolbar.element) {
                    editor.ui.view.toolbar.element.remove();
                }
            }}
        />
    );
};

export default CKReader;
