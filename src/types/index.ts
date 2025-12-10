export interface CalendarEvent {
    id: string;
    title: string;
    description?: string;
    startDate: string; // ISO string
    endDate: string; // ISO string
    color?: string;
}

export type ViewMode = 'desktop' | 'mobile';
