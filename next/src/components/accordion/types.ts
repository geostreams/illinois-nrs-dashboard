export interface AccordionItemData {
    id: number;
    documentId: string;
    title: string;
    accordionGroup: string;
    accordionOrder: number;
    createdAt?: string;
    updatedAt?: string;
    publishedAt?: string;
    contents: Array<AccordionItemContent>;
}

export interface AccordionItemContent {
    __component: string;
    id: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

export interface AccordionProps {
    accordionGroupID: string;
}

export interface AccordionItemProps {
    item: AccordionItemData;
    isFirst: boolean;
    isLast: boolean;
}
