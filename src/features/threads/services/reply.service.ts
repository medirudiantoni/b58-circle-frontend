import { apiURL } from '@/utils/baseurl';
import axios, { AxiosResponse } from 'axios';

export const createNewReply = async (token: string, data: any) => {
  try {
    const res: AxiosResponse = await axios.post(apiURL + 'reply', data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
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

export const getReplyById = async (token: string, replyId: string) => {
  try {
    const res: AxiosResponse = await axios.get(apiURL + `/reply/${replyId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
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
