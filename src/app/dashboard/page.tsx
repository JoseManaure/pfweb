"use client";

import { useEffect, useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
} from "recharts";
import VisitorsMap from "@/components/VisitorsMap";

type Chat = { _id: string; prompt: string; reply: string; sessionId: string; timestamp: string };
type Visitor = { _id: string; visitorId: string; ip: string; userAgent: string; createdAt: string };

export default function Dashboard() {
    const [chats, setChats] = useState<Chat[]>([]);
    const [visitors, setVisitors] = useState<Visitor[]>([]);
    const [chatSearch, setChatSearch] = useState("");
    const [visitorSearch, setVisitorSearch] = useState("");

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/dashboard/chats?search=${chatSearch}`)
            .then(res => res.json())
            .then(data => setChats(data.chats));

        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/dashboard/visitors?ip=${visitorSearch}`)
            .then(res => res.json())
            .then(data => setVisitors(data.visitors));
    }, [chatSearch, visitorSearch]);

    // Preparar datos de gráficos
    const chatChartData = Object.values(
        chats.reduce((acc: any, c) => {
            const day = new Date(c.timestamp).toLocaleDateString();
            acc[day] = acc[day] || { day, chats: 0 };
            acc[day].chats++;
            return acc;
        }, {})
    );

    const visitorChartData = Object.values(
        visitors.reduce((acc: any, v) => {
            acc[v.ip] = acc[v.ip] || { ip: v.ip, visits: 0 };
            acc[v.ip].visits++;
            return acc;
        }, {})
    );

    return (
        <div className="p-8 min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-200">
            <h1 className="text-4xl font-bold mb-10 tracking-tight">
                Dashboard de Actividad
            </h1>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

                {/* === CHATS POR DÍA === */}
                <section className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">📈 Chats por día</h2>

                    <input
                        placeholder="Buscar en chats..."
                        value={chatSearch}
                        onChange={(e) => setChatSearch(e.target.value)}
                        className="mb-4 px-3 py-2 border rounded-lg w-full dark:bg-gray-700"
                    />

                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chatChartData}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                <XAxis dataKey="day" />
                                <YAxis />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="chats"
                                    stroke="#3b82f6"
                                    strokeWidth={2}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </section>

                {/* === VISITAS POR IP === */}
                <section className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">📊 Actividad por IP</h2>

                    <input
                        placeholder="Filtrar IP..."
                        value={visitorSearch}
                        onChange={(e) => setVisitorSearch(e.target.value)}
                        className="mb-4 px-3 py-2 border rounded-lg w-full dark:bg-gray-700"
                    />

                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={visitorChartData}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                                <XAxis dataKey="ip" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="visits" fill="#f59e0b" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </section>

                {/* === CHATS RECIENTES === */}
                <section className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">💬 Chats recientes</h2>

                    <div className="max-h-64 overflow-y-auto space-y-3 pr-2">
                        {chats.map(chat => (
                            <div key={chat._id} className="border-b pb-2">
                                <p><b className="text-blue-500">Usuario:</b> {chat.prompt}</p>
                                <p><b className="text-green-500">Asistente:</b> {chat.reply}</p>
                                <p className="text-xs text-gray-400 mt-1">
                                    {new Date(chat.timestamp).toLocaleString()}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* === VISITANTES RECIENTES === */}
                <section className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">👤 Visitantes recientes</h2>

                    <div className="max-h-64 overflow-y-auto space-y-3 pr-2">
                        {visitors.map(v => (
                            <div key={v._id} className="border-b pb-2">
                                <p><b>ID:</b> {v.visitorId}</p>
                                <p><b>IP:</b> {v.ip}</p>
                                <p className="text-xs text-gray-300 mt-1">
                                    {v.userAgent}
                                </p>
                                <p className="text-xs text-gray-400">
                                    {new Date(v.createdAt).toLocaleString()}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* === MAPA === */}
                <section className="col-span-1 xl:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">🗺️ Mapa de Visitantes</h2>
                    <VisitorsMap visitors={visitors} />
                </section>

            </div>
        </div>
    );
}
