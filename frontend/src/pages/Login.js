import API from "../config";
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

.lg-page{min-height:100vh;display:flex;background:var(--bg)}

.lg-right-panel{
  width:44%;background:var(--surface);border-left:1px solid var(--border);
  display:flex;flex-direction:column;justify-content:space-between;
  padding:48px;position:relative;overflow:hidden;order:2;
}
.lg-right-panel::before{
  content:'';position:absolute;bottom:-80px;right:-80px;
  width:300px;height:300px;border-radius:50%;
  background:var(--gold-dim);border:1px solid var(--gold-border);
}
.lg-right-panel::after{
  content:'';position:absolute;top:-60px;left:-60px;
  width:200px;height:200px;border-radius:50%;
  background:var(--gold-dim);border:1px solid var(--gold-border);
}

.lg-logo{display:flex;align-items:center;gap:10px;position:relative;z-index:1}
.lg-logo-icon{
  width:38px;height:38px;background:var(--gold-dim);
  border:1.5px solid var(--gold-border);border-radius:10px;
  display:flex;align-items:center;justify-content:center;font-size:18px;
}
.lg-logo-text{font-family:'Playfair Display',serif;font-size:18px;font-weight:700;color:var(--text)}
.lg-logo-text span{color:var(--gold-light)}

.lg-brand{position:relative;z-index:1}
.lg-brand-title{font-family:'Playfair Display',serif;font-size:34px;font-weight:700;color:var(--text);line-height:1.2;margin-bottom:12px}
.lg-brand-title span{color:var(--gold-light)}
.lg-brand-sub{font-size:14px;color:var(--muted);line-height:1.7;font-weight:300;max-width:280px}

.lg-stats{display:flex;flex-direction:column;gap:12px;position:relative;z-index:1}
.lg-stat{display:flex;align-items:center;gap:14px;padding:14px 16px;background:var(--bg);border:1px solid var(--border);border-radius:12px}
.lg-stat-icon{width:36px;height:36px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0}
.s1{background:#fef3c7;border:1px solid #fde68a}
.s2{background:#dbeafe;border:1px solid #bfdbfe}
.s3{background:#f3e8ff;border:1px solid #e9d5ff}
.lg-stat-info{display:flex;flex-direction:column;gap:1px}
.lg-stat-val{font-size:16px;font-weight:700;color:var(--text);letter-spacing:-0.02em}
.lg-stat-lbl{font-size:11px;color:var(--muted);font-weight:400}

.lg-left{
  flex:1;display:flex;align-items:center;justify-content:center;
  padding:48px 40px;order:1;
}
.lg-card{width:100%;max-width:400px}

.lg-card-header{margin-bottom:30px}
.lg-card-eyebrow{
  display:inline-flex;align-items:center;gap:6px;
  padding:4px 12px;background:var(--gold-dim);border:1px solid var(--gold-border);
  border-radius:20px;font-size:10px;font-weight:600;color:var(--gold-light);
  letter-spacing:.08em;text-transform:uppercase;margin-bottom:14px;
}
.lg-card-title{font-family:'Playfair Display',serif;font-size:28px;font-weight:700;color:var(--text);line-height:1.15;margin-bottom:7px}
.lg-card-title span{color:var(--gold-light)}
.lg-card-sub{font-size:13px;color:var(--muted);font-weight:300}

.lg-form{display:flex;flex-direction:column;gap:14px;margin-bottom:20px}
.lg-field{display:flex;flex-direction:column;gap:6px}
.lg-field label{font-size:10px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}
.lg-input{
  width:100%;padding:11px 14px;
  background:var(--bg);border:1px solid var(--border);
  border-radius:10px;color:var(--text);
  font-family:'DM Sans',sans-serif;font-size:14px;outline:none;
  transition:border-color .2s,box-shadow .2s;
}
.lg-input:focus{border-color:var(--gold-light);box-shadow:0 0 0 3px var(--gold-dim)}
.lg-input::placeholder{color:var(--muted)}

.lg-btn{
  width:100%;padding:13px;
  background:var(--gold-light);color:#fff;
  border:none;border-radius:10px;
  font-family:'DM Sans',sans-serif;font-size:14px;font-weight:600;
  cursor:pointer;transition:all .2s;letter-spacing:.02em;margin-top:4px;
}
.lg-btn:hover{background:var(--gold);box-shadow:0 4px 16px rgba(184,134,42,.25);transform:translateY(-1px)}
.lg-btn:active{transform:translateY(0)}

.lg-divider{display:flex;align-items:center;gap:12px;margin:6px 0}
.lg-divider-line{flex:1;height:1px;background:var(--border)}
.lg-divider-text{font-size:11px;color:var(--muted);white-space:nowrap}

.lg-footer{text-align:center;font-size:13px;color:var(--muted);margin-top:16px}
.lg-footer-btn{background:none;border:none;color:var(--gold-light);font-weight:600;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:13px;padding:0;text-decoration:none}
.lg-footer-btn:hover{color:var(--gold)}

.lg-terms{margin-top:24px;padding-top:20px;border-top:1px solid var(--border);font-size:11px;color:var(--muted);text-align:center;line-height:1.6}
`;

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await fetch(`${API}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.user_id) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user_id", data.user_id);
        navigate("/dashboard");
      } else {
        alert(data.error || "Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <>
      <style>{S}</style>
      <div className="lg-page">

        <div className="lg-left">
          <div className="lg-card">
            <div className="lg-card-header">
              <div className="lg-card-eyebrow">✦ Welcome back</div>
              <div className="lg-card-title">Sign in to <span>LeaseGen</span></div>
              <div className="lg-card-sub">Manage your leases and properties in one place.</div>
            </div>

            <div className="lg-form">
              <div className="lg-field">
                <label>Email Address</label>
                <input
                  className="lg-input" type="email" placeholder="you@example.com"
                  value={email} onChange={e => setEmail(e.target.value)}
                />
              </div>
              <div className="lg-field">
                <label>Password</label>
                <input
                  className="lg-input" type="password" placeholder="Your password"
                  value={password} onChange={e => setPassword(e.target.value)}
                />
              </div>
              <button className="lg-btn" onClick={handleLogin}>Sign In →</button>
            </div>

            <div className="lg-divider">
              <div className="lg-divider-line" />
              <span className="lg-divider-text">new here?</span>
              <div className="lg-divider-line" />
            </div>

            <div className="lg-footer">
              <button className="lg-footer-btn" onClick={() => navigate("/signup")}>Create a free account →</button>
            </div>

            <div className="lg-terms">
              Protected by industry-standard encryption. Your data is always secure.
            </div>
          </div>
        </div>

        <div className="lg-right-panel">
          <div className="lg-logo">
            <div className="lg-logo-icon">🏠</div>
            <span className="lg-logo-text">Lease<span>Gen</span></span>
          </div>

          <div className="lg-brand">
            <div className="lg-brand-title">Your properties,<br /><span>all in one place.</span></div>
            <div className="lg-brand-sub">Track, manage, and generate lease agreements effortlessly from your personal dashboard.</div>
          </div>

          <div className="lg-stats">
            <div className="lg-stat">
              <div className="lg-stat-icon s1">⚡</div>
              <div className="lg-stat-info">
                <div className="lg-stat-val">60 sec</div>
                <div className="lg-stat-lbl">Average lease generation time</div>
              </div>
            </div>
            <div className="lg-stat">
              <div className="lg-stat-icon s2">📄</div>
              <div className="lg-stat-info">
                <div className="lg-stat-val">PDF Ready</div>
                <div className="lg-stat-lbl">Instant download after generation</div>
              </div>
            </div>
            <div className="lg-stat">
              <div className="lg-stat-icon s3">🔒</div>
              <div className="lg-stat-info">
                <div className="lg-stat-val">Secure</div>
                <div className="lg-stat-lbl">Your leases are private & encrypted</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}

export default Login;