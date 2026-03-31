import { useState, useEffect } from "react";
import buildLease from "../builder/buildLease";
import { useParams, useNavigate } from "react-router-dom";

const S = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=DM+Sans:wght@300;400;500;600&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#f5f3ef;
  --surface:#ffffff;
  --surface2:#f0ede8;
  --border:rgba(0,0,0,0.08);
  --gold:#b8862a;
  --gold-light:#c9952f;
  --gold-dim:rgba(184,134,42,0.09);
  --gold-border:rgba(184,134,42,0.22);
  --text:#1c1917;
  --text2:#44403c;
  --muted:#78716c;
  --blue:#2563eb;
  --green:#16a34a;
  --red:#dc2626;
  --amber:#d97706;
  --radius:14px;
  --shadow:0 1px 4px rgba(0,0,0,0.06),0 4px 16px rgba(0,0,0,0.04);
}
body{font-family:'DM Sans',sans-serif;background:var(--bg);color:var(--text)}

.lp{display:flex;height:100vh;font-family:'DM Sans',sans-serif;background:var(--bg);color:var(--text);overflow:hidden}

/* LEFT */
.lp-left{width:42%;min-width:340px;display:flex;flex-direction:column;border-right:1px solid var(--border);background:var(--surface);overflow:hidden;box-shadow:1px 0 0 rgba(0,0,0,0.04)}
.lp-lhdr{padding:24px 28px 18px;border-bottom:1px solid var(--border);flex-shrink:0}
.lp-back{display:inline-flex;align-items:center;gap:6px;font-size:12px;color:var(--muted);background:none;border:none;cursor:pointer;font-family:'DM Sans',sans-serif;margin-bottom:12px;transition:color .2s;padding:0}
.lp-back:hover{color:var(--text)}
.lp-title{font-family:'Playfair Display',serif;font-size:24px;font-weight:700;color:var(--text)}
.lp-title span{color:var(--gold-light)}
.lp-sub{font-size:12px;color:var(--muted);margin-top:4px;font-weight:300}

.lp-scroll{flex:1;overflow-y:auto;padding:20px 28px 0;scrollbar-width:thin;scrollbar-color:var(--surface2) transparent}

.lp-sec{margin-bottom:22px}
.lp-sec-lbl{font-size:10px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);margin-bottom:12px;display:flex;align-items:center;gap:8px}
.lp-sec-lbl::after{content:'';flex:1;height:1px;background:var(--border)}

.g2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.fld{display:flex;flex-direction:column;gap:5px;margin-bottom:10px}
.fld label{font-size:10px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:var(--muted)}

.lp-in{width:100%;padding:9px 12px;background:var(--bg);border:1px solid var(--border);border-radius:9px;color:var(--text);font-family:'DM Sans',sans-serif;font-size:13px;outline:none;transition:border-color .2s,box-shadow .2s}
.lp-in:focus{border-color:var(--gold-light);box-shadow:0 0 0 3px var(--gold-dim)}
.lp-in::placeholder{color:var(--muted)}
.lp-in[readonly]{color:var(--muted);cursor:not-allowed;opacity:.7;background:var(--surface2)}
.lp-in[type="date"]::-webkit-calendar-picker-indicator{cursor:pointer;opacity:.5}

/* TOGGLES */
.tgrid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.tgl{display:flex;align-items:center;gap:8px;padding:10px 12px;background:var(--bg);border:1px solid var(--border);border-radius:10px;cursor:pointer;transition:all .2s;user-select:none}
.tgl:hover{border-color:rgba(0,0,0,0.14)}
.tgl.on{background:var(--gold-dim);border-color:var(--gold-border)}
.tgl-icon{font-size:14px}
.tgl-txt{font-size:11px;font-weight:500;color:var(--muted)}
.tgl.on .tgl-txt{color:var(--gold-light);font-weight:600}
.tgl-dot{width:6px;height:6px;border-radius:50%;background:var(--border);margin-left:auto;flex-shrink:0;transition:background .2s}
.tgl.on .tgl-dot{background:var(--gold-light)}

/* GENERATE BTN */
.lp-genwrap{padding:16px 28px 20px;flex-shrink:0;border-top:1px solid var(--border);background:var(--surface)}
.lp-genbtn{width:100%;padding:13px;border-radius:10px;border:none;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;cursor:pointer;transition:all .2s;background:var(--gold-light);color:#fff;letter-spacing:.02em}
.lp-genbtn:disabled{background:var(--surface2);color:var(--muted);cursor:not-allowed}
.lp-genbtn:not(:disabled):hover{background:var(--gold);transform:translateY(-1px);box-shadow:0 4px 16px rgba(184,134,42,.25)}

/* RIGHT */
.lp-right{flex:1;display:flex;flex-direction:column;background:var(--bg);overflow:hidden}
.lp-rhdr{padding:24px 32px 18px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;flex-shrink:0;background:var(--surface)}
.lp-prev-title{font-family:'Playfair Display',serif;font-size:20px;font-weight:600;color:var(--text)}
.lp-prev-badge{display:inline-flex;align-items:center;gap:4px;padding:2px 9px;background:var(--gold-dim);border:1px solid var(--gold-border);border-radius:20px;font-size:10px;font-weight:600;color:var(--gold-light);letter-spacing:.06em;text-transform:uppercase;margin-left:10px}
.lp-pdf-link{display:inline-flex;align-items:center;gap:6px;padding:7px 14px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;color:var(--blue);text-decoration:none;font-size:12px;font-weight:500;transition:all .2s}
.lp-pdf-link:hover{background:#dbeafe}

.lp-pscroll{flex:1;overflow-y:auto;padding:24px 32px;scrollbar-width:thin;scrollbar-color:var(--surface2) transparent}
.lp-doc{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:32px 36px;white-space:pre-wrap;line-height:1.8;font-size:13px;color:var(--text2);font-family:'DM Sans',sans-serif;min-height:200px;box-shadow:var(--shadow)}

.lp-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;min-height:220px;color:var(--muted);text-align:center}
.lp-empty-icon{font-size:34px}
.lp-empty-ttl{font-size:14px;font-weight:600;color:var(--text)}
.lp-empty-sub{font-size:12px}

/* ACTIONS */
.lp-actions{padding:16px 32px;border-top:1px solid var(--border);display:flex;gap:10px;flex-shrink:0;background:var(--surface)}
.lp-savebtn{flex:1;padding:12px;border-radius:10px;border:none;font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;cursor:pointer;transition:all .2s;letter-spacing:.02em}
.lp-savebtn.create{background:#f0fdf4;color:var(--green);border:1px solid #bbf7d0}
.lp-savebtn.create:hover{background:#dcfce7;box-shadow:0 2px 12px rgba(22,163,74,.15)}
.lp-savebtn.edit{background:#eff6ff;color:var(--blue);border:1px solid #bfdbfe}
.lp-savebtn.edit:hover{background:#dbeafe;box-shadow:0 2px 12px rgba(37,99,235,.15)}
`;

function Toggle({ label, icon, checked, onChange }) {
  return (
    <div className={`tgl${checked ? " on" : ""}`} onClick={onChange}>
      <span className="tgl-icon">{icon}</span>
      <span className="tgl-txt">{label}</span>
      <span className="tgl-dot" />
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="fld">
      <label>{label}</label>
      {children}
    </div>
  );
}

function LeasePage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    landlord: "", tenant: "", address: "", rent: "", deposit: "",
    state: "Florida", leaseTerm: "", startDate: "", endDate: "",
    petsAllowed: false, utilitiesIncluded: false, furnished: false, parking: false,
    maintenance: true, lateFees: true, landlordEntry: true, tenantEntry: true,
  });
  const [pdf, setPdf] = useState("");
  const [loading, setLoading] = useState(false);

  const fmt = (v) => {
    const d = v.replace(/\D/g, "");
    if (!d) return "";
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(d);
  };

  const handleChange = (e) => {
    let val = e.target.value;
    if (e.target.name === "rent" || e.target.name === "deposit") val = fmt(val);
    setForm(p => ({ ...p, [e.target.name]: val }));
  };

  const toggle = (f) => setForm(p => ({ ...p, [f]: !p[f] }));
  const valid = form.landlord && form.tenant && form.address && form.rent && form.startDate && form.endDate;

  const generateLease = async () => {
    if (!valid) return alert("Please fill all required fields 📅");
    try {
      setLoading(true);
      const res = await fetch("http://127.0.0.1:5000/generate-pdf", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lease: buildLease(form) }),
      });
      const data = await res.json();
      setPdf(data.pdf);
    } catch { alert("Failed to generate lease"); }
    finally { setLoading(false); }
  };

  const handleSubmit = async () => {
    if (!form.tenant || !form.landlord) return alert("Tenant and landlord are required");
    try {
      const leaseText = buildLease(form);
      const pdfRes = await fetch("http://127.0.0.1:5000/generate-pdf", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lease: leaseText }),
      });
      const pdfData = await pdfRes.json();
      const url = isEdit ? `http://127.0.0.1:5000/update-lease/${id}` : `http://127.0.0.1:5000/save-lease`;
      const res = await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, user_id: localStorage.getItem("user_id"), lease: leaseText, pdf_file: pdfData.pdf }),
      });
      const data = await res.json();
      if (res.ok) { alert(isEdit ? "Lease Updated!" : "Lease Saved!"); navigate("/dashboard"); }
      else alert(data.error || "Error saving lease");
    } catch { alert("Error saving lease"); }
  };

  useEffect(() => {
    if (form.startDate && form.leaseTerm) {
      const end = new Date(form.startDate);
      end.setMonth(end.getMonth() + parseInt(form.leaseTerm));
      setForm(p => ({ ...p, endDate: end.toISOString().split("T")[0] }));
    }
  }, [form.startDate, form.leaseTerm]);

  useEffect(() => {
    if (!isEdit) return;
    fetch(`http://127.0.0.1:5000/lease/${id}`).then(r => r.json()).then(d =>
      setForm({
        landlord: d.landlord||"", tenant: d.tenant||"", address: d.address||"",
        rent: d.rent||"", deposit: d.deposit||"", state: d.state||"Florida",
        leaseTerm: d.leaseTerm||"", startDate: d.startDate||"", endDate: d.endDate||"",
        petsAllowed: d.petsAllowed||false, utilitiesIncluded: d.utilitiesIncluded||false,
        furnished: d.furnished||false, parking: d.parking||false,
        maintenance: d.maintenance??true, lateFees: d.lateFees??true,
        landlordEntry: d.landlordEntry??true, tenantEntry: d.tenantEntry??true,
      })
    );
  }, [id, isEdit]);

  const preview = buildLease(form);
  const hasPreview = preview && preview.trim().length > 20;

  return (
    <>
      <style>{S}</style>
      <div className="lp">

        {/* LEFT */}
        <div className="lp-left">
          <div className="lp-lhdr">
            <button className="lp-back" onClick={() => navigate("/dashboard")}>← Back to Dashboard</button>
            <div className="lp-title">{isEdit ? <>Edit <span>Lease</span></> : <>Create <span>Lease</span></>}</div>
            <div className="lp-sub">{isEdit ? "Update details and save your changes." : "Fill in the details to generate a lease."}</div>
          </div>

          <div className="lp-scroll">

            <div className="lp-sec">
              <div className="lp-sec-lbl">Parties</div>
              <div className="g2">
                <Field label="Landlord *"><input className="lp-in" name="landlord" value={form.landlord} onChange={handleChange} placeholder="Full name" /></Field>
                <Field label="Tenant *"><input className="lp-in" name="tenant" value={form.tenant} onChange={handleChange} placeholder="Full name" /></Field>
              </div>
              <Field label="Property Address *"><input className="lp-in" name="address" value={form.address} onChange={handleChange} placeholder="Street, City, State" /></Field>
            </div>

            <div className="lp-sec">
              <div className="lp-sec-lbl">Financials</div>
              <div className="g2">
                <Field label="Monthly Rent *"><input className="lp-in" name="rent" value={form.rent} onChange={handleChange} placeholder="$0" /></Field>
                <Field label="Security Deposit"><input className="lp-in" name="deposit" value={form.deposit} onChange={handleChange} placeholder="$0" /></Field>
              </div>
            </div>

            <div className="lp-sec">
              <div className="lp-sec-lbl">Lease Term</div>
              <div className="g2">
                <Field label="Duration (Months)"><input className="lp-in" name="leaseTerm" value={form.leaseTerm} onChange={handleChange} placeholder="12" /></Field>
                <Field label="State"><input className="lp-in" name="state" value={form.state} onChange={handleChange} /></Field>
                <Field label="Start Date *"><input className="lp-in" type="date" name="startDate" value={form.startDate} onChange={handleChange} /></Field>
                <Field label="End Date (auto)"><input className="lp-in" type="date" value={form.endDate} readOnly /></Field>
              </div>
            </div>

            <div className="lp-sec">
              <div className="lp-sec-lbl">Options</div>
              <div className="tgrid">
                <Toggle label="Pets Allowed"       icon="🐾" checked={form.petsAllowed}       onChange={() => toggle("petsAllowed")} />
                <Toggle label="Utilities Included" icon="⚡" checked={form.utilitiesIncluded} onChange={() => toggle("utilitiesIncluded")} />
                <Toggle label="Furnished"           icon="🛋️" checked={form.furnished}         onChange={() => toggle("furnished")} />
                <Toggle label="Parking"             icon="🚗" checked={form.parking}           onChange={() => toggle("parking")} />
                <Toggle label="Maintenance"         icon="🔧" checked={form.maintenance}       onChange={() => toggle("maintenance")} />
                <Toggle label="Late Fees"           icon="📅" checked={form.lateFees}         onChange={() => toggle("lateFees")} />
                <Toggle label="Landlord Entry"      icon="🔑" checked={form.landlordEntry}    onChange={() => toggle("landlordEntry")} />
                <Toggle label="Tenant Entry"        icon="🚪" checked={form.tenantEntry}      onChange={() => toggle("tenantEntry")} />
              </div>
            </div>

          </div>

          <div className="lp-genwrap">
            <button className="lp-genbtn" onClick={generateLease} disabled={loading || !valid}>
              {loading ? "⏳ Generating…" : "✦ Generate Lease PDF"}
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="lp-right">
          <div className="lp-rhdr">
            <div className="lp-prev-title">
              Live Preview
              {hasPreview && <span className="lp-prev-badge">✦ Ready</span>}
            </div>
            {pdf && (
              <a href={`http://127.0.0.1:5000/generated_pdfs/${pdf}`} target="_blank" rel="noreferrer" className="lp-pdf-link">
                ↗ Download PDF
              </a>
            )}
          </div>

          <div className="lp-pscroll">
            <div className="lp-doc">
              {hasPreview ? preview : (
                <div className="lp-empty">
                  <div className="lp-empty-icon">📄</div>
                  <div className="lp-empty-ttl">Your lease will appear here</div>
                  <div className="lp-empty-sub">Fill in the form on the left to see a live preview.</div>
                </div>
              )}
            </div>
          </div>

          <div className="lp-actions">
            <button className={`lp-savebtn ${isEdit ? "edit" : "create"}`} onClick={handleSubmit}>
              {isEdit ? "✎ Update Lease" : "✓ Save Lease"}
            </button>
          </div>
        </div>

      </div>
    </>
  );
}

export default LeasePage;