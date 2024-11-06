import { $api, $authHost, baseOffice } from "..";

export class OfficeApi {
    
    getImages = async () => {
        const { data } = await $api.get(`${baseOffice}`)
        return data
    }

    addImages = async (images: File[]) => {
        const formData = new FormData();
        if (images.length) {
            images.map(image => {
                formData.append('images', image, image.name)
            })
        }
        const { data } = await $authHost.post(`${baseOffice}`, formData)
        return data
    }

    deleteImageById = async (id: number) => {
        const { data } = await $authHost.delete(`${baseOffice}${id}`)
        return data
    }
}