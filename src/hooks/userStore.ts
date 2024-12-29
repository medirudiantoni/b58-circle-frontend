import { UserDataType, UserType } from '@/types/user.types';
import { create } from 'zustand';

interface UserState {
  user: UserType | null;
  userData: UserDataType | null;
  setUser: (user: UserType) => void;
  setUserData: (user: UserDataType) => void;
  clearUser: () => void;
  clearUserData: () => void;
}
const useUserStore = create<UserState>((set) => ({
  user: null,
  userData: null,
  setUser: (user) => set({ user: user }),
  setUserData: (userData) => set({ userData: userData }),
  clearUser: () => set({ user: null }),
  clearUserData: () => set({ userData: null }),
}));

export default useUserStore;