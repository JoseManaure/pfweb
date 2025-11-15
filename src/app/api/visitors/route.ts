export async function GET() {
    const backendURL = process.env.BACKEND_URL;
    const res = await fetch(`${backendURL}/visitors`);

    if (!res.ok) {
        return new Response(JSON.stringify({ error: true }), { status: 500 });
    }

    const data = await res.json();
    return Response.json(data);
}
