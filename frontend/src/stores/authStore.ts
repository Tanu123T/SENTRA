import { create } from 'zustand';
import { UserRead } from '../types';
import { authApi } from '../api/auth.api';
import { locationsApi } from '../api/locations.api';
import { SEED_DISTRICTS } from '../utils/constants';

interface AuthState {
  user: UserRead | null;
  accessToken: string | null;
  refreshToken: string | null;
  assignedDistrictName: string | null;
  assignedStateName: string | null;
  assignedCoordinates: [number, number] | null;
  isLoading: boolean;
  isInitialized: boolean;

  setTokens: (accessToken: string, refreshToken: string) => void;
  fetchProfile: () => Promise<UserRead | null>;
  logout: () => Promise<void>;
  resolveGeographicNames: (user: UserRead) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: localStorage.getItem('sentra_access_token'),
  refreshToken: localStorage.getItem('sentra_refresh_token'),
  assignedDistrictName: null,
  assignedStateName: null,
  assignedCoordinates: null,
  isLoading: false,
  isInitialized: false,

  setTokens: (accessToken: string, refreshToken: string) => {
    localStorage.setItem('sentra_access_token', accessToken);
    localStorage.setItem('sentra_refresh_token', refreshToken);
    set({ accessToken, refreshToken });
  },

  resolveGeographicNames: async (user: UserRead) => {
    let distName: string | null = null;
    let stateName: string | null = null;
    let coords: [number, number] | null = null;

    // Check seed references first for rapid offline/instant resolution
    if (user.district_id && SEED_DISTRICTS[user.district_id]) {
      const seed = SEED_DISTRICTS[user.district_id];
      distName = seed.name;
      stateName = seed.state;
      coords = [seed.lat, seed.lng];
    } else if (user.district_id) {
      try {
        const dist = await locationsApi.getDistrictById(user.district_id);
        distName = dist.name;
        if (dist.latitude && dist.longitude) {
          coords = [dist.latitude, dist.longitude];
        }
      } catch (err) {
        console.warn('Could not resolve district name:', err);
      }
    }

    if (!stateName && user.state_id) {
      try {
        const states = await locationsApi.getStates();
        const foundState = states.find((s) => s.id === user.state_id || s.code === user.state_id);
        if (foundState) {
          stateName = foundState.name;
        }
      } catch (err) {
        console.warn('Could not resolve state name:', err);
      }
    }

    set({
      assignedDistrictName: distName,
      assignedStateName: stateName,
      assignedCoordinates: coords,
    });
  },

  fetchProfile: async () => {
    const token = get().accessToken;
    if (!token) {
      set({ isInitialized: true, user: null });
      return null;
    }

    set({ isLoading: true });
    try {
      const user = await authApi.getMe();
      set({ user, isLoading: false, isInitialized: true });
      await get().resolveGeographicNames(user);
      return user;
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      localStorage.removeItem('sentra_access_token');
      localStorage.removeItem('sentra_refresh_token');
      set({ user: null, accessToken: null, refreshToken: null, isLoading: false, isInitialized: true });
      return null;
    }
  },

  logout: async () => {
    const rt = get().refreshToken;
    if (rt) {
      try {
        await authApi.logout(rt);
      } catch (e) {
        console.warn('Logout API failed:', e);
      }
    }
    localStorage.removeItem('sentra_access_token');
    localStorage.removeItem('sentra_refresh_token');
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      assignedDistrictName: null,
      assignedStateName: null,
      assignedCoordinates: null,
    });
    window.location.href = '/login';
  },
}));
