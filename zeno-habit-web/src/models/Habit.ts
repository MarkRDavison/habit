export interface Habit {
    id: string,
    createdByUserId: string,
    name: string,
    question: string,
    createdDate: string
}
export interface HabitCreationProps {
    id: string | undefined,
    name: string,
    question: string
}