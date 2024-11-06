import { $api, $authHost, baseContact } from "..";

export interface IContactsValue {
    id?: number;
    name?: string | null;
    link?: string | null;
    imageSrc?: string | null;
}

export class ContactApi {

    getContacts = async () => {
        const { data } = await $api.get(`${baseContact}`)
        return data
    }

    addContact = async (
        contact: IContactsValue,
        image: File
    ) => {
        const formData = new FormData();
        if (contact.name) {
            formData.append('name', contact.name);
        }
        if (contact.link) {
            formData.append('link', contact.link);
        }
        if (image) {
            formData.append('image', image)
        }
        const { data } = await $authHost.post(`${baseContact}`, formData)
        return data
    }

    changeContactById = async (
        id: number,
        contact: IContactsValue,
        image?: File
    ) => {
        const formData = new FormData();
        if (contact.name) {
            formData.append('name', contact.name);
        }
        if (contact.link) {
            formData.append('link', contact.link);
        }
        if (image) {
            formData.append('image', image)
        }
        const { data } = await $authHost.post(`${baseContact}${id}`, formData)
        return data
    }

    deleteContactById = async (id: number) => {
        const { data } = await $authHost.delete(`${baseContact}${id}`)
        return data
    }
}

