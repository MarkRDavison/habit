export interface Occurence {
    id: string,
    habitId: string,
    createdByUserId: string,
    createdDate: string,
    occurenceDate: Date
}

export interface OccurenceCreationProps {
    habitId: string,
    occurenceDate: Date
}