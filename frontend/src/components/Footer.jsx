import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <h3 className="text-2xl font-black text-white mb-4">UniStay</h3>
            <p className="text-sm leading-relaxed mb-6 text-slate-400">The trusted platform for student accommodation. Find verified PGs, hostels, and apartments near your university.</p>
            <div className="flex gap-4">
              {['language', 'group', 'share', 'mail'].map(icon => (
                <a key={icon} href="#" className="w-10 h-10 rounded-full bg-slate-800 hover:bg-indigo-600 flex items-center justify-center text-slate-400 hover:text-white transition-all">
                  <span className="material-symbols-outlined text-[18px]">{icon}</span>
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li><Link to="/listings" className="hover:text-indigo-400 transition-colors">Browse Listings</Link></li>
              <li><Link to="/add-listing" className="hover:text-indigo-400 transition-colors">List Your Property</Link></li>
              <li><Link to="/favorites" className="hover:text-indigo-400 transition-colors">My Favorites</Link></li>
              <li><Link to="/help" className="hover:text-indigo-400 transition-colors">Help Center</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6">For Students</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#" className="hover:text-indigo-400 transition-colors">How It Works</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Safety Tips</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Roommate Finder</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Student Blog</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Newsletter</h4>
            <p className="text-sm text-slate-400 mb-4">Get the latest listings and deals delivered to your inbox.</p>
            <div className="flex gap-2">
              <input className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 outline-none" placeholder="Your email" />
              <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors font-semibold text-sm">
                <span className="material-symbols-outlined text-[18px]">send</span>
              </button>
            </div>
          </div>
        </div>
        <hr className="border-slate-800 mb-8" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>© {new Date().getFullYear()} UniStay. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-indigo-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-indigo-400 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
