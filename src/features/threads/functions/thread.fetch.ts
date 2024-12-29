import Cookies from 'js-cookie';
import { getAllThreads } from '../services/thread.services';
import { ThreadDataType } from '@/types/thread.types';

async function retrieveAllThreads(threadHook: (threads: ThreadDataType[]) => void) {
  const token = Cookies.get('token');
  try {
    if (token) {
      const threads = await getAllThreads();
      threadHook(threads);
    } else {
      throw new Error('Invalid token');
    }
  } catch (error) {
    console.log(error);
  }
}

export default retrieveAllThreads;
