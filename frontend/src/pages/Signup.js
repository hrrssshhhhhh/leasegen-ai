import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
  --muted:#78716c;
}
body{font-family:'DM Sans',sans-serif;background:var(--bg)}

.su-page{min-height:100vh;display:flex;background:var(--bg)}

.su-left{
  width:44%;background:var(--surface);border-right:1px solid var(--border);
  display:flex;flex-direction:column;justify-content:space-between;
  padding:48px;position:relative;overflow:hidden;
}
.su-left::before{
  content:'';position:absolute;top:-80px;right:-80px;
  width:300px;height:300px;border-radius:50%;
  background:var(--gold-dim);border:1px solid var(--gold-border);
}
.su-left::after{
  content:'';position:absolute;bottom:-60px;left:-60px;
  width:200px;height:200px;border-radius:50%;
  background:var(--gold-dim);border:1px solid var(--gold-border);
}

.su-logo{display:flex;align-items:center;gap:10px;position:relative;z-index:1}
.su-logo-icon{
  width:38px;height:38px;background:var(--gold-dim);
  border:1.5px solid var(--gold-border);border-radius:10px;
  display:flex;align-items:center;justify-content:center;font-size:18px;
}
.su-logo-text{font-family:'Playfair Display',serif;font-size:18px;font-weight:700;color:var(--text)}
.su-logo-text span{color:var(--gold-light)}

.su-brand{position:relative;z-index:1}
.su-brand-title{font-family:'Playfair Display',serif;font-size:34px;font-weight:700;color:var(--text);line-height:1.2;margin-bottom:12px}
.su-brand-title span{color:var(--gold-light)}
.su-brand-sub{font-size:14px;color:var(--muted);line-height:1.7;font-weight:300;max-width:280px}

.su-features{display:flex;flex-direction:column;gap:12px;position:relative;z-index:1}
.su-feature{display:flex;align-items:center;gap:12px;padding:12px 14px;background:var(--bg);border:1px solid var(--border);border-radius:12px}
.su-feature-icon{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:15px;flex-shrink:0}
.f1{background:#fef3c7;border:1px solid #fde68a}
.f2{background:#dbeafe;border:1px solid #bfdbfe}
.f3{background:#d1fae5;border:1px solid #a7f3d0}
.su-feature-text{font-size:12px;font-weight:500;color:var(--muted)}
.su-feature-text strong{display:block;font-size:13px;color:var(--text);font-weight:600;margin-bottom:1px}

.su-right{flex:1;display:flex;align-items:center;justify-content:center;padding:48px 40px}
.su-card{width:100%;max-width:400px}

.su-card-header{margin-bottom:30px}
.su-card-title{font-family:'Playfair Display',serif;font-size:28px;font-weight:700;color:var(--text);line-height:1.15;margin-bottom:7px}
.su-card-title span{color:var(--gold-light)}
.su-card-sub{font-size:13px;color:var(--muted);font-weight:300}

.su-form{display:flex;flex-direction:column;gap:14px;margin-bottom:20px}
.su-field{display:flex;flex-direction:column;gap:6px}
.su-field label{font-size:10px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}
.su-input{
  width:100%;padding:11px 14px;
  background:var(--bg);border:1px solid var(--border);
  border-radius:10px;color:var(--text);
  font-family:'DM Sans',sans-serif;font-size:14px;outline:none;
  transition:border-color .2s,box-shadow .2s;
}
.su-input:focus{border-color:var(--gold-light);box-shadow:0 0 0 3px var(--gold-dim)}
.su-input::placeholder{color:var(--muted)}

.su-btn{
  width:100%;padding:13px;
  background:var(--gold-light);color:#fff;
  border:none;border-radius:10px;
  font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;
  cursor:pointer;transition:all .2s;letter-spacing:.02em;margin-top:4px;
}
.su-btn:hover{background:var(--gold);box-shadow:0 4px 16px rgba(184,134,42,.25);transform:translateY(-1px)}
.su-btn:active{transform:translateY(0)}

.su-divider{display:flex;align-items:center;gap:12px;margin:6px 0}
.su-divider-line{flex:1;height:1px;background:var(--border)}
.su-divider-text{font-size:11px;color:var(--muted);white-space:nowrap}

.su-footer{text-align:center;font-size:13px;color:var(--muted);margin-top:16px}
.su-footer a{color:var(--gold-light);font-weight:600;cursor:pointer;text-decoration:none}
.su-footer a:hover{color:var(--gold)}

.su-terms{margin-top:24px;padding-top:20px;border-top:1px solid var(--border);font-size:11px;color:var(--muted);text-align:center;line-height:1.6}
`;

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) { alert("Signup successful 🎉"); navigate("/"); }
      else alert(data.error || "Signup failed");
    } catch (err) {
      console.error(err);
      alert("Error signing up");
    }
  };

  return (
    <>
      <style>{S}</style>
      <div className="su-page">

        {/* LEFT — Branding */}
        <div className="su-left">
          <div className="su-logo">
            <div className="su-logo-icon">🏠</div>
            <span className="su-logo-text">Lease<span>Gen</span></span>
          </div>

          <div className="su-brand">
            <div className="su-brand-title">Lease agreements,<br /><span>simplified.</span></div>
            <div className="su-brand-sub">Generate professional lease documents in minutes. No legal background required.</div>
          </div>

          <div className="su-features">
            <div className="su-feature">
              <div className="su-feature-icon f1">⚡</div>
              <div className="su-feature-text"><strong>Instant Generation</strong>AI-powered lease drafting in seconds</div>
            </div>
            <div className="su-feature">
              <div className="su-feature-icon f2">📄</div>
              <div className="su-feature-text"><strong>PDF Export</strong>Download ready-to-sign documents</div>
            </div>
            <div className="su-feature">
              <div className="su-feature-icon f3">🔒</div>
              <div className="su-feature-text"><strong>Secure Storage</strong>All leases saved to your account</div>
            </div>
          </div>
        </div>

        {/* RIGHT — Form */}
        <div className="su-right">
          <div className="su-card">
            <div className="su-card-header">
              <div className="su-card-title">Create your <span>account</span></div>
              <div className="su-card-sub">Get started for free — no credit card required.</div>
            </div>

            <div className="su-form">
              <div className="su-field">
                <label>Email Address</label>
                <input className="su-input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div className="su-field">
                <label>Password</label>
                <input className="su-input" type="password" placeholder="Create a strong password" value={password} onChange={e => setPassword(e.target.value)} />
              </div>
              <button className="su-btn" onClick={handleSignup}>Create Account →</button>
            </div>

            <div className="su-divider">
              <div className="su-divider-line" />
              <span className="su-divider-text">already a member?</span>
              <div className="su-divider-line" />
            </div>

            <div className="su-footer">
              <a onClick={() => navigate("/")}>Sign in to your account →</a>
            </div>

            <div className="su-terms">
              By creating an account you agree to our Terms of Service and Privacy Policy.
            </div>
          </div>
        </div>

      </div>
    </>
  );
}

export default Signup;