/* istanbul ignore file */

import axios from 'axios';
import { Habit, HabitCreationProps } from '../models/Habit';
import Constants from '../models/Helpers';


export interface HabitService {
    getHabits: () => Promise<Habit[]>
    postHabit: (habit: Habit) => Promise<Habit>
    patchHabit: (habit: Habit) => Promise<Habit>
    deleteHabit: (id: string) => Promise<boolean>
}

const transformForPost = (habit: Habit): HabitCreationProps => {
    return {
        id: Constants.EmptyGuid,
        name: habit.name,
        question: habit.question
    };
};

const getHabits = async (): Promise<Habit[]> => {
    const response = await axios.get<Habit[]>('/api/habit');
    return response.data;
};

const postHabit = async (habit: Habit): Promise<Habit> => {
    const newHabit = transformForPost(habit);
    const response = await axios.post<Habit>('/api/habit', newHabit);
    return response.data;
};

const patchHabit = async (habit: Habit): Promise<Habit> => {
    const response = await axios.patch<Habit>(`/api/habit/${habit.id}`, habit);
    return response.data;
};

const deleteHabit = async (id: string): Promise<boolean> => {
    await axios.delete(`/api/habit/${id}`);
    return true;
}

const habitService: HabitService = {
    getHabits: getHabits,
    postHabit: postHabit,
    patchHabit: patchHabit,
    deleteHabit: deleteHabit
};

export default habitService;