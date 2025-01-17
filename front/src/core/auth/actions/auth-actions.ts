
import axios from 'axios';
import { messageError } from '../../../helpers/messageError';
import { UserDataResponse } from '../../../store/authStore';
import { authMernApi } from '../../api/authMernApi';



export interface AuthResponse {
  success: boolean;
  message: string;
}



export const authLogin = async (email: string, password: string) => {
  email = email.toLowerCase();

  try {
    const { data } = await authMernApi.post<AuthResponse>('/auth/login', {
      email,
      password,
    });


    return data;
  } catch (error) {
    return messageError(error);
  }
};

export const authCheckStatus = async () => {
  try {
    const { data } = await authMernApi.get<AuthResponse>('/auth/is-authenticated');

    return data;
  } catch (error) {
    return messageError(error);
  }
};

export const authLogout = async () => {
  try {
    const { data } = await authMernApi.get<AuthResponse>('/auth/logout');

    return data;
  } catch (error) {
    return messageError(error);
  }
};

export const authRegister = async ( user: { email: string; password: string; name: string }) => {
  try {
    const { data } = await authMernApi.post<AuthResponse>('/auth/register', user);

    return data;
  } catch (error) {
    return messageError(error);
  }
};

export const getUserData = async () => {
  try {
    const { data } = await axios.get<UserDataResponse>( import.meta.env.VITE_BACKEND_URL + '/user/get-user-data');
     

    return {
      success: true,
      user: data.userData,
      message: ''
    }
  } catch (error) {
    const resp = messageError(error);
    return {
      success: resp.success,
      message: resp.message,
      user: undefined,
    }
  }
};

export const sendVerificationEmailOtp = async () => {
  try {
    const { data } = await authMernApi.post<AuthResponse>('/auth/send-verify-otp');

    return data;
  } catch (error) {
    return messageError(error);
  }
};

export const verifyEmailOtp = async (otp: string) => {
  try {
    const { data } = await authMernApi.post<AuthResponse>('/auth/verify-otp', { otp });

    return data;
  } catch (error) {
    return messageError(error);
  }

}
export const sendResetEmailOtp = async (email: string) => {
  try {
    const { data } = await authMernApi.post<AuthResponse>('/auth/send-reset-otp', { email });

    return data;
  } catch (error) {
    return messageError(error);
  }
};

export const resetPassword = async (otp: string, password: string,email : string) => {
  try {
    const { data } = await authMernApi.post<AuthResponse>('/auth/reset-password', { otp, newPassword:password , email});

    return data;
  } catch (error) {
    return messageError(error);
  }
};

