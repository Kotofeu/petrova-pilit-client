import axios from 'axios';
import { IUser } from '../store';
import { ContactApi } from './API/contactApi';
import { AdvantageApi } from './API/advantageApi';
import { UserApi } from './API/userApi';
import { ServiceApi } from './API/serviceApi';
import { HomeSliderApi } from './API/homeSliderApi';
import { OfficeApi } from './API/officeApi';
import { MainInfoApi } from './API/mainInfoApi';
import { WorkTypeApi } from './API/workTypeApi';
import { WorkApi } from './API/workApi';
import { ReviewApi } from './API/reviewApi';
import { WorkScheduleApi } from './API/workScheduleApi';

const baseAPI = `${process.env.REACT_APP_API_URL}/api/`;
export const baseUser = `${baseAPI}user/`;
export const baseOffice = `${baseAPI}office/`;
export const baseHomeSlider = `${baseAPI}home-slider/`;
export const baseContact = `${baseAPI}contact/`;
export const baseAdvantage = `${baseAPI}advantage/`;
export const baseService = `${baseAPI}service/`;
export const baseMain = `${baseAPI}main/`;
export const baseWorkType = `${baseAPI}work-type/`;
export const baseWork = `${baseAPI}work/`;
export const baseReview = `${baseAPI}review/`;
export const baseWorkSchedule = `${baseAPI}work-schedule/`;

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: IUser;
}
export interface IGetParams {
    page?: number;
    limit?: number;
}
export const $api = axios.create({
    withCredentials: true,
    baseURL: baseAPI
})

export const $authHost = axios.create({
    withCredentials: true,
    baseURL: baseAPI
})

$authHost.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('accessToken')}`
    return config;
})

$authHost.interceptors.response.use((config) => {
    return config;
}, async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && error.config && !error.config._isRetry) {
        originalRequest._isRetry = true;
        try {
            const response = await axios.post<AuthResponse>(`${baseUser}refresh`, {}, {
                withCredentials: true
            });
            localStorage.setItem('accessToken', response.data.accessToken);
            return $authHost.request(originalRequest);
        } catch (e) {
            localStorage.removeItem('accessToken');
            console.log('НЕ АВТОРИЗОВАН');
        }
    }
    throw error;
});

export type { IAdvantageValue } from './API/advantageApi'
export type { IContactsValue } from './API/contactApi'
export type { IMainInfoValue } from './API/mainInfoApi'
export type { IServiceValue } from './API/serviceApi'
export type { IUserValue, ILoginParams, IActiveParams } from './API/userApi'
export type { IWorksTypeValue } from './API/workTypeApi'
export type { IWorkValue, IWorkGetParam } from './API/workApi'
export type { IReviewValue, IReviewGetParam } from './API/reviewApi'
export type { IWorkScheduleValue } from './API/workScheduleApi'

export const contactApi = new ContactApi();
export const advantageApi = new AdvantageApi();
export const userApi = new UserApi();
export const serviceApi = new ServiceApi();
export const homeSliderApi = new HomeSliderApi();
export const officeApi = new OfficeApi();
export const mainInfoApi = new MainInfoApi();
export const workTypeApi = new WorkTypeApi();
export const workApi = new WorkApi();
export const reviewApi = new ReviewApi();
export const workScheduleApi = new WorkScheduleApi();