import { create } from "zustand";
import { timeToMinutes } from "@/utils/time";

interface ScheduleState {
  selectedDate: Date | undefined;
  isEditing: boolean;
  startTime: string;
  endTime: string;
  setSelectedDate: (date: Date | undefined) => void;
  setIsEditing: (editing: boolean) => void;
  setStartTime: (time: string) => void;
  setEndTime: (time: string) => void;
  resetForm: () => void;
  initializeForm: (startTime?: string, endTime?: string) => void;
}

export const useScheduleStore = create<ScheduleState>((set) => ({
  selectedDate: new Date(),
  isEditing: false,
  startTime: "",
  endTime: "",

  setSelectedDate: (date) => {
    set({ selectedDate: date, isEditing: false });
  },

  setIsEditing: (editing) => {
    set({ isEditing: editing });
  },

  setStartTime: (time) => {
    set((state) => {
      // Reset end time if it's no longer valid
      let newEndTime = state.endTime;
      if (state.endTime && time) {
        const startMinutes = timeToMinutes(time);
        const endMinutes = timeToMinutes(state.endTime);
        if (endMinutes <= startMinutes) {
          newEndTime = "";
        }
      }
      return { startTime: time, endTime: newEndTime };
    });
  },

  setEndTime: (time) => {
    set({ endTime: time });
  },

  resetForm: () => {
    set({ startTime: "", endTime: "", isEditing: false });
  },

  initializeForm: (startTime = "", endTime = "") => {
    set({ startTime, endTime });
  },
}));
