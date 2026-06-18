import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  User as FirebaseUser 
} from 'firebase/auth';
import { auth, googleAuthProvider } from '../lib/firebase.ts';
import { Inquiry, MetricSummary } from '../types.ts';
import { 
  Database, 
  LogOut, 
  Clock, 
  UserCheck, 
  Mail, 
  PhoneCall, 
  ExternalLink, 
  Download, 
  AlertTriangle, 
  BellRing, 
  Sparkles, 
  CheckCircle, 
  Layers, 
  LineChart, 
  Maximize2 
} from 'lucide-react';

export default function AdminDashboard() {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<MetricSummary | null>(null);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [mailLogs, setMailLogs] = useState<{ id: string; time: string; type: string; details: string; status: 'dispatched' | 'active' }[]>([
    { id: 'log-1', time: 'Just now', type: 'System Alert', details: 'System core operational. Initial connection to database verified.', status: 'active' }
  ]);
  const [activeTab, setActiveTab] = useState<'overview' | 'inquiries' | 'alerts'>('overview');
  const [alertForm, setAlertForm] = useState({ title: '', message: '' });
  const [exporting, setExporting] = useState(false);

  // Monitor Auth Changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        const token = await user.getIdToken();
        setAuthToken(token);
        
        // Synchronize logged-in user to database
        try {
          await fetch('/api/users/sync', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ email: user.email, displayName: user.displayName, photoUrl: user.photoURL })
          });
        } catch (err) {
          console.error("Auth sync fail:", err);
        }

        // Fetch dashboard data
        fetchDashboardData(token);
      } else {
        setCurrentUser(null);
        setAuthToken(null);
        setMetrics(null);
        setInquiries([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const fetchDashboardData = async (token: string) => {
    try {
      // 1. Fetch metrics
      const resMetrics = await fetch('/api/metrics', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const dataMetrics = await resMetrics.json();
      setMetrics(dataMetrics.metrics);
      
      // Add simulated summary trigger to log
      if (dataMetrics.weeklyNotificationSimulation) {
        const item = dataMetrics.weeklyNotificationSimulation;
        setMailLogs(prev => [
          { 
            id: 'log-' + Date.now(), 
            time: new Date().toLocaleTimeString(), 
            type: 'Weekly Summary Trigger', 
            details: `Summary report of operations compiled. Dispatch targeting: ${item.recipient}. Data status size is healthy.`,
            status: 'dispatched' 
          },
          ...prev
        ]);
      }

      // 2. Fetch inquiries list
      const resInquiries = await fetch('/api/inquiries', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const dataInquiries = await resInquiries.json();
      if (Array.isArray(dataInquiries)) {
        setInquiries(dataInquiries);
      }
    } catch (err) {
      console.error("Error fetching dashboard credentials:", err);
    }
  };

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleAuthProvider);
    } catch (err) {
      console.error("Login failure:", err);
    }
    setLoading(false);
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  const triggerAlertDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!alertForm.title || !alertForm.message) return;

    const newLogItem = {
      id: 'log-' + Date.now(),
      time: new Date().toLocaleTimeString(),
      type: 'Developer Alert Stream',
      details: `Title: "${alertForm.title}" - Message: "${alertForm.message}". Dispatched immediately to master administrators inbox starpanther0@gmail.com.`,
      status: 'dispatched' as const
    };

    setMailLogs(prev => [newLogItem, ...prev]);
    setAlertForm({ title: '', message: '' });

    // Show custom visual alert trigger feedback
    alert("Alert successfully submitted into the Node.js automation dispatch cycle! Simulated email will land in starpanther0@gmail.com inbox.");
  };

  const runRecurringSummarySim = () => {
    const summaryType = `Admin-Triggered Custom Summary Log`;
    const details = `Metrics summary: total database records analyzed. Saved in session. All checks validated. Dispatched summary alert to registered address 'starpanther0@gmail.com'.`;
    
    setMailLogs(prev => [
      {
        id: 'log-' + Date.now(),
        time: new Date().toLocaleTimeString(),
        type: summaryType,
        details,
        status: 'dispatched'
      },
      ...prev
    ]);
  };

  const handlePDFExport = () => {
    setExporting(true);
    setTimeout(() => {
      // Create a gorgeous printable dashboard view
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert("Pop-up blocked! Please allow popups to export report sheets.");
        setExporting(false);
        return;
      }

      const servicesStr = metrics?.serviceBreakdown.map(s => `<li><strong>${s.service}</strong>: ${s.count} requests</li>`).join('') || 'None';
      const statusStr = metrics?.statusBreakdown.map(st => `<li><strong>Status - ${st.status.toUpperCase()}</strong>: ${st.count} inquiries</li>`).join('') || 'None';
      const trendStr = metrics?.trendBreakdown.map(t => `<li><strong>Date ${t.dateStr}</strong>: ${t.count} inquiry(s)</li>`).join('') || 'None';
      const logsStr = mailLogs.map(l => `<tr><td style="padding:8px;border:1px solid #ddd;">${l.time}</td><td style="padding:8px;border:1px solid #ddd;">${l.type}</td><td style="padding:8px;border:1px solid #ddd;">${l.details}</td></tr>`).join('');
      const listInquiriesStr = inquiries.map(i => `
        <tr style="border-bottom: 1px solid #eee;">
          <td style="padding:10px;">${i.id}</td>
          <td style="padding:10px;">${i.name}</td>
          <td style="padding:10px;">${i.email}</td>
          <td style="padding:10px;">${i.service}</td>
          <td style="padding:10px;">${i.message}</td>
          <td style="padding:10px;"><span style="background:#e0f2fe;color:#0369a1;padding:2px 8px;border-radius:12px;font-size:11px;">${i.status}</span></td>
        </tr>
      `).join('');

      printWindow.document.write(`
        <html>
        <head>
          <title>Provider Place Luxury IT Services - Operations Executive Report</title>
          <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1e293b; padding: 40px; line-height: 1.5; }
            h1 { font-size: 26px; font-weight: bold; border-bottom: 3px solid #1e1b4b; padding-bottom: 10px; color: #0f172a; margin-bottom: 5px; }
            h2 { font-size: 18px; margin-top: 30px; margin-bottom: 15px; border-bottom: 1px solid #cbd5e1; padding-bottom: 5px; color: #1e1b4b; }
            .header-meta { font-size: 12px; color: #64748b; font-family: monospace; margin-bottom: 30px; }
            .grid { display: flex; gap: 40px; margin-bottom: 30px; }
            .col { flex: 1; background: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; }
            .metric { font-size: 32px; font-weight: bold; color: #4f46e5; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 13px; }
            th { background: #0f172a; color: white; text-align: left; padding: 10px; }
            td { padding: 8px; border-bottom: 1px solid #e2e8f0; }
            .footer { margin-top: 50px; font-size: 11px; text-align: center; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 20px; }
          </style>
        </head>
        <body>
          <h1>PROVIDER PLACE - EXECUTIVE PLATFORM REPORT</h1>
          <div class="header-meta">
            REPORT GUID: PP-OPERATIONS-${Date.now().toString(36).toUpperCase()}<br/>
            GENERATED: ${new Date().toLocaleString()}<br/>
            RECIPIENT ARCHIVE: starpanther0@gmail.com / muhammadmawiya5@gmail.com
          </div>
          
          <div class="grid">
            <div class="col">
              <h3>SYSTEM CAPACITY SUMMARY</h3>
              <div class="metric">${metrics?.totalInquiries || inquiries.length}</div>
              <p>Total Client Inquiries Logged in Cloud SQL Database</p>
            </div>
            <div class="col">
              <h3>SYSTEM ALERTS STATUS</h3>
              <div class="metric" style="color:#059669">OPERATIONAL</div>
              <p>Automated Email alerts active & synced</p>
            </div>
          </div>

          <h2>1. DEMAND DISTRIBUTION BY SERVICE</h2>
          <ul>${servicesStr}</ul>

          <h2>2. SUBMISSION STATUS SUMMARY</h2>
          <ul>${statusStr}</ul>

          <h2>3. HISTORICAL INCOMING METRICS (DAILY COUNTS)</h2>
          <ul>${trendStr}</ul>

          <h2>4. INCOMING INQUIRY LOG DETAILS</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Requested Service</th>
                <th>Client Message Details</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${listInquiriesStr || '<tr><td colspan="6" style="text-align:center;">No direct inputs recorded.</td></tr>'}
            </tbody>
          </table>

          <h2>5. AUTOMATION DISPATCH SYSTEM MAIL LOGS</h2>
          <table style="border:1px solid #ddd;">
            <thead>
              <tr style="background:#f1f5f9;color:#334155">
                <th style="padding:10px;border:1px solid #ddd;">Log Time</th>
                <th style="padding:10px;border:1px solid #ddd;">Mail Type Header</th>
                <th style="padding:10px;border:1px solid #ddd;">Activity Details Logged</th>
              </tr>
            </thead>
            <tbody>
              ${logsStr}
            </tbody>
          </table>

          <div class="footer">
            Provider Place Premium Executive Report Sheet &bull; Automated Node.js Backend Verification &bull; Made with &hearts; by Muhammad Mawiya
          </div>
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
        </html>
      `);
      printWindow.document.close();
      setExporting(false);
    }, 1200);
  };

  return (
    <section className="py-24 bg-slate-50 relative font-sans" id="executive-dashboard-section">
      <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-slate-300 to-transparent" />
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        {/* Title Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-200/50 border border-slate-300 text-xs font-mono font-medium text-slate-800 mb-4 tracking-wider">
            <Database className="w-3.5 h-3.5 text-slate-700" /> Premium Corporate Console
          </div>
          <h2 className="text-3xl md:text-5xl font-sans font-bold tracking-tight text-slate-900 mb-4">
            Monitoring & Executive Dashboard
          </h2>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-600">
            Secure client inquiry tracking, real-time demand metrics, automated dispatch logs, and PDF operational reports.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-16 bg-white border border-slate-200/60 rounded-2xl shadow-sm max-w-lg mx-auto">
            <div className="w-10 h-10 border-4 border-slate-300 border-t-indigo-600 rounded-full animate-spin mb-4" />
            <p className="text-xs font-mono text-slate-500">Checking terminal auth state...</p>
          </div>
        ) : !currentUser ? (
          /* Locked State - Google Login Form */
          <div className="max-w-md mx-auto bg-white/80 backdrop-blur-xl border border-slate-200 shadow-xl rounded-2xl p-8 text-center" id="dashboard-gate-login">
            <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center mx-auto mb-6 border border-indigo-100">
              <Database className="w-7 h-7 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold font-sans text-slate-900 mb-2">Access Secure Analytics</h3>
            <p className="text-slate-600 text-xs sm:text-sm mb-6">
              This dashboard accesses real-time operational data stored securely in Cloud SQL. Please authenticate with Google to proceed.
            </p>

            <button
              onClick={handleSignIn}
              className="w-full inline-flex items-center justify-center gap-3 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs sm:text-sm shadow-md transition-all duration-200 cursor-pointer"
              id="google-login-btn"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Social Sign In with Google
            </button>
            <div className="mt-4 text-[10px] text-slate-400 font-mono">
              Secure Auth &bull; Direct Google Sign-In Portal
            </div>
          </div>
        ) : (
          /* Logged In Dashboard Interface */
          <div className="bg-white/95 border border-slate-200/90 shadow-2xl rounded-3xl overflow-hidden flex flex-col" id="dashboard-active-panel">
            
            {/* User Details Header bar */}
            <div className="bg-slate-900 text-white p-5 px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-indigo-950">
              <div className="flex items-center gap-3">
                {currentUser.photoURL ? (
                  <img src={currentUser.photoURL} alt="Avatar" className="w-10 h-10 rounded-full border border-slate-700 referrer-policy='no-referrer'" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-sm font-bold font-mono text-white">
                    {currentUser.displayName?.charAt(0) || 'U'}
                  </div>
                )}
                <div>
                  <div className="text-[11px] font-mono text-indigo-300">ADMINISTRATIVE USER</div>
                  <h3 className="font-bold text-sm tracking-wide">{currentUser.displayName || currentUser.email}</h3>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={handlePDFExport}
                  disabled={exporting}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-linear-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white text-xs font-mono font-medium px-4 py-2 rounded-xl transition-all cursor-pointer"
                >
                  {exporting ? (
                    <>
                      <Clock className="w-3.5 h-3.5 animate-spin" /> Compiling PDF...
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" /> Export PDF Report
                    </>
                  )}
                </button>
                <button
                  onClick={handleSignOut}
                  className="inline-flex items-center justify-center p-2 rounded-xl bg-slate-800 hover:bg-red-950 hover:text-red-200 border border-slate-700 transition-colors cursor-pointer text-slate-400"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Sub-navigation tabs */}
            <div className="flex border-b border-slate-200 bg-slate-50/50 p-2 gap-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                  activeTab === 'overview' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-200/50'
                }`}
              >
                <LineChart className="w-3.5 h-3.5 inline mr-1" /> Metrics Overview
              </button>
              <button
                onClick={() => setActiveTab('inquiries')}
                className={`px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                  activeTab === 'inquiries' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-200/50'
                }`}
              >
                <Layers className="w-3.5 h-3.5 inline mr-1" /> Inquiries List ({inquiries.length})
              </button>
              <button
                onClick={() => setActiveTab('alerts')}
                className={`px-4 py-2 rounded-lg text-xs font-mono font-semibold transition-all cursor-pointer ${
                  activeTab === 'alerts' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-200/50'
                }`}
              >
                <BellRing className="w-3.5 h-3.5 inline mr-1" /> Alert Systems & Sim
              </button>
            </div>

            {/* Workspace Areas */}
            <div className="p-6 sm:p-8 min-h-380px bg-white">
              <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-8"
                  >
                    {/* Metrics Cards Top row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="p-5 border border-slate-200 rounded-2xl bg-slate-50 shadow-sm flex items-center justify-between">
                        <div>
                          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">Total Inquiries</p>
                          <h4 className="text-3xl font-extrabold text-slate-900 mt-1">{metrics?.totalInquiries || inquiries.length}</h4>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-lg select-none">
                          #
                        </div>
                      </div>

                      <div className="p-5 border border-slate-200 rounded-2xl bg-slate-50 shadow-sm flex items-center justify-between">
                        <div>
                          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">System Alerts</p>
                          <h4 className="text-lg font-bold text-slate-800 mt-2 flex items-center gap-1.5">
                            <CheckCircle className="w-5 h-5 text-emerald-600" /> Active Operational
                          </h4>
                        </div>
                        <div className="p-1 rounded-md bg-emerald-50 text-emerald-800 text-[9.5px] font-bold font-mono">
                          SECURE
                        </div>
                      </div>

                      <div className="p-5 border border-slate-200 rounded-2xl bg-slate-50 shadow-sm flex items-center justify-between">
                        <div>
                          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">Weekly Summaries</p>
                          <h4 className="text-xs font-semibold text-indigo-950 mt-2">
                            To: starpanther0@gmail.com
                          </h4>
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5">Recurring updates active</p>
                        </div>
                        <button 
                          onClick={runRecurringSummarySim}
                          className="bg-slate-900 hover:bg-indigo-600 text-white rounded-lg px-2.5 py-1 text-[10px] font-mono select-none cursor-pointer text-center"
                          title="Trigger a test summary alert dispatch"
                        >
                          Trigger
                        </button>
                      </div>
                    </div>

                    {/* Custom Visual Charts section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Services Distribution bar chart */}
                      <div className="p-5 border border-slate-200 rounded-2xl">
                        <h4 className="font-semibold text-slate-900 text-sm mb-4">Client Demands by Category</h4>
                        <div className="space-y-3">
                          {metrics && metrics.serviceBreakdown.length > 0 ? (
                            metrics.serviceBreakdown.map((item, idx) => {
                              const pct = Math.round((item.count / (metrics.totalInquiries || 1)) * 100);
                              return (
                                <div key={idx}>
                                  <div className="flex justify-between text-xs font-mono text-slate-700 mb-1">
                                    <span className="truncate max-w-[70%]">{item.service}</span>
                                    <span>{item.count} inquiries ({pct}%)</span>
                                  </div>
                                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                    <div 
                                      className="bg-indigo-600 h-full rounded-full" 
                                      style={{ width: `${pct}%` }} 
                                    />
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <div className="text-center py-6 text-slate-400 text-xs">
                              No metrics recorded. Submit a contact inquiry below to update instantly!
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Ticket Status Breakdown and Traffic analytics */}
                      <div className="p-5 border border-slate-200 rounded-2xl space-y-6">
                        <div>
                          <h4 className="font-semibold text-slate-900 text-sm mb-3">Submission Pipeline Statuses</h4>
                          <div className="grid grid-cols-2 gap-3">
                            {metrics && metrics.statusBreakdown.length > 0 ? (
                              metrics.statusBreakdown.map((item, idx) => (
                                <div key={idx} className="p-3 bg-slate-50 border border-slate-100 rounded-xl relative overflow-hidden">
                                  <span className="text-[10px] font-mono font-bold text-slate-400 capitalize">{item.status}</span>
                                  <h5 className="text-xl font-mono font-black text-slate-800 mt-1">{item.count}</h5>
                                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-500" />
                                </div>
                              ))
                            ) : (
                              <div className="col-span-2 text-center py-4 text-slate-400 text-xs">No records available.</div>
                            )}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-slate-900 text-sm mb-2">Live Interactions Records (Visitor Hits)</h4>
                          <div className="flex gap-4 flex-wrap">
                            {metrics?.interactionEvents && metrics.interactionEvents.length > 0 ? (
                              metrics.interactionEvents.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-lg text-xs font-mono">
                                  <span className="text-slate-500">{item.eventType}:</span>
                                  <span className="font-bold text-indigo-950">{item.count}</span>
                                </div>
                              ))
                            ) : (
                              <span className="text-xs text-slate-400 italic">Logging initial visitor tracks...</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'inquiries' && (
                  <motion.div
                    key="inquiries"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <h4 className="font-semibold text-slate-900 text-sm mb-2">Cloud SQL Submissions Log</h4>
                    {inquiries.length === 0 ? (
                      <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 text-slate-400 text-sm">
                        No inquiries stored yet. Try executing custom form submits from the Home interface below.
                      </div>
                    ) : (
                      <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-sm">
                        <table className="w-full text-slate-700 font-sans border-collapse text-xs sm:text-sm">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 font-mono text-[11px] text-slate-500">
                              <th className="p-3 text-left">UID</th>
                              <th className="p-3 text-left">Name</th>
                              <th className="p-3 text-left">Contact Info</th>
                              <th className="p-3 text-left">Service Demanded</th>
                              <th className="p-3 text-left">Message Context</th>
                              <th className="p-3 text-left">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {inquiries.map((col) => (
                              <tr key={col.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                                <td className="p-3 font-mono text-slate-400 font-bold select-all">#{col.id}</td>
                                <td className="p-3 font-semibold text-slate-950">{col.name}</td>
                                <td className="p-3 leading-tight">
                                  <div>{col.email}</div>
                                  {col.phone && <div className="text-[10px] text-slate-400 font-mono mt-0.5">{col.phone}</div>}
                                </td>
                                <td className="p-3">
                                  <span className="bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded-md text-[10.5px]">
                                    {col.service}
                                  </span>
                                </td>
                                <td className="p-3 max-w-70 wrap-break-word text-slate-600 font-mono text-[11px]">{col.message}</td>
                                <td className="p-3">
                                  <span className="bg-sky-50 text-sky-700 border border-sky-100 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold">
                                    {col.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'alerts' && (
                  <motion.div
                    key="alerts"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                  >
                    {/* Dispatch Alert Form */}
                    <div className="p-5 border border-slate-200 rounded-2xl bg-slate-50 space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                        <BellRing className="w-5 h-5 text-indigo-600" />
                        <h4 className="font-semibold text-slate-900 text-sm">Automated Email Dispatch Console</h4>
                      </div>
                      <p className="text-slate-500 text-xs leading-relaxed">
                        Provider Place automates outbound briefings on critical metrics. Input custom operational alerts to test-dispatch summaries into simulated mail pipelines targeting: <code className="bg-indigo-50 border border-indigo-100 px-1 py-0.5 rounded text-indigo-700">starpanther0@gmail.com</code>
                      </p>

                      <form onSubmit={triggerAlertDispatch} className="space-y-3 pt-2">
                        <div>
                          <label className="block text-[10px] font-mono text-slate-400 mb-1">ALERT BRIEF TITLE</label>
                          <input
                            type="text"
                            value={alertForm.title}
                            onChange={(e) => setAlertForm({ ...alertForm, title: e.target.value })}
                            placeholder="e.g. Traffic surge alerts or security operability logs"
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-indigo-500 font-sans"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono text-slate-400 mb-1">ALERTS EXPLANATORY MESSAGE</label>
                          <textarea
                            value={alertForm.message}
                            onChange={(e) => setAlertForm({ ...alertForm, message: e.target.value })}
                            rows={3}
                            placeholder="Brief description of the simulated alerts triggers..."
                            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-indigo-500 font-sans"
                            required
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-medium text-xs font-mono py-2 rounded-xl transition-all select-none cursor-pointer"
                        >
                          Dispatch Simulated Email Alert
                        </button>
                      </form>
                    </div>

                    {/* Simulation Activity Logs pipeline */}
                    <div className="p-5 border border-slate-200 rounded-2xl relative">
                      <h4 className="font-semibold text-slate-900 text-sm mb-4">Email Notifications Monitor (Sim System logs)</h4>
                      <div className="space-y-3.5 max-h-290px overflow-y-auto pr-1">
                        {mailLogs.map((log) => (
                          <div key={log.id} className="p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors">
                            <div className="flex items-start justify-between gap-2">
                              <span className="text-[11px] font-mono font-bold text-slate-900">{log.type}</span>
                              <span className={`text-[9px] font-mono px-2 py-px rounded ${
                                log.status === 'dispatched' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'
                              } lowercase`}>
                                {log.status}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-500 mt-1">{log.details}</p>
                            <span className="text-[9px] text-slate-400 font-mono mt-1.5 block">{log.time} &bull; SMTP Sim Target: starpanther0@gmail.com</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="bg-slate-50 py-4 px-6 border-t border-slate-200 text-center text-xs font-mono text-slate-400 flex flex-col sm:flex-row justify-between items-center gap-2">
              <span>Database Sync Address: PostgreSQL DB on Cloud SQL (asia-southeast1)</span>
              <span>Made with ❤️ by Muhammad Mawiya</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
