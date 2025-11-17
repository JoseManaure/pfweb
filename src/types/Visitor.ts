export interface Visitor {
    _id: string;
    ip: string;
    visitorId: string;
    userAgent: string;
    createdAt: string;
    location?: {
        lat: number;
        lon: number;
        city: string;
        country: string;
    };
}
