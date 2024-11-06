import { AxiosError } from 'axios';
import { makeAutoObservable } from 'mobx'
import {
    ABOUT_ROUTE,
    ADMIN_ROUTE,
    HOME_ROUTE,
    REVIEWS_ROUTE,
    USER_ROUTE,
    WORKS_ROUTE
} from '../utils/const/routes';
import defaultOfficeImage1 from '../assets/images/defaultImages/office/office_1.jpeg'
import defaultOfficeImage2 from '../assets/images/defaultImages/office/office_2.jpeg'
import defaultOfficeImage3 from '../assets/images/defaultImages/office/office_3.jpeg'
import defaultSliderImage from '../assets/images/defaultImages/mainSlider/main_slider_1.jpeg'

import { IGetAllJSON, IImages } from '.';
import { advantageApi, contactApi, homeSliderApi, IAdvantageValue, IContactsValue, IMainInfoValue, mainInfoApi, officeApi, workScheduleApi } from '../http';


export interface ILink {
    name?: string;
    link?: string;
}

export interface IContactLink extends IContactsValue {
    id: number;
}
export interface ICreateContactLink extends IContactsValue {
    imageFile?: File;
}

export interface IAdvantages extends IAdvantageValue {
    id: number;
}

export interface ICreateAdvantages extends IAdvantageValue {
    iconFile?: File;
    imageFile?: File;
}


export interface IWorkSchedule {
    id: number;
    name?: string | null;
    shortName?: string | null;
    value?: string | null;
}

export class ApplicationStore {
    constructor() {
        makeAutoObservable(this, {}, { deep: true })
    }
    private _headerLinks: ILink[] = [
        { name: "Главная", link: HOME_ROUTE },
        { name: "Обо мне", link: ABOUT_ROUTE },
        { name: "Мои работы", link: WORKS_ROUTE },
        { name: "Отзывы", link: REVIEWS_ROUTE }
    ];
    private _headerAdminLinks: ILink[] = [
        { name: "Клиенты", link: USER_ROUTE },
        { name: "Админка", link: ADMIN_ROUTE }
    ]
    private _generalData: IMainInfoValue = {
        promoBanner: null,
        addressMap: null,
        aboutMe: null,
        howToGetPreview: null,
        howToGetVideo: null,
    }
    private _contactLinks: IContactLink[] = []
    private _homeSlider: IImages[] = []
    private _defaultHomeSlider: IImages[] = [
        {
            id: -1,
            imageSrc: defaultSliderImage
        }
    ]
    private _officeImages: IImages[] = []
    private _defaultOfficeImages: IImages[] = [
        {
            id: -1,
            imageSrc: defaultOfficeImage1
        },
        {
            id: -2,
            imageSrc: defaultOfficeImage2
        },
        {
            id: -3,
            imageSrc: defaultOfficeImage3
        }
    ]
    private _advantages: IAdvantages[] = []
    private _workSchedule: IWorkSchedule[] = [
        {
            id: 1,
            name: "Понедельник",
            shortName: "Пн."
        },
        {
            id: 2,
            name: "Вторник",
            shortName: "Вт."
        },
        {
            id: 3,
            name: "Среда",
            shortName: "Ср."
        },
        {
            id: 6,
            name: "Суббота",
            shortName: "Сб."
        },
        {
            id: 7,
            name: "Воскресенье",
            shortName: "Вс."
        },
        {
            id: 4,
            name: "Четверг",
            shortName: "Чт."
        },
        {
            id: 5,
            name: "Пятница",
            shortName: "Пт."
        }
    ]


    private _error: string | null = null
    private _isLoading: boolean = false


    get promoBanner() {
        return this._generalData.promoBanner;
    }
    get headerLinks() {
        return this._headerLinks
    }
    get headerAdminLinks() {
        return this._headerAdminLinks
    }
    get contactLinks() {
        return this._contactLinks
    }
    get homeSlider() {
        return this._homeSlider
    }
    get defaultHomeSlider() {
        return this._defaultHomeSlider
    }
    get advantages() {
        return this._advantages
    }
    get addressMap() {
        return this._generalData.addressMap
    }
    get officeImages() {
        return this._officeImages
    }
    get defaultOfficeImages() {
        return this._defaultOfficeImages
    }
    get howToGetVideo() {
        return this._generalData.howToGetVideo
    }

    get howToGetPreview() {
        return this._generalData.howToGetPreview
    }
    get aboutMe() {
        return this._generalData.aboutMe
    }
    get workSchedule() {
        return this._workSchedule
    }

    get isLoading() {
        return this._isLoading;
    }

    get error() {
        return this._error;
    }

    async handleAction<T>(action: () => Promise<T>): Promise<T | undefined> {
        this._error = '';
        this._isLoading = true;

        try {
            return await action();
        } catch (err) {
            if (err instanceof AxiosError) {
                this._error = err.response?.data.message || err.message;
            } else {
                this._error = `${err}`;
            }
        } finally {
            this._isLoading = false;
        }
    }

    // Контакты
    setContactsLinks(contactLinks: IContactLink[]) {
        this._contactLinks = contactLinks
    }

    async changeContactLink(id: number, contactLink: IContactsValue, image?: File) {
        const updatedContact = await this.handleAction<IContactLink>(() => contactApi.changeContactById(id, contactLink, image));
        if (!this._error && updatedContact) {
            this._contactLinks = this._contactLinks.map((contact) => contact.id === updatedContact.id ? updatedContact : contact)
        }
    }

    async addContactLink(contactLink: IContactsValue, image: File) {
        const createdContact = await this.handleAction<IContactLink>(() => contactApi.addContact(contactLink, image));
        if (!this._error && createdContact) {
            this._contactLinks.push(createdContact)
        }
    }

    async deleteContactLink(id: number) {
        await this.handleAction(() => contactApi.deleteContactById(id))
        if (!this._error) {
            this._contactLinks = this._contactLinks.filter((contact) => contact.id !== id)
        }
    }

    // Преимущества 
    setAdvantages(advantages: IAdvantages[]) {
        this._advantages = advantages
    }
    async changeAdvantages(id: number, advantage: IAdvantages, icon?: File) {
        const updatedAdvantage = await this.handleAction<IAdvantages>(() => advantageApi.changeAdvantageById(id, advantage, icon));
        if (!this._error && updatedAdvantage) {
            this._advantages = this._advantages.map((advantage) => advantage.id === updatedAdvantage.id ? updatedAdvantage : advantage)
        }
    }

    async addAdvantage(advantage: IAdvantageValue, icon: File) {
        const createdAdvantage = await this.handleAction<IAdvantages>(() => advantageApi.addAdvantage(advantage, icon));
        if (!this._error && createdAdvantage) {
            this._advantages.push(createdAdvantage)
        }
    }

    async deleteAdvantages(id: number) {
        await this.handleAction(() => advantageApi.deleteAdvantageById(id))
        if (!this._error) {
            this._advantages = this._advantages.filter((advantage) => advantage.id !== id)
        }
    }

    // Картинки слайдера
    setSliderImages(sliderImages: IImages[]) {
        this._homeSlider = sliderImages
    }

    async addMainSlider(images: File[]) {
        await this.handleAction(() => homeSliderApi.addImages(images));
        if (!this._error) {
            const newImages: IGetAllJSON<IImages> = await homeSliderApi.getImages()
            this.setSliderImages(newImages.rows)
        }
    }

    async deleteMainSlider(id: number) {
        await this.handleAction(() => homeSliderApi.deleteImageById(id))
        if (!this._error) {
            this._homeSlider = this._homeSlider.filter(image => image.id !== id);
        }
    }

    // Картинки офиса 

    setOfficeImages(officeImages: IImages[]) {
        this._officeImages = officeImages
    }

    async addOfficeImage(images: File[]) {
        await this.handleAction(() => officeApi.addImages(images));
        if (!this._error) {
            const newImages: IGetAllJSON<IImages> = await officeApi.getImages()
            this.setOfficeImages(newImages.rows)
        }
    }

    async deleteOfficeImage(id: number) {
        await this.handleAction(() => officeApi.deleteImageById(id))
        if (!this._error) {
            this._officeImages = this._officeImages.filter(image => image.id !== id);
        }
    }

    // График работы
    setWorkSchedule(workSchedule: IWorkSchedule[]) {
        this._workSchedule = workSchedule
    }

    async changeWorkSchedule(workDay: IWorkSchedule) {
        await this.handleAction(() => workScheduleApi.changeWorkSchedule(workDay.id, workDay.value))
        if (!this._error) {
            this._workSchedule = this._workSchedule.map(day => day.id === workDay.id ? workDay : day);
        }
    }


    setGeneralData(generalData: IMainInfoValue) {
        this._generalData = generalData
    }
    async changeHowToGetPreview(preview: File) {
        await this.handleAction(() => mainInfoApi.changeHowToGetPreview(preview))
        if (!this._error) {
            this._generalData.howToGetPreview = URL.createObjectURL(preview)
        }
    }
    async changeHowToGetVideo(video: File) {
        await this.handleAction(() => mainInfoApi.changeHowToGetVideo(video))
        if (!this._error) {
            this._generalData.howToGetVideo = URL.createObjectURL(video)
        }
    }
    async changePromoBanner(text: string) {
        await this.handleAction(() => mainInfoApi.changePromoBanner(text))
        if (!this._error) {
            this._generalData.promoBanner = text
        }
    }

    async setAddressMap(address: string) {
        await this.handleAction(() => mainInfoApi.changeAddressMap(address))
        if (!this._error) {
            this._generalData.addressMap = address
        }
    }

    async setAboutMe(aboutMe: string) {
        await this.handleAction(() => mainInfoApi.changeAboutMe(aboutMe))
        if (!this._error) {
            this._generalData.aboutMe = aboutMe
        }
    }

    setError(error: string) {
        if (error !== this._error) {
            this._error = error
        }
    }
}