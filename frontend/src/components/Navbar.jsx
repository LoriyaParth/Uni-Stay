import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [messagesOpen, setMessagesOpen] = useState(false);
  const [notifsOpen, setNotifsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      import('../context/AuthContext').then(({ api }) => {
        api.get('/messages').then(r => setMessages(r.data?.slice(0, 3) || [])).catch(() => {});
      });
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => { logout(); setProfileOpen(false); navigate('/'); };
  const dashboardLink = user?.role === 'owner' ? '/dashboard/owner' : '/dashboard/student';

  const navLinks = [
    { label: 'Browse', path: '/listings' },
    { label: 'Add Listing', path: '/add-listing' },
    { label: 'My Favorites', path: '/favorites' },
    { label: 'Help', path: '/help' },
  ];

  return (
    <nav className={`sticky top-0 z-50 flex justify-between items-center w-full px-6 md:px-16 py-4 transition-all duration-300 ${scrolled ? 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-lg border-b border-slate-100' : 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200'}`}>
      <Link to="/" className="text-2xl font-black tracking-tight text-indigo-600 hover:opacity-80 transition-opacity">
        UniStay
      </Link>

      <div className="hidden md:flex items-center gap-8 font-inter text-sm font-medium">
        {navLinks.map(l => (
          <Link key={l.path} to={l.path} className="text-slate-600 hover:text-indigo-500 transition-colors">
            {l.label}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <div className="relative">
              <button onClick={() => { setNotifsOpen(!notifsOpen); setMessagesOpen(false); setProfileOpen(false); }} className="p-2 hover:bg-slate-50 rounded-full transition-colors relative">
                <span className="material-symbols-outlined text-slate-600">notifications</span>
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              {notifsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-100 py-2 z-50 animate-fade-in">
                  <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center">
                    <p className="font-semibold text-slate-900 text-sm">Notifications</p>
                    <span className="text-xs text-primary cursor-pointer hover:underline">Mark all as read</span>
                  </div>
                  <div className="p-4 text-sm text-slate-500 text-center">
                    No new notifications right now.
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <button onClick={() => { setMessagesOpen(!messagesOpen); setNotifsOpen(false); setProfileOpen(false); }} className="p-2 hover:bg-slate-50 rounded-full transition-colors relative">
                <span className="material-symbols-outlined text-slate-600">chat</span>
                {messages.length > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full"></span>}
              </button>
              {messagesOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-100 py-2 z-50 animate-fade-in">
                  <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center">
                    <p className="font-semibold text-slate-900 text-sm">Messages</p>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {messages.length > 0 ? messages.map((m) => (
                      <Link to={dashboardLink} onClick={() => setMessagesOpen(false)} key={m._id} className="block px-4 py-3 hover:bg-slate-50 border-b border-slate-50 transition-colors">
                        <div className="flex justify-between items-start mb-1">
                          <p className="font-semibold text-sm text-slate-800">{m.sender?.name || m.receiver?.name}</p>
                          <span className="text-[10px] text-slate-400">{new Date(m.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-xs text-slate-500 truncate">{m.content}</p>
                      </Link>
                    )) : (
                      <div className="p-4 text-sm text-slate-500 text-center">No messages yet.</div>
                    )}
                  </div>
                  <div className="px-4 py-2 border-t border-slate-100 text-center">
                    <Link to={dashboardLink} onClick={() => setMessagesOpen(false)} className="text-xs text-primary font-semibold hover:underline">View All Messages</Link>
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <button onClick={() => { setProfileOpen(!profileOpen); setMessagesOpen(false); setNotifsOpen(false); }} className="w-10 h-10 rounded-full bg-primary-container overflow-hidden border-2 border-transparent hover:border-indigo-300 flex items-center justify-center text-white font-bold text-sm transition-all">
                {user?.avatar ? <img alt="Profile" className="w-full h-full object-cover" src={user.avatar} /> : <span>{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>}
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-slate-100 py-2 z-50 animate-fade-in">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="font-semibold text-slate-900 text-sm">{user?.name}</p>
                    <p className="text-xs text-slate-500">{user?.email}</p>
                  </div>
                  <Link to={dashboardLink} onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-indigo-50 transition-colors">
                    <span className="material-symbols-outlined text-lg">dashboard</span> Dashboard
                  </Link>
                  <Link to="/favorites" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-indigo-50 transition-colors">
                    <span className="material-symbols-outlined text-lg">favorite</span> Favorites
                  </Link>
                  <hr className="my-1 border-slate-100" />
                  <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left">
                    <span className="material-symbols-outlined text-lg">logout</span> Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/login" className="px-5 py-2 text-indigo-600 font-semibold hover:bg-indigo-50 rounded-lg transition-all">Login</Link>
            <Link to="/register" className="px-5 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-indigo-200 transition-all">Register</Link>
          </div>
        )}
        <button className="md:hidden p-2 hover:bg-slate-50 rounded-full transition-colors" onClick={() => setMobileOpen(!mobileOpen)}>
          <span className="material-symbols-outlined">{mobileOpen ? 'close' : 'menu'}</span>
        </button>
      </div>

      {mobileOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-lg md:hidden z-40 animate-fade-in">
          <div className="flex flex-col p-4 gap-2">
            {navLinks.map(l => (
              <Link key={l.path} to={l.path} onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-lg text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors">{l.label}</Link>
            ))}
            {isAuthenticated && (
              <Link to={dashboardLink} onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-lg text-indigo-600 bg-indigo-50 font-semibold">Dashboard</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
