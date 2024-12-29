import { ThreadDataType } from "@/types/thread.types";
import { create } from "zustand";

interface UseThreadState {
    threads: ThreadDataType[] | null,
    setThreads: (data: ThreadDataType[]) => void,
    clearThreads: () => void,
};

const useThreadStore = create<UseThreadState>(set => ({
    threads: null,
    setThreads: (data) => set({ threads: data }),
    clearThreads: () => set({ threads: null })
}));

export default useThreadStore;