import { useState, useRef, useEffect } from 'react';
import DashboardSidebar from './DashboardSidebar';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const sampleNotifications = [
  { id: 1, icon: 'home_work', title: 'New inquiry received', desc: 'A student messaged about your listing', time: '2 min ago', unread: true },
  { id: 2, icon: 'payments', title: 'Payment confirmed', desc: 'Booking payment of ₹3,000 received', time: '1 hr ago', unread: true },
  { id: 3, icon: 'verified', title: 'Listing verified', desc: 'Your property has been verified', time: 'Yesterday', unread: false },
];

const sampleMessages = [
  { id: 1, name: 'Riya Sharma', avatar: 'R', msg: 'Is the room still available?', time: '5 min ago', unread: true },
  { id: 2, name: 'Arjun Patel', avatar: 'A', msg: 'Can I visit this weekend?', time: '30 min ago', unread: true },
  { id: 3, name: 'Priya Mehta', avatar: 'P', msg: 'Thank you for the quick response!', time: '2 hrs ago', unread: false },
];

export default function DashboardLayout({ role = 'student', children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotif, setShowNotif] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [notifications, setNotifications] = useState(sampleNotifications);
  const [messages] = useState(sampleMessages);
  const notifRef = useRef(null);
  const msgRef = useRef(null);

  const unreadNotifCount = notifications.filter(n => n.unread).length;
  const unreadMsgCount = messages.filter(m => m.unread).length;

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false);
      if (msgRef.current && !msgRef.current.contains(e.target)) setShowMessages(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, unread: false })));

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar role={role} />
      <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Dashboard top bar */}
        <header className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm sticky top-0 z-50 flex justify-between items-center w-full px-6 md:px-10 py-3 max-w-full">
          <div className="flex items-center gap-6 flex-1">
            {/* Mobile menu icon */}
            <div className="lg:hidden">
              <span className="material-symbols-outlined text-slate-600 cursor-pointer">menu</span>
            </div>
            {/* Search bar */}
            <div className="relative w-full max-w-sm hidden md:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
              <input
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                placeholder="Search saved listings..."
                type="text"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Nav links */}
            <nav className="hidden md:flex items-center gap-5 font-inter text-sm font-medium mr-4">
              <Link to="/add-listing" className="text-slate-600 hover:text-indigo-600 transition-colors">Add Listing</Link>
              <Link to="/favorites" className="text-slate-600 hover:text-indigo-600 transition-colors">My Favorites</Link>
              <Link to="/help" className="text-slate-600 hover:text-indigo-600 transition-colors">Help</Link>
            </nav>

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => { setShowNotif(v => !v); setShowMessages(false); }}
                className="relative text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors"
                title="Notifications"
              >
                <span className="material-symbols-outlined text-[22px]">notifications</span>
                {unreadNotifCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-[9px] font-bold">
                    {unreadNotifCount}
                  </span>
                )}
              </button>
              {showNotif && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-50 animate-fade-in">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                    <h3 className="font-bold text-slate-800 text-sm">Notifications</h3>
                    <button onClick={markAllRead} className="text-xs text-indigo-600 hover:underline font-semibold">Mark all read</button>
                  </div>
                  <ul className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                    {notifications.map(n => (
                      <li key={n.id} className={`flex gap-3 px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors ${n.unread ? 'bg-indigo-50/50' : ''}`}>
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${n.unread ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                          <span className="material-symbols-outlined text-[18px]">{n.icon}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-800 truncate">{n.title}</p>
                          <p className="text-xs text-slate-500 truncate">{n.desc}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{n.time}</p>
                        </div>
                        {n.unread && <div className="w-2 h-2 bg-indigo-500 rounded-full mt-1 flex-shrink-0" />}
                      </li>
                    ))}
                  </ul>
                  <div className="px-4 py-3 border-t border-slate-100 text-center">
                    <button className="text-xs text-indigo-600 font-semibold hover:underline">View all notifications</button>
                  </div>
                </div>
              )}
            </div>

            {/* Messages */}
            <div className="relative" ref={msgRef}>
              <button
                onClick={() => { setShowMessages(v => !v); setShowNotif(false); }}
                className="relative text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors"
                title="Messages"
              >
                <span className="material-symbols-outlined text-[22px]">chat</span>
                {unreadMsgCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-white text-[9px] font-bold">
                    {unreadMsgCount}
                  </span>
                )}
              </button>
              {showMessages && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-50 animate-fade-in">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                    <h3 className="font-bold text-slate-800 text-sm">Messages</h3>
                    <Link
                      to={`/dashboard/${role}/messages`}
                      onClick={() => setShowMessages(false)}
                      className="text-xs text-indigo-600 hover:underline font-semibold"
                    >
                      See all
                    </Link>
                  </div>
                  <ul className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                    {messages.map(m => (
                      <li
                        key={m.id}
                        className={`flex gap-3 px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors ${m.unread ? 'bg-green-50/40' : ''}`}
                        onClick={() => { navigate(`/dashboard/${role}/messages`); setShowMessages(false); }}
                      >
                        <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {m.avatar}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center">
                            <p className="text-sm font-semibold text-slate-800">{m.name}</p>
                            <span className="text-[10px] text-slate-400">{m.time}</span>
                          </div>
                          <p className="text-xs text-slate-500 truncate">{m.msg}</p>
                        </div>
                        {m.unread && <div className="w-2 h-2 bg-green-500 rounded-full mt-1 flex-shrink-0" />}
                      </li>
                    ))}
                  </ul>
                  <div className="px-4 py-3 border-t border-slate-100 text-center">
                    <Link
                      to={`/dashboard/${role}/messages`}
                      onClick={() => setShowMessages(false)}
                      className="text-xs text-indigo-600 font-semibold hover:underline"
                    >
                      Open Messages
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* User avatar */}
            <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm ml-1 cursor-pointer hover:ring-2 hover:ring-indigo-400 transition-all" title={user?.name}>
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          </div>
        </header>

        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-2 flex justify-around items-center z-50">
        <Link to={`/dashboard/${role}`} className="flex flex-col items-center gap-0.5 text-indigo-600">
          <span className="material-symbols-outlined text-[22px]">dashboard</span>
          <span className="text-[9px] font-bold">Dash</span>
        </Link>
        <Link to={`/dashboard/${role}/bookings`} className="flex flex-col items-center gap-0.5 text-slate-400">
          <span className="material-symbols-outlined text-[22px]">home_work</span>
          <span className="text-[9px] font-bold">Bookings</span>
        </Link>
        <Link to={`/dashboard/${role}/messages`} className="flex flex-col items-center gap-0.5 text-slate-400">
          <span className="material-symbols-outlined text-[22px]">chat_bubble</span>
          <span className="text-[9px] font-bold">Messages</span>
        </Link>
        <Link to={`/dashboard/${role}/settings`} className="flex flex-col items-center gap-0.5 text-slate-400">
          <span className="material-symbols-outlined text-[22px]">settings</span>
          <span className="text-[9px] font-bold">Settings</span>
        </Link>
      </nav>
    </div>
  );
}
