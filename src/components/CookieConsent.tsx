"use client";

import { useEffect, useState } from "react";

export default function CookieConsent() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const accepted = localStorage.getItem("cookies_accepted");
        if (!accepted) setShow(true);
    }, []);

    const acceptCookies = () => {
        localStorage.setItem("cookies_accepted", "true");
        setShow(false);
        window.location.reload(); // Para que el backend empiece a registrar datos
    };

    if (!show) return null;

    return (
        <div
            style={{
                position: "fixed",
                bottom: 0,
                width: "100%",
                background: "#111",
                color: "white",
                padding: "16px",
                textAlign: "center",
                zIndex: 9999,
                boxShadow: "0 -4px 20px rgba(0,0,0,0.5)",
            }}
        >
            <p style={{ marginBottom: "12px", fontSize: "14px" }}>
                Usamos cookies para mejorar tu experiencia y analizar visitas.
                ¿Aceptas el uso de cookies?
            </p>

            <button
                onClick={acceptCookies}
                style={{
                    background: "#00c2ff",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    border: "none",
                    color: "#000",
                    cursor: "pointer",
                    fontWeight: "bold",
                }}
            >
                Aceptar
            </button>
        </div>
    );
}
