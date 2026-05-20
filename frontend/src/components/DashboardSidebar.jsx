import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const studentNav = [
  { icon: 'dashboard', label: 'Dashboard', path: '/dashboard/student' },
  { icon: 'home_work', label: 'My Bookings', path: '/dashboard/student/bookings' },
  { icon: 'payments', label: 'Payments', path: '/dashboard/student/payments' },
  { icon: 'chat_bubble', label: 'Messages', path: '/dashboard/student/messages' },
  { icon: 'settings', label: 'Account Settings', path: '/dashboard/student/settings' },
];

const ownerNav = [
  { icon: 'dashboard', label: 'Dashboard', path: '/dashboard/owner' },
  { icon: 'home_work', label: 'My Bookings', path: '/dashboard/owner/bookings' },
  { icon: 'payments', label: 'Payments', path: '/dashboard/owner/payments' },
  { icon: 'chat_bubble', label: 'Messages', path: '/dashboard/owner/messages' },
  { icon: 'settings', label: 'Account Settings', path: '/dashboard/owner/settings' },
];

export default function DashboardSidebar({ role = 'student' }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navItems = role === 'owner' ? ownerNav : studentNav;
  const activePath = location.pathname;

  return (
    <aside className="hidden lg:flex flex-col h-screen w-72 border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 sticky top-0 py-8 px-4 z-40">
      <div className="mb-10 px-4">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">UniStay</h1>
        <div className="mt-8 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-primary-container text-white flex items-center justify-center font-bold text-lg">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div>
            <p className="font-label-md text-slate-900 dark:text-white font-bold">
              {user?.name || (role === 'owner' ? 'Owner' : 'Student')}
            </p>
            <p className="text-label-sm text-slate-500 dark:text-slate-400">
              {role === 'owner' ? 'Owner Dashboard' : 'Student Dashboard'}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item, i) => {
          const isActive = activePath === item.path || (i === 0 && activePath === (role === 'owner' ? '/dashboard/owner' : '/dashboard/student'));
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 font-inter text-sm font-semibold tracking-wide transition-all duration-200 ${
                isActive
                  ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border-r-4 border-indigo-600'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-indigo-600 dark:hover:text-indigo-300'
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-2 pt-6 border-t border-slate-200 dark:border-slate-800">
        <button className="w-full py-3 px-4 bg-primary text-on-primary rounded-lg font-label-md hover:opacity-90 transition-opacity mb-4">
          Upgrade to Premium
        </button>
        <Link to="/help" className="flex items-center gap-3 px-4 py-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 font-inter text-sm font-semibold">
          <span className="material-symbols-outlined">help</span>
          <span>Help Center</span>
        </Link>
        <button onClick={logout} className="flex items-center gap-3 px-4 py-2 text-slate-500 dark:text-slate-400 hover:text-error font-inter text-sm font-semibold w-full text-left">
          <span className="material-symbols-outlined">logout</span>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
