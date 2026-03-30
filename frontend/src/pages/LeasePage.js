import { useState, useEffect } from "react";
import buildLease from "../builder/buildLease";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
/* ================= MAIN APP ================= */

function LeasePage() {

    const navigate = useNavigate();
  
    const [form, setForm] = useState({
      landlord: "",
      tenant: "",
      address: "",
      rent: "",
      deposit: "",
      state: "Florida",
  
      leaseTerm: "",
      startDate: "",
      endDate: "",
  
      petsAllowed: false,
      utilitiesIncluded: false,
      furnished: false,
      parking: false,
  
      maintenance: true,
      lateFees: true,
      landlordEntry: true,
      tenantEntry: true
  
      
    });
    
    const { id } = useParams();
    const isEdit = id !== undefined;
    const [lease, setLease] = useState("");
    const [pdf, setPdf] = useState("");
    const [loading, setLoading] = useState(false);
  
    /* ================= STYLES ================= */
  
    const fieldStyle = {
      width: "100%",
      padding: "12px",
      marginTop: "6px",
      marginBottom: "16px",
      borderRadius: "6px",
      border: "1px solid #d1d5db",
      fontSize: "14px"
    };
  
    /* ================= HELPERS ================= */
  
    const formatCurrency = (value) => {
      const digits = value.replace(/\D/g, "");
      if (!digits) return "";
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0
      }).format(digits);
    };
  
    const handleChange = (e) => {
      let value = e.target.value;
  
      if (e.target.name === "rent" || e.target.name === "deposit") {
        value = formatCurrency(value);
      }
  
      setForm((prev) => ({
        ...prev,
        [e.target.name]: value
      }));
    };
  
    const handleToggle = (field) => {
      setForm((prev) => ({
        ...prev,
        [field]: !prev[field]
      }));
    };
  
    /* ================= GENERATE ================= */
  
    const generateLease = async () => {
      try {
  
        if (
          !form.landlord ||
          !form.tenant ||
          !form.address ||
          !form.rent ||
          !form.startDate ||
          !form.endDate
        ) {
          alert("Please fill all required fields including dates 📅");
          return;
        }
  
        setLoading(true);
  
        const leaseText = buildLease(form);
  
        const res = await fetch("http://127.0.0.1:5000/generate-pdf", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ lease: leaseText })
        });
  
        const data = await res.json();
  
        setLease(leaseText);
        setPdf(data.pdf);
  
      } catch (err) {
        console.error(err);
        alert("Failed to generate lease");
      } finally {
        setLoading(false);
      }
    };
  
    /* ================= SAVE ================= */
  
    const saveLease = async () => {
      try {
        const user_id = localStorage.getItem("user_id"); // 🔥 get logged user

        const res = await fetch("http://127.0.0.1:5000/save-lease", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            user_id: user_id,
            landlord: form.landlord,
            tenant: form.tenant,
            address: form.address,
            rent: form.rent,
            lease_text: lease,
            pdf_file: pdf
          })
        });
  
        const data = await res.json();
        alert(data.message);
  
      } catch (err) {
        console.error(err);
        alert("Failed to save lease");
      }
    };
  
    // CREATE or UPDATE
    const handleSubmit = async () => {
      try {
  
        if (!form.tenant || !form.landlord) {
          alert("Tenant and landlord are required");
          return;
        }
  
        console.log("BUTTON CLICKED");
    
        const leaseText = buildLease(form);
    
        // 🔥 AUTO GENERATE PDF EVERY TIME
        const pdfRes = await fetch("http://127.0.0.1:5000/generate-pdf", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ lease: leaseText })
        });
    
        const pdfData = await pdfRes.json();
    
        const url = isEdit
          ? `http://127.0.0.1:5000/update-lease/${id}`
          : `http://127.0.0.1:5000/save-lease`;
    
        const method = isEdit ? "PUT" : "POST";
        
        const user_id = localStorage.getItem("user_id"); // 🔥 get logged user

        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...form,
            user_id: user_id,
            lease: leaseText,
            pdf_file: pdfData.pdf
          }),
        });
        
        const data = await res.json();
        
        if (res.ok) {
          alert(isEdit ? "Lease Updated!" : "Lease Saved!");
          navigate("/dashboard");
        } else {
          alert(data.error || "Error saving lease");
        }
    
      } catch (err) {
        console.error(err);
        alert("Error saving lease");
      }
    };
  
    /* ================= AUTO END DATE ================= */
  
    useEffect(() => {
      if (form.startDate && form.leaseTerm) {
        const start = new Date(form.startDate);
        const end = new Date(start);
        end.setMonth(end.getMonth() + parseInt(form.leaseTerm));
  
        setForm((prev) => ({
          ...prev,
          endDate: end.toISOString().split("T")[0]
        }));
      }
    }, [form.startDate, form.leaseTerm]);
    
    // ✅ ADD THIS RIGHT HERE (EDIT PREFILL)
    useEffect(() => {
      if (isEdit) {
        console.log("EDIT MODE ID:", id);
  
        fetch(`http://127.0.0.1:5000/lease/${id}`)
          .then(res => res.json())
          .then(data => {
          console.log("DATA:", data);
  
            setForm({
              landlord: data.landlord || "",
              tenant: data.tenant || "",
              address: data.address || "",
              rent: data.rent || "",
              deposit: data.deposit || "",
              state: data.state || "Florida",
  
              leaseTerm: data.leaseTerm || "",
              startDate: data.startDate || "",
              endDate: data.endDate || "",
  
              petsAllowed: data.petsAllowed || false,
              utilitiesIncluded: data.utilitiesIncluded || false,
              furnished: data.furnished || false,
              parking: data.parking || false,
  
              maintenance: data.maintenance ?? true,
              lateFees: data.lateFees ?? true,
              landlordEntry: data.landlordEntry ?? true,
              tenantEntry: data.tenantEntry ?? true,
            });
          });
      }
    }, [id]);
  
    /* ================= UI ================= */
  
    return (
      <div style={{ display: "flex", height: "100vh", fontFamily: "Arial" }}>
  
        {/* LEFT PANEL */}
        <div style={{
          width: "40%",
          padding: "40px",
          borderRight: "1px solid #ddd",
          overflow: "auto"
        }}>
  
          <h2>{isEdit ? "Edit Lease" : "Create Lease"}</h2>
  
          <label>Landlord</label>
          <input name="landlord" value={form.landlord} onChange={handleChange} style={fieldStyle} />
  
          <label>Tenant</label>
          <input name="tenant" value={form.tenant} onChange={handleChange} style={fieldStyle} />
  
          <label>Property Address</label>
          <input name="address" value={form.address} onChange={handleChange} style={fieldStyle} />
  
          <label>Monthly Rent</label>
          <input name="rent" value={form.rent} onChange={handleChange} style={fieldStyle} />
  
          <label>Security Deposit</label>
          <input name="deposit" value={form.deposit} onChange={handleChange} style={fieldStyle} />
  
          <label>Lease Term (Months)</label>
          <input name="leaseTerm" value={form.leaseTerm} onChange={handleChange} style={fieldStyle} />
  
          <label>Lease Start Date</label>
          <input type="date" name="startDate" value={form.startDate} onChange={handleChange} style={fieldStyle} />
  
          <label>Lease End Date</label>
          <input type="date" value={form.endDate} style={fieldStyle} readOnly />
  
          {/* OPTIONS */}
          <h3>Options</h3>
  
          <label><input type="checkbox" checked={form.petsAllowed} onChange={() => handleToggle("petsAllowed")} /> Pets Allowed</label><br/>
          <label><input type="checkbox" checked={form.utilitiesIncluded} onChange={() => handleToggle("utilitiesIncluded")} /> Utilities Included</label><br/>
          <label><input type="checkbox" checked={form.furnished} onChange={() => handleToggle("furnished")} /> Furnished</label><br/>
          <label><input type="checkbox" checked={form.parking} onChange={() => handleToggle("parking")} /> Parking</label>
  
          <button
          onClick={generateLease}
          disabled={
            loading ||
            !form.tenant ||
            !form.landlord ||
            !form.address ||
            !form.rent ||
            !form.startDate ||
            !form.endDate
          }
          style={{
            marginTop: "20px",
            padding: "14px",
            width: "100%",
            background:
              loading ||
              !form.tenant ||
              !form.landlord ||
              !form.address ||
              !form.rent ||
              !form.startDate ||
              !form.endDate
                ? "#94a3b8"
                : "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          {loading ? "Generating..." : "Generate Lease"}
        </button>
  
        </div>
  
        {/* RIGHT PANEL */}
        <div style={{
          width: "60%",
          padding: "40px",
          background: "#f8fafc",
          overflow: "auto"
        }}>
  
        <h2>Lease Preview</h2>
  
        <div style={{
          background: "white",
          padding: "30px",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          whiteSpace: "pre-wrap",
          lineHeight: 1.6
        }}>
          {buildLease(form)}
        </div>
  
        {/* PDF LINK */}
        {pdf && (
          <div style={{ marginTop: "20px" }}>
            <a
              href={`http://127.0.0.1:5000/generated_pdfs/${pdf}`}
              target="_blank"
              rel="noreferrer"
              style={{ color: "#2563eb", fontWeight: "500" }}
            >
              Download Lease PDF
            </a>
          </div>
        )}
  
        {/* ✅ ALWAYS SHOW BUTTON */}
        <button
          onClick={handleSubmit}
          style={{
            marginTop: "10px",
            padding: "12px",
            width: "100%",
            background: isEdit ? "#2563eb" : "#16a34a",
            color: "white",
            cursor: "pointer"
          }}
        >
          {isEdit ? "Update Lease" : "Save Lease"}
        </button>
  
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            marginTop: "20px",
            padding: "10px",
            background: "#111",
            color: "white",
            borderRadius: "6px"
          }}
        >
          View Saved Leases
        </button>
  
      </div>
          </div>
        );
      }
  
export default LeasePage;     