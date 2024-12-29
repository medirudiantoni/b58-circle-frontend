import axios, { AxiosResponse } from 'axios';
import { apiURL } from '@/utils/baseurl';

export const fetchUserById = async (
  token: string,
  userId: string
) => {
  try {
    const res: AxiosResponse = await axios.get(
      apiURL + `user/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data;
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


