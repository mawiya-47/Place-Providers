import HomeView from './components/HomeView.tsx';
import AdminDashboard from './components/AdminDashboard.tsx';
import AIChatBot from './components/AIChatBot.tsx';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 relative">
      {/* 4K Grid Tech Lines & Subtle Premium Lights overlay background */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.02),transparent)] select-none pointer-events-none z-0" />
      
      {/* Interactive Main Sections */}
      <main className="relative z-10">
        <HomeView />
        <AdminDashboard />
      </main>

      {/* Floating Interactive Assistants */}
      <AIChatBot />
    </div>
  );
}
