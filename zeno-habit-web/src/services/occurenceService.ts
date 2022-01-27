/* istanbul ignore file */
import axios from 'axios';
import { Occurence, OccurenceCreationProps } from '../models/Occurence';

export interface OccurenceService {
    getOccurencesWithinDateRange: (habitIds: string[], startDate: Date, endDate: Date) => Promise<Occurence[]>
    postOccurence: (occurence: OccurenceCreationProps) => Promise<Occurence>
};

const rehydrate = (o: Occurence): Occurence => {
    return {
        ...o,
        occurenceDate: new Date(o.occurenceDate)
    }
};

const getOccurencesWithinDateRange = async (habitIds: string[], startDate: Date, endDate: Date): Promise<Occurence[]> => {
    const response = await axios.get<Occurence[]>('/api/occurence');
    let data = response.data as Occurence[];
    data = response.data.map(o => {
        return {
            ...o,
            occurenceDate: new Date(o.occurenceDate)
        };
    });
    return data;
};

const postOccurence = async (occurence: OccurenceCreationProps): Promise<Occurence> => {
    const response = await axios.post<Occurence>('/api/occurence', occurence);
    return rehydrate(response.data);
}

const occurenceService: OccurenceService = {
    getOccurencesWithinDateRange: getOccurencesWithinDateRange,
    postOccurence: postOccurence
};

export default occurenceService;