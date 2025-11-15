"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

type Visitor = {
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
};

export default function VisitorsMap({ visitors }: { visitors: Visitor[] }) {
    return (
        <div style={{ height: "400px" }}>
            <MapContainer
                center={[0, 0]}
                zoom={2}
                style={{ height: "100%", width: "100%", borderRadius: "12px" }}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                {visitors.map((v) => (
                    v.location && (
                        <Marker
                            key={v._id}
                            position={[v.location.lat, v.location.lon]}
                        >
                            <Popup>
                                <b>IP:</b> {v.ip} <br />
                                {v.location.city}, {v.location.country}
                            </Popup>
                        </Marker>
                    )
                ))}
            </MapContainer>
        </div>
    );
}
