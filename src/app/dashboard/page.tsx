"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

type Chat = { _id: string; prompt: string; reply: string; sessionId: string; timestamp: string };
type Visitor = { _id: string; visitorId: string; ip: string; userAgent: string; createdAt: string };

export default function Dashboard() {
    const [chats, setChats] = useState<Chat[]>([]);
    const [visitors, setVisitors] = useState<Visitor[]>([]);
    const [chatSearch, setChatSearch] = useState("");
    const [visitorSearch, setVisitorSearch] = useState("");

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/dashboard/chats?search=${chatSearch}`).then(res => res.json()).then(data => setChats(data.chats));
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/dashboard/visitors?ip=${visitorSearch}`).then(res => res.json()).then(data => setVisitors(data.visitors));
    }, [chatSearch, visitorSearch]);

    // Datos de chats por día
    const chatChartData = Object.values(
        chats.reduce((acc: any, c) => {
            const day = new Date(c.timestamp).toLocaleDateString();
            acc[day] = acc[day] || { day, chats: 0 };
            acc[day].chats += 1;
            return acc;
        }, {})
    );

    // Datos de visitas por IP
    const visitorChartData = Object.values(
        visitors.reduce((acc: any, v) => {
            acc[v.ip] = acc[v.ip] || { ip: v.ip, visits: 0 };
            acc[v.ip].visits += 1;
            return acc;
        }, {})
    );

    return (
        <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            <h1 className="text-3xl font-bold mb-6">Dashboard Interactivo</h1>

            {/* === Gráfico de chats === */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-2">Chats por día</h2>
                <input
                    placeholder="Buscar en chats..."
                    value={chatSearch}
                    onChange={(e) => setChatSearch(e.target.value)}
                    className="mb-2 px-2 py-1 border rounded dark:bg-gray-800 dark:text-gray-200"
                />
                <div className="w-full h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chatChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="chats" stroke="#3b82f6" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </section>

            {/* === Chats recientes === */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-2">Chats recientes</h2>
                <ul className="space-y-2 max-h-64 overflow-y-auto border rounded p-2 bg-gray-100 dark:bg-gray-800">
                    {chats.map(chat => (
                        <li key={chat._id} className="border-b py-1">
                            <b>Usuario:</b> {chat.prompt} <br />
                            <b>Asistente:</b> {chat.reply} <br />
                            <small>{new Date(chat.timestamp).toLocaleString()}</small>
                        </li>
                    ))}
                </ul>
            </section>

            {/* === Gráfico de visitantes por IP === */}
            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-2">Actividad por IP</h2>
                <input
                    placeholder="Filtrar IP..."
                    value={visitorSearch}
                    onChange={(e) => setVisitorSearch(e.target.value)}
                    className="mb-2 px-2 py-1 border rounded dark:bg-gray-800 dark:text-gray-200"
                />
                <div className="w-full h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={visitorChartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="ip" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="visits" fill="#f59e0b" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </section>

            {/* === Visitantes recientes === */}
            <section>
                <h2 className="text-xl font-semibold mb-2">Visitantes recientes</h2>
                <ul className="space-y-2 max-h-64 overflow-y-auto border rounded p-2 bg-gray-100 dark:bg-gray-800">
                    {visitors.map(v => (
                        <li key={v._id} className="border-b py-1">
                            <b>ID:</b> {v.visitorId} <br />
                            <b>IP:</b> {v.ip} <br />
                            <b>User Agent:</b> {v.userAgent} <br />
                            <small>{new Date(v.createdAt).toLocaleString()}</small>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}
