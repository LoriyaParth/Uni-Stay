import { useState, useRef, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../context/AuthContext';

const demoContacts = [
  { id: 1, name: 'Riya Sharma', role: 'Student', avatar: 'R', color: 'bg-pink-500', online: true, lastMsg: 'Is the room still available for April?', time: '5 min ago', unread: 2 },
  { id: 2, name: 'Arjun Patel', role: 'Student', avatar: 'A', color: 'bg-blue-500', online: true, lastMsg: 'Can I visit this Saturday?', time: '30 min ago', unread: 1 },
  { id: 3, name: 'Priya Mehta', role: 'Owner', avatar: 'P', color: 'bg-green-500', online: false, lastMsg: 'Thank you for your quick response!', time: '2 hrs ago', unread: 0 },
  { id: 4, name: 'Karan Singh', role: 'Student', avatar: 'K', color: 'bg-purple-500', online: false, lastMsg: 'What are the house rules?', time: 'Yesterday', unread: 0 },
  { id: 5, name: 'Nisha Joshi', role: 'Student', avatar: 'N', color: 'bg-orange-500', online: false, lastMsg: 'Are meals included?', time: '2 days ago', unread: 0 },
];

const demoConversations = {
  1: [
    { from: 'them', text: 'Hi! I saw your listing on UniStay. Is the room still available?', time: '10:02 AM' },
    { from: 'me', text: 'Yes, the room is still available! Are you looking for from which date?', time: '10:05 AM' },
    { from: 'them', text: 'I need from April 1st. Is it possible?', time: '10:08 AM' },
    { from: 'me', text: 'Absolutely, April 1st works. Would you like to schedule a visit?', time: '10:10 AM' },
    { from: 'them', text: 'Is the room still available for April?', time: '10:15 AM' },
  ],
  2: [
    { from: 'them', text: 'Hello! Can I come visit your property this weekend?', time: '9:20 AM' },
    { from: 'me', text: 'Sure! Saturday works. What time suits you?', time: '9:35 AM' },
    { from: 'them', text: 'Can I visit this Saturday?', time: '9:40 AM' },
  ],
  3: [
    { from: 'them', text: 'Hello, I am Priya. I own the property next door.', time: 'Yesterday 3 PM' },
    { from: 'me', text: 'Hi Priya! Nice to connect.', time: 'Yesterday 3:05 PM' },
    { from: 'them', text: 'Thank you for your quick response!', time: 'Yesterday 3:10 PM' },
  ],
};

export default function DashboardMessages({ role = 'owner' }) {
  const { user } = useAuth();
  const [activeId, setActiveId] = useState(1);
  const [message, setMessage] = useState('');
  const [conversations, setConversations] = useState(demoConversations);
  const [search, setSearch] = useState('');
  const msgEndRef = useRef(null);

  const activeContact = demoContacts.find(c => c.id === activeId);
  const msgs = conversations[activeId] || [];

  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs]);

  const sendMessage = () => {
    if (!message.trim()) return;
    setConversations(prev => ({
      ...prev,
      [activeId]: [...(prev[activeId] || []), { from: 'me', text: message.trim(), time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) }]
    }));
    setMessage('');
  };

  const filtered = demoContacts.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <DashboardLayout role={role}>
      <div className="flex flex-1 h-[calc(100vh-65px)] overflow-hidden">
        {/* Contacts Sidebar */}
        <aside className="w-72 border-r border-slate-200 bg-white flex flex-col flex-shrink-0">
          <div className="p-4 border-b border-slate-100">
            <h2 className="font-bold text-slate-800 text-base mb-3">Messages</h2>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[16px]">search</span>
              <input
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="Search messages..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="overflow-y-auto flex-1 divide-y divide-slate-50">
            {filtered.map(c => (
              <div
                key={c.id}
                onClick={() => setActiveId(c.id)}
                className={`px-4 py-3.5 cursor-pointer hover:bg-indigo-50 transition-colors flex items-center gap-3 ${activeId === c.id ? 'bg-indigo-50 border-r-2 border-indigo-500' : ''}`}
              >
                <div className="relative flex-shrink-0">
                  <div className={`w-10 h-10 rounded-full ${c.color} text-white flex items-center justify-center font-bold text-sm`}>
                    {c.avatar}
                  </div>
                  {c.online && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-slate-800 text-sm truncate">{c.name}</p>
                    <span className="text-[10px] text-slate-400 flex-shrink-0 ml-1">{c.time}</span>
                  </div>
                  <p className="text-xs text-slate-500 truncate">{c.lastMsg}</p>
                </div>
                {c.unread > 0 && (
                  <div className="w-5 h-5 bg-indigo-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                    {c.unread}
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col bg-slate-50">
          {/* Chat Header */}
          <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-full ${activeContact?.color} text-white flex items-center justify-center font-bold text-sm relative`}>
              {activeContact?.avatar}
              {activeContact?.online && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />}
            </div>
            <div>
              <p className="font-bold text-slate-800 text-sm">{activeContact?.name}</p>
              <p className="text-xs text-slate-400">{activeContact?.online ? '🟢 Online' : 'Offline'} • {activeContact?.role}</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors" title="Call">
                <span className="material-symbols-outlined text-[20px]">call</span>
              </button>
              <button className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors" title="Info">
                <span className="material-symbols-outlined text-[20px]">info</span>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-3">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                {m.from !== 'me' && (
                  <div className={`w-7 h-7 rounded-full ${activeContact?.color} text-white flex items-center justify-center font-bold text-xs mr-2 mt-1 flex-shrink-0`}>
                    {activeContact?.avatar}
                  </div>
                )}
                <div className={`max-w-xs lg:max-w-sm ${m.from === 'me' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                  <div className={`px-4 py-2.5 rounded-2xl text-sm shadow-sm ${
                    m.from === 'me'
                      ? 'bg-indigo-600 text-white rounded-br-sm'
                      : 'bg-white text-slate-800 rounded-bl-sm border border-slate-200'
                  }`}>
                    {m.text}
                  </div>
                  <span className="text-[10px] text-slate-400 px-1">{m.time}</span>
                </div>
              </div>
            ))}
            <div ref={msgEndRef} />
          </div>

          {/* Message Input */}
          <div className="bg-white border-t border-slate-200 px-6 py-4">
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-full px-4 py-2">
              <button className="text-slate-400 hover:text-indigo-500 transition-colors" title="Attach">
                <span className="material-symbols-outlined text-[20px]">attach_file</span>
              </button>
              <input
                type="text"
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 bg-transparent text-sm outline-none text-slate-700 placeholder-slate-400"
              />
              <button className="text-slate-400 hover:text-indigo-500 transition-colors" title="Emoji">
                <span className="material-symbols-outlined text-[20px]">sentiment_satisfied</span>
              </button>
              <button
                onClick={sendMessage}
                disabled={!message.trim()}
                className="w-9 h-9 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
