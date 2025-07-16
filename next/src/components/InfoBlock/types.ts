export interface TitleProps {
    id?: number;
    firstHalf: string;
    secondHalf: string;
    firstHalfColor: string;
    secondHalfColor: string;
}

export interface ImageData {
    alternativeText: string;
    url: string;
}

export interface PhotoBlockProps {
    id: number;
    title: string;
    blockColor: string;
    image: ImageData;
    imageWidth: number | null;
    imageHeight: number | null;
}

export interface InfoBlockProps {
    id: number;
    infoText: string;
    photoBlocks: PhotoBlockProps[];
    title: TitleProps;
}
