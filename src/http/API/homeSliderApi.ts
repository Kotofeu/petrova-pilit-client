import { $api, $authHost, baseHomeSlider } from "..";

export class HomeSliderApi {
    
    getImages = async () => {
        const { data } = await $api.get(`${baseHomeSlider}`)
        return data
    }

    addImages = async (images: File[]) => {
        const formData = new FormData();
        if (images.length) {
            images.map(image => {
                formData.append('images', image, image.name)
            })
        }
        const { data } = await $authHost.post(`${baseHomeSlider}`, formData)
        return data
    }

    deleteImageById = async (id: number) => {
        const { data } = await $authHost.delete(`${baseHomeSlider}${id}`)
        return data
    }
}