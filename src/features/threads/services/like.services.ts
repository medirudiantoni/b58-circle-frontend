import { apiURL } from '@/utils/baseurl';
import axios, { AxiosResponse } from 'axios';

export const fetchCreateLike = async (token: string, data: any) => {
  try {
    const res: AxiosResponse = await axios.post(apiURL + 'like', data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });

    return res.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios Error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Something went wrong');
    } else {
      console.error('Unexpected Error:', error);
      throw error;
    }
  }
};

export const fetchDeleteLike = async (token: string, data: any) => {
  try {
    const res: AxiosResponse = await axios.post(apiURL + 'unlike', data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });

    return res.data.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios Error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Something went wrong');
    } else {
      console.error('Unexpected Error:', error);
      throw error;
    }
  }
};