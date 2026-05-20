import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const DEMO_ACCOUNTS = [
  { label: 'Owner', email: 'rahul@example.com', password: 'password123', icon: 'home_work', color: 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100' },
  { label: 'Student', email: 'student@example.com', password: 'password123', icon: 'school', color: 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100' },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [loadingDemo, setLoadingDemo] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await login(form.email, form.password);
      toast.success(`Welcome back, ${result.user?.name?.split(' ')[0] || 'there'}! 👋`);
      navigate(result.user?.role === 'owner' ? '/dashboard/owner' : '/dashboard/student');
    } catch (err) {
      const msg = err.message || err.response?.data?.message || 'Login failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (account) => {
    setLoadingDemo(account.label);
    setForm({ email: account.email, password: account.password });
    try {
      const result = await login(account.email, account.password);
      toast.success(`Welcome, ${result.user?.name?.split(' ')[0]}! Logged in as ${account.label} 🎉`);
      navigate(result.user?.role === 'owner' ? '/dashboard/owner' : '/dashboard/student');
    } catch (err) {
      toast.error('Demo login failed. Please try again.');
    } finally {
      setLoadingDemo(null);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Left - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary-container to-primary relative overflow-hidden items-center justify-center">
        <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="relative text-white text-center p-12">
          <span className="material-symbols-outlined text-7xl mb-6 opacity-90">school</span>
          <h2 className="text-4xl font-bold mb-4">Welcome Back</h2>
          <p className="text-white/70 text-lg max-w-md">
            Login to manage your listings, check favorites, and find the perfect student accommodation.
          </p>
          {/* Demo hint on left panel */}
          <div className="mt-10 bg-white/10 backdrop-blur-sm rounded-2xl p-5 text-left border border-white/20">
            <p className="text-white/90 font-semibold mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">bolt</span>
              Quick Demo Access
            </p>
            {DEMO_ACCOUNTS.map(a => (
              <div key={a.label} className="text-white/70 text-sm mb-1">
                <span className="font-medium text-white/90">{a.label}:</span> {a.email}
              </div>
            ))}
            <p className="text-white/50 text-xs mt-2">Password: password123</p>
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md animate-fade-in">
          <div className="mb-8">
            <Link to="/" className="text-2xl font-black tracking-tight text-indigo-600 mb-6 inline-block">UniStay</Link>
            <h1 className="font-h2 text-h2 text-on-surface mb-2">Sign In</h1>
            <p className="text-on-surface-variant">Enter your credentials to access your account</p>
          </div>

          {/* ── One-click Demo Buttons ── */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-on-surface-variant mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[15px]">bolt</span>
              Try a demo account — no backend needed:
            </p>
            <div className="grid grid-cols-2 gap-3">
              {DEMO_ACCOUNTS.map(account => (
                <button
                  key={account.label}
                  type="button"
                  id={`demo-login-${account.label.toLowerCase()}`}
                  onClick={() => handleDemoLogin(account)}
                  disabled={loadingDemo !== null || loading}
                  className={`flex items-center justify-center gap-2 px-4 py-3 border rounded-xl font-semibold text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed ${account.color}`}
                >
                  {loadingDemo === account.label ? (
                    <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                  ) : (
                    <span className="material-symbols-outlined text-[18px]">{account.icon}</span>
                  )}
                  {account.label} Demo
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-outline-variant" />
            <span className="text-xs text-on-surface-variant font-medium">or sign in manually</span>
            <div className="flex-1 h-px bg-outline-variant" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="font-label-md text-label-md text-on-surface-variant">Email Address</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">mail</span>
                <input
                  type="email"
                  id="login-email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-surface border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-label-md text-label-md text-on-surface-variant">Password</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">lock</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="login-password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full pl-10 pr-12 py-3 bg-surface border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              id="login-submit"
              disabled={loading || loadingDemo !== null}
              className="w-full py-3 bg-primary text-white font-label-md rounded-lg hover:shadow-lg hover:shadow-primary/30 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg">login</span>
                  Sign In
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-on-surface-variant">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}


export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex">
      {/* Left - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-primary-container to-primary relative overflow-hidden items-center justify-center">
        <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="relative text-white text-center p-12">
          <span className="material-symbols-outlined text-7xl mb-6 opacity-90">school</span>
          <h2 className="text-4xl font-bold mb-4">Welcome Back</h2>
          <p className="text-white/70 text-lg max-w-md">
            Login to manage your listings, check favorites, and find the perfect student accommodation.
          </p>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md animate-fade-in">
          <div className="mb-8">
            <Link to="/" className="text-2xl font-black tracking-tight text-indigo-600 mb-6 inline-block">UniStay</Link>
            <h1 className="font-h2 text-h2 text-on-surface mb-2">Sign In</h1>
            <p className="text-on-surface-variant">Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="font-label-md text-label-md text-on-surface-variant">Email Address</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">mail</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-surface border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-label-md text-label-md text-on-surface-variant">Password</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">lock</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full pl-10 pr-12 py-3 bg-surface border border-outline-variant rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
                >
                  <span className="material-symbols-outlined text-lg">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary text-white font-label-md rounded-lg hover:shadow-lg hover:shadow-primary/30 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg">login</span>
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Demo accounts */}
          <div className="mt-6 p-4 bg-surface-container-low rounded-xl border border-outline-variant/50">
            <p className="text-xs font-semibold text-on-surface-variant mb-2">Demo Accounts:</p>
            <div className="space-y-1 text-xs text-on-surface-variant">
              <p><span className="font-medium">Owner:</span> rahul@example.com / password123</p>
              <p><span className="font-medium">Student:</span> student@example.com / password123</p>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-on-surface-variant">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
