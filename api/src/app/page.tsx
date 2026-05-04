export default function APIHome() {
  return (
    <div style={{ fontFamily: 'monospace', padding: 32, background: '#0c0a09', color: '#d97706', minHeight: '100vh' }}>
      <h1 style={{ fontSize: 24, marginBottom: 8 }}>🟡 Céleste Events API</h1>
      <p style={{ color: '#78716c', marginBottom: 24 }}>Backend API server — all routes listed below.</p>
      <div style={{ color: '#a8a29e' }}>
        <p>GET  /api/hotels</p>
        <p>GET  /api/hotels/:id</p>
        <p>GET  /api/menu-items?hotelId=:id</p>
        <p>GET  /api/availability?hotelId=:id</p>
        <p>POST /api/bookings</p>
        <p>POST /api/auth/login</p>
        <p>POST /api/auth/register</p>
        <p>POST /api/admin/auth</p>
        <p>GET  /api/admin/hotels</p>
        <p>GET  /api/admin/applications</p>
        <p>GET  /api/admin/stats</p>
        <p>POST /api/seed</p>
      </div>
    </div>
  );
}
