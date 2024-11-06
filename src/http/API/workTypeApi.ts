import { $api, $authHost, baseWorkType } from "..";

export interface IWorksTypeValue {
    id?: number;
    name?: string | null;
}

export class WorkTypeApi {

    getWorkTypes = async () => {
        const { data } = await $api.get(`${baseWorkType}`)
        return data
    }

    addWorkType = async (name: string) => {
        const { data } = await $authHost.post(`${baseWorkType}`, { name })
        return data
    }

    changeById = async (id: number, name: string) => {
        const { data } = await $authHost.post(`${baseWorkType}${id}`, { name })
        return data
    }

    deleteById = async (id: number) => {
        const { data } = await $authHost.delete(`${baseWorkType}${id}`)
        return data
    }
}