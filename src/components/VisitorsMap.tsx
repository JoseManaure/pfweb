"use client";

import { Map, Marker, Overlay } from "pigeon-maps";
import { useMemo } from "react";

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
    const points = visitors
        .filter((v) => v.location)
        .map((v) => ({
            ...v,
            point: [v.location!.lat, v.location!.lon] as [number, number],
        }));

    // Centro promedio
    const avgCenter = useMemo(() => {
        if (points.length === 0) return [0, 0] as [number, number];
        const lat =
            points.reduce((sum, p) => sum + p.point[0], 0) / points.length;
        const lon =
            points.reduce((sum, p) => sum + p.point[1], 0) / points.length;
        return [lat, lon] as [number, number];
    }, [points]);

    return (
        <div
            style={{
                height: "400px",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
            }}
        >
            <Map
                defaultCenter={avgCenter}
                defaultZoom={2}
                height={400}
                provider={(x, y, z) =>
                    `https://tile.openstreetmap.org/${z}/${x}/${y}.png`
                }
            >
                {points.map((p) => (
                    <Marker
                        key={p._id}
                        width={30}
                        anchor={p.point}
                        color="#00d1ff"
                    />
                ))}

                {points.map((p) => (
                    <Overlay
                        key={p._id + "_popup"}
                        anchor={p.point}
                        offset={[0, 35]}
                    >
                        <div
                            style={{
                                background: "rgba(0,0,0,0.8)",
                                color: "white",
                                padding: "8px 12px",
                                borderRadius: "10px",
                                fontSize: "12px",
                                backdropFilter: "blur(4px)",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
                                minWidth: "120px",
                            }}
                        >
                            <b>IP:</b> {p.ip}
                            <br />
                            {p.location?.city}, {p.location?.country}
                            <br />
                            <small>{new Date(p.createdAt).toLocaleString()}</small>
                        </div>
                    </Overlay>
                ))}
            </Map>


        </div>
    );
}
