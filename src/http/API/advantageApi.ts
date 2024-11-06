import { $api, $authHost, baseAdvantage } from "..";

export interface IAdvantageValue {
    id?: number;
    name?: string | null;
    iconSrc?: string | null;
    imageSrc?: string | null;
    description?: string | null;
}

export class AdvantageApi {

    getAdvantages = async () => {
        const { data } = await $api.get(`${baseAdvantage}`)
        return data
    }

    addAdvantage = async (
        advantage: IAdvantageValue,
        icon?: File,
        image?: File
    ) => {
        const formData = new FormData();
        if (advantage.name) {
            formData.append('name', advantage.name);
        }
        if (advantage.description) {
            formData.append('description', advantage.description);
        }
        if (image) {
            formData.append('image', image)
        }
        if (icon) {
            formData.append('icon', icon)
        }
        const { data } = await $authHost.post(`${baseAdvantage}`, formData)
        return data
    }

    changeAdvantageById = async (
        id: number,
        advantage: IAdvantageValue,
        icon?: File,
        image?: File
    ) => {
        const formData = new FormData();
        if (advantage.name) {
            formData.append('name', advantage.name);
        }
        if (advantage.description) {
            formData.append('description', advantage.description);
        }
        if (image) {
            formData.append('image', image)
        }
        if (icon) {
            formData.append('icon', icon)
        }
        const { data } = await $authHost.post(`${baseAdvantage}${id}`, formData)
        return data
    }

    deleteAdvantageById = async (id: number) => {
        const { data } = await $authHost.delete(`${baseAdvantage}${id}`)
        return data
    }
}
