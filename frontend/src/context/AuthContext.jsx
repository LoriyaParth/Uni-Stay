import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('unistay_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Demo / Mock accounts ────────────────────────────────────────────────────
const DEMO_USERS = {
  'rahul@example.com': {
    _id: 'demo_owner_001',
    name: 'Rahul Sharma',
    email: 'rahul@example.com',
    phone: '+91 98765 43210',
    role: 'owner',
    avatar: null,
    createdAt: '2024-01-15T10:00:00Z',
  },
  'student@example.com': {
    _id: 'demo_student_001',
    name: 'Priya Patel',
    email: 'student@example.com',
    phone: '+91 87654 32109',
    role: 'student',
    avatar: null,
    createdAt: '2024-02-20T10:00:00Z',
  },
};
const DEMO_PASSWORD = 'password123';
const DEMO_TOKEN_PREFIX = 'demo_token__';

function isDemoToken(t) {
  return t && t.startsWith(DEMO_TOKEN_PREFIX);
}

function getDemoUserFromToken(t) {
  if (!isDemoToken(t)) return null;
  const email = t.replace(DEMO_TOKEN_PREFIX, '');
  return DEMO_USERS[email] || null;
}

// ─── Mock data for api calls ─────────────────────────────────────────────────
export const MOCK_LISTINGS = [
  {
    _id: 'mock_l1',
    propertyName: 'Royal Heights Boys PG',
    propertyType: 'Paying Guest (PG)',
    address: '12, MG Road, Koramangala',
    city: 'Bangalore',
    description: 'Premium PG with modern amenities near top colleges.',
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
    amenities: ['High-speed WiFi', 'Air Conditioning', 'Daily Cleaning', 'RO Water Purifier'],
    roomConfigs: [{ occupancy: '1 Person', priceMonthly: 8500, deposit: 17000, availableUnits: 3 }],
    verified: true,
    availability: 'available',
    owner: DEMO_USERS['rahul@example.com'],
    location: { lat: 12.9352, lng: 77.6245 },
    policies: [{ icon: 'info', title: 'No Smoking', description: 'Strictly no smoking on premises.' }],
    createdAt: '2024-03-01T10:00:00Z',
  },
  {
    _id: 'mock_l2',
    propertyName: 'Sunrise Girls Hostel',
    propertyType: 'Hostel',
    address: '45, Anna Nagar East',
    city: 'Chennai',
    description: 'Safe and comfortable hostel exclusively for girls.',
    images: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800'],
    amenities: ['High-speed WiFi', 'Mess/Kitchen', 'Parking Space'],
    roomConfigs: [
      { occupancy: '2 Persons', priceMonthly: 5500, deposit: 11000, availableUnits: 5 },
      { occupancy: '3 Persons', priceMonthly: 4200, deposit: 8400, availableUnits: 2 },
    ],
    verified: true,
    availability: 'filling_fast',
    owner: DEMO_USERS['rahul@example.com'],
    location: { lat: 13.0827, lng: 80.2707 },
    policies: [],
    createdAt: '2024-03-10T10:00:00Z',
  },
  {
    _id: 'mock_l3',
    propertyName: 'Green Valley Shared Flat',
    propertyType: 'Shared Flat',
    address: '7, Baner Road',
    city: 'Pune',
    description: 'Spacious shared flat perfect for working professionals and students.',
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
    amenities: ['High-speed WiFi', 'Parking Space', 'Air Conditioning'],
    roomConfigs: [{ occupancy: '1 Person', priceMonthly: 12000, deposit: 24000, availableUnits: 1 }],
    verified: false,
    availability: 'available',
    owner: DEMO_USERS['rahul@example.com'],
    location: { lat: 18.5204, lng: 73.8567 },
    policies: [],
    createdAt: '2024-03-20T10:00:00Z',
  },
];

export const MOCK_MESSAGES = [
  { _id: 'msg1', sender: { name: 'Riya Sharma' }, receiver: { name: 'Rahul Sharma' }, content: 'Is the room still available for next month?', status: 'pending', createdAt: new Date(Date.now() - 5 * 60000).toISOString() },
  { _id: 'msg2', sender: { name: 'Arjun Patel' }, receiver: { name: 'Rahul Sharma' }, content: 'Can I schedule a visit this weekend?', status: 'responded', createdAt: new Date(Date.now() - 30 * 60000).toISOString() },
  { _id: 'msg3', sender: { name: 'Priya Mehta' }, receiver: { name: 'Rahul Sharma' }, content: 'Thank you for the quick response! I will confirm by Friday.', status: 'resolved', createdAt: new Date(Date.now() - 2 * 3600000).toISOString() },
];

export const MOCK_FAVORITES = [MOCK_LISTINGS[0], MOCK_LISTINGS[1]];

// Intercept api calls when in demo mode and return mock data
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const token = localStorage.getItem('unistay_token');
    if (!isDemoToken(token)) return Promise.reject(error);

    const { url, method } = error.config;
    const path = url.replace(API_URL, '');

    // Mock response helper
    const mock = (data, status = 200) => ({
      data,
      status,
      headers: {},
      config: error.config,
      request: error.request,
    });

    if (path.includes('/favorites')) return mock(MOCK_FAVORITES);
    if (path.includes('/messages') && method === 'get') return mock(MOCK_MESSAGES);
    if (path.includes('/listings') && method === 'get') return mock(MOCK_LISTINGS);
    if (path.includes('/auth/me')) {
      const u = getDemoUserFromToken(token);
      if (u) return mock(u);
    }

    return Promise.reject(error);
  }
);

// ─── Auth Provider ────────────────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('unistay_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      if (isDemoToken(token)) {
        // Restore demo session immediately — no network needed
        const demoUser = getDemoUserFromToken(token);
        if (demoUser) {
          setUser(demoUser);
        } else {
          logout();
        }
        setLoading(false);
      } else {
        fetchUser();
      }
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUser = async () => {
    try {
      const res = await api.get('/auth/me');
      setUser(res.data);
    } catch (error) {
      console.error('Auth error:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const emailLower = email.toLowerCase().trim();

    // ── Demo account shortcut ──
    if (DEMO_USERS[emailLower] && password === DEMO_PASSWORD) {
      const demoUser = DEMO_USERS[emailLower];
      const demoToken = `${DEMO_TOKEN_PREFIX}${emailLower}`;
      localStorage.setItem('unistay_token', demoToken);
      setToken(demoToken);
      setUser(demoUser);
      return { token: demoToken, user: demoUser };
    }

    // ── Real backend login ──
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('unistay_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data;
    } catch (err) {
      // If backend is unreachable, give a helpful message
      if (!err.response) {
        throw new Error('Cannot connect to server. Use the demo accounts to explore the app.');
      }
      throw err;
    }
  };

  const register = async (name, email, password, phone, role) => {
    try {
      const res = await api.post('/auth/register', { name, email, password, phone, role });
      localStorage.setItem('unistay_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data;
    } catch (err) {
      if (!err.response) {
        throw new Error('Cannot connect to server. Registration requires a backend connection.');
      }
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('unistay_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
