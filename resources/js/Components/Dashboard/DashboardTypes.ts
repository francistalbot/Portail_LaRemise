// Types partagés pour Dashboard et dashboardUtils
export interface GridData {
    Time: string;
    Succursal: string;
    Benevole: string;
    Comite: string;
    Poste: string;
}

export interface Position {
    id: string;
    name: string;
    volunteer: string;
    isUrgent: boolean;
}

export interface TimeSlot {
    id: string;
    time: string;
    date: string;
    totalPositions: number;
    filledPositions: number;
    positions: Position[];
}

export interface Volunteer {
    id: string;
    name: string;
    email: string;
    isAvailable: boolean;
    lastActivity: string;
}
