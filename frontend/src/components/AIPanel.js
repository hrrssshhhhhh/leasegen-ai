import { useState, useRef, useEffect } from "react";

const S = `
.ai-panel{
  position:fixed;top:0;right:0;bottom:0;width:400px;
  background:#ffffff;border-left:1px solid rgba(0,0,0,0.08);
  display:flex;flex-direction:column;z-index:100;
  box-shadow:-4px 0 24px rgba(0,0,0,0.08);
  font-family:'DM Sans',sans-serif;
  transform:translateX(0);transition:transform .3s ease;
}
.ai-panel.hidden{transform:translateX(100%)}
.ai-panel-hdr{
  padding:20px 22px 16px;border-bottom:1px solid rgba(0,0,0,0.08);
  display:flex;align-items:center;justify-content:space-between;flex-shrink:0;
}
.ai-panel-title{font-family:'Playfair Display',serif;font-size:18px;font-weight:700;color:#1c1917}
.ai-panel-badge{
  display:inline-flex;align-items:center;gap:4px;padding:2px 9px;
  background:rgba(184,134,42,0.09);border:1px solid rgba(184,134,42,0.22);
  border-radius:20px;font-size:10px;font-weight:600;color:#c9952f;
  letter-spacing:.06em;text-transform:uppercase;margin-left:8px;
}
.ai-close{
  width:30px;height:30px;border-radius:8px;border:1px solid rgba(0,0,0,0.08);
  background:#f5f3ef;color:#78716c;font-size:16px;
  cursor:pointer;display:flex;align-items:center;justify-content:center;
  transition:all .2s;flex-shrink:0;
}
.ai-close:hover{background:#f0ede8;color:#1c1917}
.ai-tabs{display:flex;gap:0;border-bottom:1px solid rgba(0,0,0,0.08);flex-shrink:0}
.ai-tab{
  flex:1;padding:11px 8px;border:none;background:none;
  font-family:'DM Sans',sans-serif;font-size:12px;font-weight:500;
  color:#78716c;cursor:pointer;transition:all .2s;border-bottom:2px solid transparent;
  display:flex;align-items:center;justify-content:center;gap:5px;
}
.ai-tab:hover{color:#1c1917;background:#f5f3ef}
.ai-tab.active{color:#c9952f;border-bottom-color:#c9952f;font-weight:600;background:rgba(184,134,42,0.04)}
.ai-body{flex:1;overflow-y:auto;padding:18px;scrollbar-width:thin;scrollbar-color:#f0ede8 transparent}
.ai-label{font-size:10px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#78716c;margin-bottom:6px;display:block}
.ai-textarea{
  width:100%;padding:11px 13px;background:#f5f3ef;border:1px solid rgba(0,0,0,0.08);
  border-radius:10px;color:#1c1917;font-family:'DM Sans',sans-serif;font-size:13px;
  outline:none;resize:vertical;min-height:100px;line-height:1.6;
  transition:border-color .2s,box-shadow .2s;
}
.ai-textarea:focus{border-color:#c9952f;box-shadow:0 0 0 3px rgba(184,134,42,0.09)}
.ai-textarea::placeholder{color:#78716c}
.ai-input{
  width:100%;padding:9px 13px;background:#f5f3ef;border:1px solid rgba(0,0,0,0.08);
  border-radius:10px;color:#1c1917;font-family:'DM Sans',sans-serif;font-size:13px;
  outline:none;transition:border-color .2s,box-shadow .2s;
  text-transform:uppercase;letter-spacing:.04em;font-weight:600;
}
.ai-input:focus{border-color:#c9952f;box-shadow:0 0 0 3px rgba(184,134,42,0.09)}
.ai-input::placeholder{color:#a8a29e;font-weight:400;text-transform:none;letter-spacing:0}
.ai-title-wrap{margin-top:12px;padding:12px;background:#fffbeb;border:1px solid #fde68a;border-radius:10px}
.ai-title-hint{font-size:11px;color:#92400e;margin-bottom:8px;font-weight:500;display:flex;align-items:center;justify-content:space-between}
.ai-title-suggested{font-size:10px;color:#b45309;background:#fef3c7;padding:2px 8px;border-radius:10px;font-weight:600}
.ai-btn{
  width:100%;padding:11px;border-radius:10px;border:none;
  font-family:'DM Sans',sans-serif;font-size:13px;font-weight:600;
  cursor:pointer;transition:all .2s;margin-top:10px;letter-spacing:.02em;
}
.ai-btn.primary{background:#c9952f;color:#fff}
.ai-btn.primary:hover{background:#b8862a;box-shadow:0 4px 14px rgba(184,134,42,.25);transform:translateY(-1px)}
.ai-btn.primary:disabled{background:#f0ede8;color:#78716c;cursor:not-allowed;transform:none;box-shadow:none}
.ai-result{
  margin-top:14px;padding:14px;background:#f5f3ef;
  border:1px solid rgba(0,0,0,0.08);border-radius:10px;
  font-size:13px;color:#44403c;line-height:1.7;
  border-left:3px solid #c9952f;
}
.ai-result-hdr{font-size:10px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#c9952f;margin-bottom:8px}
.ai-result-actions{display:flex;gap:8px;margin-top:10px}
.ai-action-btn{
  flex:1;padding:8px 12px;border-radius:8px;border:none;
  font-family:'DM Sans',sans-serif;font-size:12px;font-weight:600;
  cursor:pointer;transition:all .2s;
}
.ai-action-btn.add{background:#c9952f;color:#fff}
.ai-action-btn.add:hover{background:#b8862a;transform:translateY(-1px)}
.ai-action-btn.add.done{background:#16a34a;cursor:default;transform:none}
.ai-action-btn.add:disabled{background:#f0ede8;color:#78716c;cursor:not-allowed}
.ai-action-btn.copy{background:#f0ede8;color:#44403c;border:1px solid rgba(0,0,0,0.08)}
.ai-action-btn.copy:hover{background:#e8e4de}
.ai-score-wrap{display:flex;align-items:center;gap:14px;margin-bottom:16px;padding:14px;background:#f5f3ef;border-radius:10px;border:1px solid rgba(0,0,0,0.08)}
.ai-score-num{font-size:36px;font-weight:700;color:#c9952f;letter-spacing:-0.03em;line-height:1}
.ai-score-lbl{font-size:11px;color:#78716c}
.ai-score-bar{flex:1;height:6px;background:rgba(0,0,0,0.08);border-radius:3px;overflow:hidden;margin-top:6px}
.ai-score-fill{height:100%;background:linear-gradient(90deg,#c9952f,#b8862a);border-radius:3px;transition:width .6s ease}
.ai-section{margin-bottom:14px}
.ai-section-title{font-size:11px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:#78716c;margin-bottom:8px;display:flex;align-items:center;gap:6px}
.ai-list{display:flex;flex-direction:column;gap:6px}
.ai-list-item{padding:9px 12px;border-radius:8px;font-size:12px;line-height:1.5;display:flex;align-items:flex-start;gap:8px}
.ai-list-item.issue{background:#fef2f2;border:1px solid #fecaca;color:#7f1d1d}
.ai-list-item.strength{background:#f0fdf4;border:1px solid #bbf7d0;color:#14532d}
.ai-list-item.suggestion{background:#eff6ff;border:1px solid #bfdbfe;color:#1e3a5f}
.ai-item-dot{width:5px;height:5px;border-radius:50%;margin-top:5px;flex-shrink:0}
.issue .ai-item-dot{background:#dc2626}
.strength .ai-item-dot{background:#16a34a}
.suggestion .ai-item-dot{background:#2563eb}
.ai-summary{padding:12px 14px;background:#f5f3ef;border-radius:10px;border-left:3px solid #c9952f;font-size:13px;color:#44403c;line-height:1.7;margin-bottom:14px}
.ai-chat-wrap{display:flex;flex-direction:column;height:100%}
.ai-chat-msgs{display:flex;flex-direction:column;gap:12px;flex:1;overflow-y:auto;margin-bottom:14px;scrollbar-width:thin;scrollbar-color:#f0ede8 transparent}
.ai-msg{max-width:88%;padding:10px 13px;border-radius:12px;font-size:13px;line-height:1.6}
.ai-msg.user{align-self:flex-end;background:#c9952f;color:#fff;border-bottom-right-radius:4px}
.ai-msg.assistant{align-self:flex-start;background:#f5f3ef;color:#1c1917;border:1px solid rgba(0,0,0,0.08);border-bottom-left-radius:4px}
.ai-msg.typing{color:#78716c;font-style:italic}
.ai-chat-input-wrap{display:flex;gap:8px;align-items:flex-end;flex-shrink:0;padding-top:10px;border-top:1px solid rgba(0,0,0,0.08)}
.ai-chat-input{flex:1;padding:10px 13px;background:#f5f3ef;border:1px solid rgba(0,0,0,0.08);border-radius:10px;color:#1c1917;font-family:'DM Sans',sans-serif;font-size:13px;outline:none;resize:none;min-height:42px;max-height:100px;line-height:1.5;transition:border-color .2s}
.ai-chat-input:focus{border-color:#c9952f;box-shadow:0 0 0 3px rgba(184,134,42,0.09)}
.ai-chat-send{width:38px;height:38px;border-radius:10px;border:none;background:#c9952f;color:#fff;font-size:16px;cursor:pointer;transition:all .2s;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.ai-chat-send:hover{background:#b8862a;transform:translateY(-1px)}
.ai-chat-send:disabled{background:#f0ede8;color:#78716c;cursor:not-allowed;transform:none}
.ai-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:40px 20px;text-align:center;color:#78716c}
.ai-empty-icon{font-size:28px}
.ai-empty-title{font-size:13px;font-weight:600;color:#1c1917}
.ai-empty-sub{font-size:12px}
.ai-spinner{display:inline-block;width:14px;height:14px;border:2px solid rgba(255,255,255,.3);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;margin-right:6px}
.ai-spinner-gold{display:inline-block;width:10px;height:10px;border:1.5px solid rgba(184,134,42,.3);border-top-color:#c9952f;border-radius:50%;animation:spin .7s linear infinite;margin-right:5px}
@keyframes spin{to{transform:rotate(360deg)}}
.ai-quick-btns{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px;flex-shrink:0}
.ai-quick-btn{padding:5px 11px;background:#f5f3ef;border:1px solid rgba(0,0,0,0.08);border-radius:20px;font-family:'DM Sans',sans-serif;font-size:11px;color:#44403c;cursor:pointer;transition:all .2s}
.ai-quick-btn:hover{background:rgba(184,134,42,0.09);border-color:rgba(184,134,42,0.22);color:#c9952f}
`;

import API from "../config";
function getToken() { return localStorage.getItem("token"); }

// ── TAB 1: Clause Enhancer ──────────────────────────────
function EnhanceTab({ onAddClause }) {
  const [clause, setClause] = useState("");
  const [result, setResult] = useState("");
  const [title, setTitle] = useState("");
  const [titleLoading, setTitleLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const [copied, setCopied] = useState(false);

  const enhance = async () => {
    if (!clause.trim()) return;
    setLoading(true);
    setResult("");
    setTitle("");
    setAdded(false);
    try {
      // Step 1 — enhance the clause
      const res = await fetch(`${API}/ai/enhance-clause`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ clause }),
      });
      const data = await res.json();

      if (res.ok) {
        setResult(data.enhanced_clause);

        // Step 2 — auto-suggest a title based on enhanced clause
        setTitleLoading(true);
        try {
          const titleRes = await fetch(`${API}/ai/suggest-title`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
            body: JSON.stringify({ clause: data.enhanced_clause }),
          });
          const titleData = await titleRes.json();
          if (titleRes.ok) setTitle(titleData.title);
        } catch {
          // title suggestion failed silently — user can still type manually
        }
        setTitleLoading(false);
      } else {
        setResult("Error: " + (data.error || "Something went wrong"));
      }
    } catch {
      setResult("Could not connect to AI. Is the backend running?");
    }
    setLoading(false);
  };

  const handleAdd = () => {
    if (!title.trim() || !result) return;
    onAddClause({ title: title.trim().toUpperCase(), body: result });
    setAdded(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${title.toUpperCase()}\n${result}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div style={{ marginBottom: 14 }}>
        <span className="ai-label">Paste a clause to improve</span>
        <textarea
          className="ai-textarea"
          placeholder="e.g. Tenant must pay rent on time or they will be evicted."
          value={clause}
          onChange={e => setClause(e.target.value)}
          rows={4}
        />
      </div>
      <button className="ai-btn primary" onClick={enhance} disabled={loading || !clause.trim()}>
        {loading ? <><span className="ai-spinner" />Enhancing…</> : "✦ Enhance Clause"}
      </button>

      {result && (
        <div className="ai-result">
          <div className="ai-result-hdr">✦ Enhanced Clause</div>
          {result}

          <div className="ai-title-wrap">
            <div className="ai-title-hint">
              <span>Section title — edit or keep AI suggestion:</span>
              {titleLoading
                ? <span className="ai-title-suggested"><span className="ai-spinner-gold" />Suggesting…</span>
                : title && <span className="ai-title-suggested">✦ AI suggested</span>
              }
            </div>
            <input
              className="ai-input"
              placeholder={titleLoading ? "Generating title…" : "e.g. RENT PAYMENT POLICY"}
              value={title}
              onChange={e => setTitle(e.target.value)}
              disabled={titleLoading}
            />
          </div>

          <div className="ai-result-actions">
            <button
              className={`ai-action-btn add${added ? " done" : ""}`}
              onClick={handleAdd}
              disabled={added || !title.trim() || titleLoading}
            >
              {added ? "✓ Added to Lease!" : "✦ Add to Lease"}
            </button>
            <button className="ai-action-btn copy" onClick={handleCopy}>
              {copied ? "✓ Copied" : "Copy"}
            </button>
          </div>
        </div>
      )}

      {!result && !loading && (
        <div className="ai-empty" style={{ padding: "30px 0" }}>
          <div className="ai-empty-icon">⚖️</div>
          <div className="ai-empty-title">Clause Enhancer</div>
          <div className="ai-empty-sub">Paste any clause and AI will rewrite it to be legally stronger and clearer.</div>
        </div>
      )}
    </div>
  );
}

// ── TAB 2: Lease Analyzer ──────────────────────────────
function AnalyzeTab({ leaseText }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyze = async () => {
    if (!leaseText || leaseText.trim().length < 20) {
      setError("Fill in the lease form first to generate a preview.");
      return;
    }
    setLoading(true);
    setResult(null);
    setError("");
    try {
      const res = await fetch(`${API}/ai/analyze-lease`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ lease_text: leaseText }),
      });
      const data = await res.json();
      if (res.ok) setResult(data);
      else setError(data.error || "Analysis failed");
    } catch {
      setError("Could not connect to AI. Is the backend running?");
    }
    setLoading(false);
  };

  return (
    <div>
      <button className="ai-btn primary" onClick={analyze} disabled={loading}>
        {loading ? <><span className="ai-spinner" />Analyzing Lease…</> : "✦ Analyze Current Lease"}
      </button>
      {error && <div className="ai-result" style={{ borderLeftColor: "#dc2626", background: "#fef2f2", marginTop: 12 }}>{error}</div>}
      {result && (
        <div style={{ marginTop: 16 }}>
          <div className="ai-score-wrap">
            <div>
              <div className="ai-score-num">{result.score}</div>
              <div className="ai-score-lbl">/ 10 score</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: "#44403c", fontWeight: 500, marginBottom: 6 }}>Lease Strength</div>
              <div className="ai-score-bar"><div className="ai-score-fill" style={{ width: `${result.score * 10}%` }} /></div>
            </div>
          </div>
          {result.summary && <div className="ai-summary">{result.summary}</div>}
          {result.issues?.length > 0 && (
            <div className="ai-section">
              <div className="ai-section-title">⚠ Issues</div>
              <div className="ai-list">{result.issues.map((item, i) => <div key={i} className="ai-list-item issue"><div className="ai-item-dot" />{item}</div>)}</div>
            </div>
          )}
          {result.strengths?.length > 0 && (
            <div className="ai-section">
              <div className="ai-section-title">✓ Strengths</div>
              <div className="ai-list">{result.strengths.map((item, i) => <div key={i} className="ai-list-item strength"><div className="ai-item-dot" />{item}</div>)}</div>
            </div>
          )}
          {result.suggestions?.length > 0 && (
            <div className="ai-section">
              <div className="ai-section-title">💡 Suggestions</div>
              <div className="ai-list">{result.suggestions.map((item, i) => <div key={i} className="ai-list-item suggestion"><div className="ai-item-dot" />{item}</div>)}</div>
            </div>
          )}
        </div>
      )}
      {!result && !loading && !error && (
        <div className="ai-empty">
          <div className="ai-empty-icon">📊</div>
          <div className="ai-empty-title">Lease Analyzer</div>
          <div className="ai-empty-sub">Fill in the form on the left, then click Analyze to get an AI review of your lease.</div>
        </div>
      )}
    </div>
  );
}

// ── TAB 3: Chat ──────────────────────────────────────────
function ChatTab({ messages, setMessages, input, setInput, chatLoading, setChatLoading }) {
  const msgsEndRef = useRef(null);

  const quickQuestions = [
    "Can I raise rent mid-lease?",
    "How much notice to evict?",
    "Is my security deposit legal?",
    "What repairs am I responsible for?",
  ];

  useEffect(() => {
    msgsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatLoading]);

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput("");
    const newMessages = [...messages, { role: "user", content: msg }];
    setMessages(newMessages);
    setChatLoading(true);
    try {
      const history = newMessages.slice(0, -1);
      const res = await fetch(`${API}/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ message: msg, history }),
      });
      const data = await res.json();
      if (res.ok) setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
      else setMessages(prev => [...prev, { role: "assistant", content: "Error: " + (data.error || "Something went wrong") }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Could not connect to AI. Is the backend running?" }]);
    }
    setChatLoading(false);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <div className="ai-chat-wrap">
      <div className="ai-quick-btns">
        {quickQuestions.map((q, i) => (
          <button key={i} className="ai-quick-btn" onClick={() => send(q)}>{q}</button>
        ))}
      </div>
      <div className="ai-chat-msgs">
        {messages.map((msg, i) => (
          <div key={i} className={`ai-msg ${msg.role}`}>{msg.content}</div>
        ))}
        {chatLoading && <div className="ai-msg assistant typing">LeaseGen AI is thinking…</div>}
        <div ref={msgsEndRef} />
      </div>
      <div className="ai-chat-input-wrap">
        <textarea
          className="ai-chat-input"
          placeholder="Ask about rental law…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          rows={1}
        />
        <button className="ai-chat-send" onClick={() => send()} disabled={chatLoading || !input.trim()}>↑</button>
      </div>
    </div>
  );
}

// ── MAIN PANEL ──────────────────────────────────────────
function AIPanel({ open, onClose, leaseText, onAddClause }) {
  const [tab, setTab] = useState("enhance");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm LeaseGen AI. Ask me anything about rental law, lease clauses, or tenant management." }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  return (
    <>
      <style>{S}</style>
      <div className={`ai-panel${open ? "" : " hidden"}`}>
        <div className="ai-panel-hdr">
          <div>
            <span className="ai-panel-title">LeaseGen</span>
            <span className="ai-panel-badge">✦ AI</span>
          </div>
          <button className="ai-close" onClick={onClose}>✕</button>
        </div>

        <div className="ai-tabs">
          <button className={`ai-tab${tab === "enhance" ? " active" : ""}`} onClick={() => setTab("enhance")}>⚖️ Enhance</button>
          <button className={`ai-tab${tab === "analyze" ? " active" : ""}`} onClick={() => setTab("analyze")}>📊 Analyze</button>
          <button className={`ai-tab${tab === "chat" ? " active" : ""}`} onClick={() => setTab("chat")}>
            💬 Chat
            {messages.length > 1 && <span style={{
              background: "#c9952f", color: "#fff", borderRadius: "10px",
              fontSize: "10px", padding: "1px 6px", marginLeft: "4px", fontWeight: 700
            }}>{messages.length - 1}</span>}
          </button>
        </div>

        <div className="ai-body" style={tab === "chat" ? { display: "flex", flexDirection: "column", overflow: "hidden" } : {}}>
          {tab === "enhance" && <EnhanceTab onAddClause={onAddClause} />}
          {tab === "analyze" && <AnalyzeTab leaseText={leaseText} />}
          {tab === "chat" && (
            <ChatTab
              messages={messages}
              setMessages={setMessages}
              input={chatInput}
              setInput={setChatInput}
              chatLoading={chatLoading}
              setChatLoading={setChatLoading}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default AIPanel;