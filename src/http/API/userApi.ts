import { $api, $authHost, AuthResponse, baseUser } from "..";
import { IReview } from "../../store";


export interface IUserValue {
    id?: number;
    name?: string | null;
    imageSrc?: string | null;
    visitsNumber?: number | null;
    email?: string;
    phone?: string | null;
    role?: 'ANON' | 'USER' | 'ADMIN' | null;
    review?: IReview | null;
}

export interface ILoginParams {
    email: string;
    password: string;
}
export interface IActiveParams {
    email: string;
    code: string;
}

export class UserApi {

    private catchData = (data: any): AuthResponse | any => {
        if (data && data?.accessToken && data?.user && data?.refreshToken) {
            localStorage.setItem('accessToken', data.accessToken)
            return {
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
                user: data.user
            }
        }
        return data
    }

    registration = async (password: string) => {
        const { data } = await $api.post(`${baseUser}registration`, { password })
        return this.catchData(data)
    }

    recoverUser = async (password: string) => {
        const { data } = await $api.post(`${baseUser}recover`, { password })
        return this.catchData(data)
    }

    changeUserEmail = async (newEmail: string) => {
        const { data } = await $authHost.post(`${baseUser}change-email`, { newEmail })
        return this.catchData(data)
    }

    recoverUserSendCode = async (email: string) => {
        const { data } = await $api.post(`${baseUser}recover-send-code`, { email })
        return data
    }

    changeEmailSendCode = async (newEmail: string) => {
        const { data } = await $authHost.post(`${baseUser}change-email-send-code`, { newEmail })
        return this.catchData(data)
    }

    newUserSendCode = async (email: string) => {
        const { data } = await $api.post(`${baseUser}new-user-send-code`, { email })
        return this.catchData(data)
    }

    activate = async (email: string, code: string) => {
        const { data } = await $api.post(`${baseUser}activate`, { email, code })
        return this.catchData(data)
    }

    login = async ({ email, password }: ILoginParams) => {
        const { data } = await $api.post(`${baseUser}login`, { email, password })
        return this.catchData(data)
    }

    logout = async () => {
        const { data } = await $authHost.post(`${baseUser}logout`)
        if (data) {
            localStorage.removeItem('accessToken')
        }
        return this.catchData(data)
    }

    refresh = async () => {
        const { data } = await $authHost.post(`${baseUser}refresh`)
        if (!data) {
            localStorage.removeItem('accessToken')
        }
        return this.catchData(data)
    }

    giveRole = async (id: number, role: 'ANON' | 'USER' | 'ADMIN') => {
        const { data } = await $authHost.post(`${baseUser}give-role`, { id, role })
        return this.catchData(data)
    }

    changeUserById = async (id: number, user: IUserValue, image?: File) => {
        const formData = new FormData();
        if (user.name) {
            formData.append('name', user.name);
        }
        if (user.visitsNumber) {
            formData.append('visitsNumber', `${user.visitsNumber}`);
        }
        if (user.phone) {
            formData.append('phone', user.phone)
        }
        if (image) {
            formData.append('image', image)
        }
        const { data } = await $authHost.post(`${baseUser}change/${id}`, formData)
        return this.catchData(data)
    }

    changeUserImage = async (image: File | null) => {
        const formData = new FormData();
        formData.append('image', image || '');

        const { data } = await $authHost.post(`${baseUser}change-image`, formData)
        return this.catchData(data)
    }

    changeUserName = async (name: string) => {
        const { data } = await $authHost.post(`${baseUser}change-name`, { name })
        return this.catchData(data)
    }

    changeUserPhone = async (phone: string) => {
        const { data } = await $authHost.post(`${baseUser}change-phone`, { phone })
        return this.catchData(data)
    }
    changeUserPassword = async (password: string) => {
        const { data } = await $authHost.post(`${baseUser}change-password`, { password })
        return this.catchData(data)
    }
    getAllUsers = async () => {
        const { data } = await $authHost.get(`${baseUser}all`)
        return this.catchData(data)
    }

    getUserById = async (id: number) => {
        const { data } = await $authHost.get(`${baseUser}${id}`)
        return this.catchData(data)
    }

    deleteUser = async () => {
        const { data } = await $authHost.delete(`${baseUser}`)
        if (data) {
            localStorage.removeItem('accessToken')
        }
        return this.catchData(data)
    }

    deleteUserById = async (id: number) => {
        const { data } = await $authHost.delete(`${baseUser}${id}`)
        return this.catchData(data)
    }
}
