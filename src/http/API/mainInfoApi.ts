import { $api, $authHost, baseMain } from "..";

export interface IMainInfoValue {
    promoBanner?: string | null;
    aboutMe?: string | null;
    addressMap?: string | null;
    howToGetVideo?: string | null;
    howToGetPreview?: string | null;
}

export class MainInfoApi {
    getInfos = async () => {
        const { data } = await $api.get(`${baseMain}`)
        return data
    }

    changePromoBanner = async (value: string) => {
        const { data } = await $authHost.post(`${baseMain}promoBanner`, { value })
        return data
    }
    changeAboutMe = async (value: string) => {
        const { data } = await $authHost.post(`${baseMain}aboutMe`, { value })
        return data
    }
    changeAddressMap = async (value: string) => {
        const { data } = await $authHost.post(`${baseMain}addressMap`, { value })
        return data
    }
    changeHowToGetVideo = async (video: File) => {
        const formData = new FormData();
        if (video) {
            formData.append('file', video)
        }
        const { data } = await $authHost.post(`${baseMain}howToGetVideo`, formData)
        return data
    }
    changeHowToGetPreview = async (image: File) => {
        const formData = new FormData();
        if (image) {
            formData.append('file', image)
        }
        const { data } = await $authHost.post(`${baseMain}howToGetPreview`, formData)
        return data
    }
}