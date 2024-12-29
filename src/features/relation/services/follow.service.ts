import axios, { AxiosResponse } from 'axios';
import { apiURL } from '@/utils/baseurl';

export const fetchFollowingAction = async (
  token: string,
  data: any,
  subjectId: string
) => {
  try {
    const res: AxiosResponse = await axios.post(
      apiURL + `relation/follow/${subjectId}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
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

export const fetchUnfollowingAction = async (
  token: string,
  data: any,
  subjectId: string
) => {
  try {
    const res: AxiosResponse = await axios.post(
      apiURL + `relation/unfollow/${subjectId}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
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

export const fetchFollowingUsers = async (
  token: string,
  subjectId: string
) => {
  try {
    const res: AxiosResponse = await axios.get(
      apiURL + `relation/following/${subjectId}`,
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

export const fetchFollowerUsers = async (
  token: string,
  subjectId: string
) => {
  try {
    const res: AxiosResponse = await axios.get(
      apiURL + `relation/followers/${subjectId}`,
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


