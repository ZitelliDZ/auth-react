import { create } from 'zustand';  
import { createJSONStorage, persist } from 'zustand/middleware'
import { authCheckStatus, authLogin, authLogout, authRegister, getUserData, resetPassword, sendResetEmailOtp, sendVerificationEmailOtp, verifyEmailOtp } from '../core/auth/actions/auth-actions'; 


export type AuthStatus = 'authenticated' | 'unauthenticated' | 'checking';

export interface AuthResponse {
  success: boolean;
  message: string;
}

export interface UserDataResponse {
  success: boolean;
  userData: User | undefined;
  message: string;
}

export interface User {
  email: string;
  name: string;
  isAccountVerified: boolean;
}

export interface AuthState {
  status: AuthStatus;
  user?: User;

  login: (email: string, password: string) => Promise<AuthResponse>;
  checkStatus: () => Promise<AuthResponse>;
  logout: () => Promise<AuthResponse>;
  register: (user: { email: string; password: string; name: string }) => Promise<AuthResponse>;

  changeStatus: (success: boolean) => Promise<void>;
  getUser: () => Promise<void>;

  sendVerificationEmail: () => Promise<AuthResponse>;
  verifyEmail: (otp: string) => Promise<AuthResponse>;

  sendResetEmail: (email: string) => Promise<AuthResponse>;
  resetPassword: (otp: string, password: string, email: string) => Promise<AuthResponse>;
}

export const authStore = create<AuthState>()( 
  persist(
    (set, get) => ({
  // Properties
  status: 'checking', 
  user: undefined,

  // Actions
  changeStatus: async (success: boolean) => {
    
    if (!success) {
      set({ status: 'unauthenticated', user: undefined });
       
      return;
    }
    

    set({
      status: 'authenticated'
    });

    await get().getUser();

    return;
  },

  login: async (email: string, password: string) => {
    const resp = await authLogin(email, password);

    await get().changeStatus(resp.success);
    return resp;
  },

  checkStatus: async () => {
    const resp = await authCheckStatus();

    get().changeStatus(resp.success);

    return resp;
  },

  logout: async () => {
    
    const resp = await authLogout();

    get().changeStatus(resp.success);

    return resp;
  },

  register: async (user: { email: string; password: string; name: string }) => {
    const resp = await authRegister(user);

    get().changeStatus(resp.success);

    return resp;
  },

  getUser: async () => {
    const resp = await getUserData();

    if (resp.success) {
      set({ user: resp.user });
    }
 
  },

  sendVerificationEmail: async () => {
    const resp = await sendVerificationEmailOtp();

    get().changeStatus(resp.success);
    
    return resp;
    
  },

  verifyEmail: async (otp: string) => {
    const resp = await verifyEmailOtp(otp);

    get().changeStatus(resp.success);
    
    return resp;
  },

  sendResetEmail: async (email: string) => {
    const resp = await sendResetEmailOtp(email);

    return resp;
  },

  resetPassword: async (otp: string, password: string, email: string) => {
    const resp = await resetPassword(otp, password, email); 

    return resp;
  }


}),
{
  name: 'auth-storage',
  storage: createJSONStorage(() => sessionStorage),
},
),

);