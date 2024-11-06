import { $api, $authHost, baseWorkSchedule } from "..";

export interface IWorkScheduleValue {
    id?: number | null;
    name?: string | null;
    shortName?: string | null;
    value?: string | null;
}

export class WorkScheduleApi{
    
    getWorkSchedule = async () => {
        const { data } = await $api.get(`${baseWorkSchedule}`)
        return data
    }

    changeWorkSchedule = async (id: number, value?: string | null) => {
        const { data } = await $authHost.post(`${baseWorkSchedule}${id}`, { value })
        return data
    }

}