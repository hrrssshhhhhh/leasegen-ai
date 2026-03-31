import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=DM+Sans:wght@300;400;500;600&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #f5f3ef;
    --surface: #ffffff;
    --surface2: #f0ede8;
    --border: rgba(0,0,0,0.08);
    --border2: rgba(0,0,0,0.05);
    --gold: #b8862a;
    --gold-light: #c9952f;
    --gold-dim: rgba(184,134,42,0.1);
    --gold-border: rgba(184,134,42,0.25);
    --text: #1c1917;
    --text2: #44403c;
    --muted: #78716c;
    --accent-blue: #2563eb;
    --accent-green: #16a34a;
    --accent-red: #dc2626;
    --accent-amber: #d97706;
    --radius: 14px;
    --sidebar-w: 240px;
    --shadow: 0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04);
    --shadow-md: 0 4px 20px rgba(0,0,0,0.08);
  }

  body { font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--text); }
  .dashboard-root { display: flex; min-height: 100vh; background: var(--bg); }

  /* ── SIDEBAR ── */
  .sidebar {
    width: var(--sidebar-w);
    background: var(--surface);
    border-right: 1px solid var(--border);
    padding: 28px 16px;
    display: flex; flex-direction: column;
    position: fixed; top: 0; left: 0; bottom: 0; z-index: 10;
    box-shadow: 1px 0 0 var(--border2);
  }

  .sidebar-logo { display: flex; align-items: center; gap: 10px; padding: 0 8px; margin-bottom: 36px; }
  .sidebar-logo-icon {
    width: 36px; height: 36px;
    background: var(--gold-dim); border: 1.5px solid var(--gold-border);
    border-radius: 9px; display: flex; align-items: center; justify-content: center; font-size: 17px;
  }
  .sidebar-logo-text {
    font-family: 'Playfair Display', serif;
    font-size: 17px; font-weight: 700; color: var(--text); letter-spacing: 0.01em;
  }
  .sidebar-logo-text span { color: var(--gold-light); }

  .sidebar-label {
    font-size: 10px; font-weight: 600; letter-spacing: 0.12em;
    text-transform: uppercase; color: var(--muted); padding: 0 12px; margin-bottom: 8px;
  }
  .sidebar-nav { display: flex; flex-direction: column; gap: 3px; }

  .sidebar-btn {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 14px; border-radius: 10px; border: none;
    background: transparent; color: var(--muted);
    font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500;
    cursor: pointer; transition: all 0.18s; text-align: left; width: 100%;
  }
  .sidebar-btn:hover { background: var(--surface2); color: var(--text); }
  .sidebar-btn.active {
    background: var(--gold-dim); color: var(--gold-light);
    border: 1px solid var(--gold-border); font-weight: 600;
  }
  .sidebar-btn .btn-icon { font-size: 15px; width: 20px; text-align: center; }
  .sidebar-footer { margin-top: auto; padding-top: 16px; border-top: 1px solid var(--border); }

  /* ── MAIN ── */
  .main { flex: 1; margin-left: var(--sidebar-w); padding: 40px 44px; min-height: 100vh; }

  /* ── TOPBAR ── */
  .topbar { margin-bottom: 30px; }
  .topbar-title { font-family: 'Playfair Display', serif; font-size: 30px; font-weight: 700; color: var(--text); }
  .topbar-title span { color: var(--gold-light); }
  .topbar-sub { font-size: 13px; color: var(--muted); margin-top: 5px; font-weight: 300; }

  /* ── STATS ── */
  .stats-bar { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 24px; }

  .stat-card {
    display: flex; align-items: center; gap: 14px;
    padding: 18px 20px; background: var(--surface);
    border: 1px solid var(--border); border-radius: var(--radius);
    box-shadow: var(--shadow); transition: box-shadow 0.2s, border-color 0.2s;
  }
  .stat-card:hover { box-shadow: var(--shadow-md); border-color: var(--gold-border); }

  .stat-icon {
    width: 42px; height: 42px; border-radius: 11px;
    display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0;
  }
  .stat-icon.s1 { background: #fef3c7; border: 1px solid #fde68a; }
  .stat-icon.s2 { background: #dbeafe; border: 1px solid #bfdbfe; }
  .stat-icon.s3 { background: #d1fae5; border: 1px solid #a7f3d0; }

  .stat-label { font-size: 11px; color: var(--muted); font-weight: 500; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 3px; }
  .stat-value { font-size: 22px; font-weight: 700; color: var(--text); letter-spacing: -0.02em; }
  .stat-value.gv { color: var(--gold-light); }

  /* ── FILTERS ── */
  .filters-bar {
    display: flex; gap: 10px; align-items: center;
    margin-bottom: 26px; padding: 14px 16px;
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius); box-shadow: var(--shadow);
  }
  .search-wrap { position: relative; flex: 1; min-width: 0; }
  .search-icon { position: absolute; left: 11px; top: 50%; transform: translateY(-50%); color: var(--muted); font-size: 14px; pointer-events: none; }
  .search-input {
    width: 100%; padding: 9px 12px 9px 34px;
    background: var(--bg); border: 1px solid var(--border);
    border-radius: 9px; color: var(--text);
    font-family: 'DM Sans', sans-serif; font-size: 13px; outline: none; transition: border-color 0.2s;
  }
  .search-input:focus { border-color: var(--gold-light); box-shadow: 0 0 0 3px var(--gold-dim); }
  .search-input::placeholder { color: var(--muted); }

  .filter-group { display: flex; gap: 8px; align-items: center; flex-shrink: 0; }
  .filter-input {
    width: 100px; padding: 9px 12px;
    background: var(--bg); border: 1px solid var(--border);
    border-radius: 9px; color: var(--text);
    font-family: 'DM Sans', sans-serif; font-size: 13px; outline: none; transition: border-color 0.2s;
  }
  .filter-input:focus { border-color: var(--gold-light); }
  .filter-input::placeholder { color: var(--muted); }

  .filter-select {
    padding: 9px 12px; background: var(--bg); border: 1px solid var(--border);
    border-radius: 9px; color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 13px; outline: none; cursor: pointer;
  }
  .reset-btn {
    padding: 9px 14px; background: var(--surface2); color: var(--muted);
    border: 1px solid var(--border); border-radius: 9px;
    font-family: 'DM Sans', sans-serif; font-size: 13px; cursor: pointer; transition: all 0.2s; white-space: nowrap;
  }
  .reset-btn:hover { color: var(--text); border-color: rgba(0,0,0,0.15); }

  /* ── GRID ── */
  .leases-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 18px; }

  /* ── CARD ── */
  .lease-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 22px;
    box-shadow: var(--shadow);
    transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
    position: relative; overflow: hidden;
  }
  .lease-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, var(--gold-light), transparent);
    opacity: 0; transition: opacity 0.3s;
  }
  .lease-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-md); border-color: var(--gold-border); }
  .lease-card:hover::before { opacity: 1; }

  .card-badge {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 3px 10px; background: var(--gold-dim); border: 1px solid var(--gold-border);
    border-radius: 20px; font-size: 10px; font-weight: 600; color: var(--gold-light);
    letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 12px;
  }
  .card-tenant { font-family: 'Playfair Display', serif; font-size: 20px; font-weight: 600; color: var(--text); margin-bottom: 12px; line-height: 1.2; }

  .card-meta { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
  .card-meta-row { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--muted); }
  .card-meta-row span:last-child { color: var(--text2); }
  .card-meta-icon { font-size: 13px; width: 16px; text-align: center; }

  .rent-amount { font-size: 20px; font-weight: 700; color: var(--gold-light); letter-spacing: -0.02em; }
  .rent-period { font-size: 12px; color: var(--muted); margin-left: 3px; }

  .divider { height: 1px; background: var(--border); margin-bottom: 14px; }

  .card-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 7px; }

  .action-btn {
    display: flex; align-items: center; justify-content: center; gap: 5px;
    padding: 8px 10px; border-radius: 8px;
    font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500;
    cursor: pointer; border: none; transition: all 0.18s; text-decoration: none;
  }
  .btn-view { background: #eff6ff; color: var(--accent-blue); border: 1px solid #bfdbfe; }
  .btn-view:hover { background: #dbeafe; }
  .btn-edit { background: #fffbeb; color: var(--accent-amber); border: 1px solid #fde68a; }
  .btn-edit:hover { background: #fef3c7; }
  .btn-delete { background: #fef2f2; color: var(--accent-red); border: 1px solid #fecaca; }
  .btn-delete:hover { background: #fee2e2; }
  .btn-dupe { background: #f0fdf4; color: var(--accent-green); border: 1px solid #bbf7d0; }
  .btn-dupe:hover { background: #dcfce7; }

  /* ── EMPTY ── */
  .empty-state {
    grid-column: 1/-1; display: flex; flex-direction: column; align-items: center;
    justify-content: center; padding: 80px 40px; background: var(--surface);
    border: 1px dashed var(--border); border-radius: var(--radius);
    color: var(--muted); gap: 12px; text-align: center; box-shadow: var(--shadow);
  }
  .empty-icon { font-size: 40px; }
  .empty-title { font-size: 16px; font-weight: 600; color: var(--text); }
  .empty-sub { font-size: 13px; }

  /* ── LOADING ── */
  .loading-screen {
    min-height: 100vh; background: var(--bg);
    display: flex; align-items: center; justify-content: center;
    flex-direction: column; gap: 16px; color: var(--muted); font-family: 'DM Sans', sans-serif;
  }
  .loader-ring {
    width: 38px; height: 38px; border: 2px solid var(--border);
    border-top-color: var(--gold-light); border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
`;

function Dashboard() {
  const [leases, setLeases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [minRent, setMinRent] = useState("");
  const [maxRent, setMaxRent] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { alert("Session expired"); navigate("/"); return; }
    fetch("http://127.0.0.1:5000/leases", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => { setLeases(data); setLoading(false); })
      .catch(err => { console.error(err); setLoading(false); });
  }, [navigate]);

  const duplicateLease = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:5000/duplicate-lease/${id}`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) { alert("Duplicate failed"); return; }
      const refreshed = await fetch("http://127.0.0.1:5000/leases", { headers: { Authorization: `Bearer ${token}` } });
      setLeases(await refreshed.json());
    } catch (err) { console.error(err); alert("Server not reachable"); }
  };

  const deleteLease = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:5000/delete-lease/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (res.ok) setLeases(prev => prev.filter(l => l.id !== id));
      else alert(data.error || "Delete failed");
    } catch (err) { console.error(err); alert("Delete error"); }
  };

  const filteredLeases = leases
    .filter(l =>
      (l.tenant || "").toLowerCase().includes(search.toLowerCase()) ||
      (l.address || "").toLowerCase().includes(search.toLowerCase())
    )
    .filter(l => {
      const rent = parseInt((l.rent || "0").replace(/[^0-9]/g, ""));
      return (minRent === "" || rent >= parseInt(minRent)) && (maxRent === "" || rent <= parseInt(maxRent));
    })
    .sort((a, b) =>
      sortOrder === "newest"
        ? new Date(b.created_at || 0) - new Date(a.created_at || 0)
        : new Date(a.created_at || 0) - new Date(b.created_at || 0)
    );

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="loading-screen"><div className="loader-ring" /><span>Loading your leases…</span></div>
      </>
    );
  }

  const totalRent = leases.reduce((sum, l) => sum + parseInt((l.rent || "0").replace(/[^0-9]/g, "")), 0);

  return (
    <>
      <style>{styles}</style>
      <div className="dashboard-root">

        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">🏠</div>
            <span className="sidebar-logo-text">Lease<span>Gen</span></span>
          </div>
          <div className="sidebar-label">Navigation</div>
          <nav className="sidebar-nav">
            <button className="sidebar-btn active" onClick={() => navigate("/dashboard")}>
              <span className="btn-icon">▤</span> Dashboard
            </button>
            <button className="sidebar-btn" onClick={() => navigate("/create")}>
              <span className="btn-icon">＋</span> Create Lease
            </button>
          </nav>
          <div className="sidebar-footer">
            <button className="sidebar-btn" style={{ color: "#dc2626" }} onClick={() => { localStorage.removeItem("token"); navigate("/"); }}>
              <span className="btn-icon">↩</span> Logout
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <main className="main">

          <div className="topbar">
            <div className="topbar-title">Your <span>Leases</span></div>
            <div className="topbar-sub">Manage, edit, and track your properties with ease.</div>
          </div>

          {/* STATS */}
          <div className="stats-bar">
            <div className="stat-card">
              <div className="stat-icon s1">📄</div>
              <div><div className="stat-label">Total Leases</div><div className="stat-value">{leases.length}</div></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon s2">🔍</div>
              <div><div className="stat-label">Showing</div><div className="stat-value">{filteredLeases.length}</div></div>
            </div>
            <div className="stat-card">
              <div className="stat-icon s3">💰</div>
              <div>
                <div className="stat-label">Total Rent</div>
                <div className="stat-value gv">{Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(totalRent)}</div>
              </div>
            </div>
          </div>

          {/* FILTERS */}
          <div className="filters-bar">
            <div className="search-wrap">
              <span className="search-icon">⌕</span>
              <input type="text" className="search-input" placeholder="Search tenant or address…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="filter-group">
              <input type="number" className="filter-input" placeholder="Min Rent" value={minRent} onChange={e => setMinRent(e.target.value)} />
              <input type="number" className="filter-input" placeholder="Max Rent" value={maxRent} onChange={e => setMaxRent(e.target.value)} />
              <select className="filter-select" value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
              <button className="reset-btn" onClick={() => { setSearch(""); setMinRent(""); setMaxRent(""); }}>↺ Reset</button>
            </div>
          </div>

          {/* GRID */}
          <div className="leases-grid">
            {filteredLeases.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🗂</div>
                <div className="empty-title">No leases found</div>
                <div className="empty-sub">Try adjusting your filters or create a new lease.</div>
              </div>
            ) : (
              filteredLeases.map(lease => {
                const rentValue = parseInt((lease.rent || "0").replace(/[^0-9]/g, ""));
                return (
                  <div key={lease.id} className="lease-card">
                    <div className="card-badge">✦ Active Lease</div>
                    <div className="card-tenant">{lease.tenant}</div>
                    <div className="card-meta">
                      <div className="card-meta-row"><span className="card-meta-icon">📍</span><span>{lease.address}</span></div>
                      <div className="card-meta-row">
                        <span className="card-meta-icon">💵</span>
                        <span><span className="rent-amount">{Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(rentValue)}</span><span className="rent-period">/mo</span></span>
                      </div>
                    </div>
                    <div className="divider" />
                    <div className="card-actions">
                      <a href={`http://127.0.0.1:5000/generated_pdfs/${lease.pdf_file}`} target="_blank" rel="noreferrer" className="action-btn btn-view">↗ View PDF</a>
                      <button className="action-btn btn-edit" onClick={() => navigate(`/lease/${lease.id}`)}>✎ Edit</button>
                      <button className="action-btn btn-delete" onClick={() => deleteLease(lease.id)}>✕ Delete</button>
                      <button className="action-btn btn-dupe" onClick={() => duplicateLease(lease.id)}>⧉ Duplicate</button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </main>
      </div>
    </>
  );
}

export default Dashboard;