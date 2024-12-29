import { apiURL } from '@/utils/baseurl';
import axios, { AxiosResponse } from 'axios';

export const createNewThread = async (token: string, data: any) => {
  console.log("thread servis cek gambar: ", data);
  try {
    const res: AxiosResponse = await axios.post(apiURL + 'thread', data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        // Menghitung persentase progress
        let percentCompleted;
        if(progressEvent.total){
          percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
        };
        
        // Update state progress
        // setUploadProgress(percentCompleted);
        
        // Log progress ke console
        console.log(`Upload Progress: ${percentCompleted}%`);
        console.log('Bytes Loaded:', progressEvent.loaded);
        console.log('Total Size:', progressEvent.total);
      }
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

export const getAllThreads = async () => {
  try {
    const res: AxiosResponse = await axios.get(apiURL + 'threads');
    
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

export const getThreadById = async (token: string, idThread: string) => {
  try {
    const res: AxiosResponse = await axios.get(apiURL + `/thread/${idThread}`, {
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

export const getThreadByUserId = async (token: string, userId: string) => {
  try {
    const res: AxiosResponse = await axios.get(apiURL + `/thread/user/${userId}`, {
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

export const updateThreadById = async (token: string, data: any, threadId: string) => {
  try {
    const res: AxiosResponse = await axios.patch(apiURL + `thread/${threadId}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
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

export const deleteThreadById = async (token: string, id: string) => {
  try {
    const res: AxiosResponse = await axios.delete(apiURL + `/thread/${id}`, {
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
