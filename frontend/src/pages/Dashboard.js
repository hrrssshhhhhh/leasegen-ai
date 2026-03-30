import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [leases, setLeases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  // 🔐 LOAD LEASES (SECURE)
  useEffect(() => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      alert("Session expired");
      navigate("/");
      return;
    }
  
    fetch("http://127.0.0.1:5000/leases", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setLeases(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [navigate]);

  // 🔁 DUPLICATE
  const duplicateLease = async (id) => {
    const token = localStorage.getItem("token");

    await fetch(`http://127.0.0.1:5000/duplicate-lease/${id}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    // reload
    const res = await fetch("http://127.0.0.1:5000/leases", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();
    setLeases(data);
  };

  // 🗑 DELETE
  const deleteLease = async (id) => {
    try {
      const token = localStorage.getItem("token"); // ✅ FIX
  
      const res = await fetch(`http://127.0.0.1:5000/delete-lease/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`   // ✅ REQUIRED
        }
      });
  
      const data = await res.json();
  
      if (res.ok) {
        setLeases(prev => prev.filter(l => l.id !== id));
      } else {
        alert(data.error || "Delete failed");
      }
  
    } catch (err) {
      console.error(err);
      alert("Delete error");
    }
  };

  if (loading) {
    return <p style={{ padding: "40px" }}>Loading leases... ⏳</p>;
  }

  return (
    <div style={{ padding: "40px", background: "#f8fafc", minHeight: "100vh" }}>
      
      <h1 style={{ marginBottom: "30px" }}>📄 Your Leases</h1>

      <button
  onClick={() => {
    localStorage.removeItem("token");  // 🔥 clear session
    navigate("/");                      // 🔥 go to login
  }}
  style={{
    padding: "8px 14px",
    background: "#dc2626",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    float: "right"
  }}
>
  Logout
</button>

      <p style={{ color: "#64748b", marginBottom: "20px" }}>
      Manage, edit, and track your leases easily.
      </p>

      <button
       onClick={() => navigate("/create")}
       style={{
       marginBottom: "20px",
       padding: "10px 16px",
       background: "#2563eb",
       color: "white",
       border: "none",
       borderRadius: "6px",
       cursor: "pointer"
       }}
     >
     + Create Lease
     </button>

      <input
      type="text"
      placeholder="Search by tenant or address..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      style={{
      marginBottom: "20px",
      padding: "10px",
      width: "300px",
      borderRadius: "6px",
      border: "1px solid #ccc"
      }}
      />

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "20px"
      }}>

      {(() => {
        const filteredLeases = leases.filter(lease =>
          (lease.tenant || "").toLowerCase().includes(search.toLowerCase()) ||
          (lease.address || "").toLowerCase().includes(search.toLowerCase())
        );

        if (filteredLeases.length === 0) {
          return (
            <p style={{ color: "#555" }}>
              No leases found 🚫
            </p>
          );
        }

        return filteredLeases.map(lease => (
          <div key={lease.id} style={{
            background: "white",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.08)"
          }}>

            <h3>{lease.tenant}</h3>
            <p><b>Address:</b> {lease.address}</p>
            <p><b>Rent:</b> {lease.rent}</p>

            <div style={{
              marginTop: "15px",
              display: "flex",
              gap: "10px",
              flexWrap: "wrap"
            }}>

              <a
                href={`http://127.0.0.1:5000/generated_pdfs/${lease.pdf_file}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  padding: "6px 10px",
                  background: "#2563eb",
                  color: "white",
                  borderRadius: "6px",
                  textDecoration: "none"
                }}
              >
                View PDF
              </a>

              <button
                onClick={() => navigate(`/lease/${lease.id}`)}
                style={{
                  padding: "6px 10px",
                  background: "#f59e0b",
                  color: "white",
                  border: "none",
                  borderRadius: "6px"
                }}
              >
                Edit
              </button>

              <button
                onClick={() => deleteLease(lease.id)}
                style={{
                  padding: "6px 10px",
                  background: "#dc2626",
                  color: "white",
                  border: "none",
                  borderRadius: "6px"
                }}
              >
                Delete
              </button>

              <button
                onClick={() => duplicateLease(lease.id)}
                style={{
                  padding: "6px 10px",
                  background: "#10b981",
                  color: "white",
                  border: "none",
                  borderRadius: "6px"
                }}
              >
                Duplicate
              </button>

            </div>
          </div>
        ));
      })()}

      </div>  
    </div>    
  );
}

export default Dashboard;