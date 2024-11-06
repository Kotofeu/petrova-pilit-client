import { ApplicationStore } from './ApplicationStore'
import { WorksStore } from './WorksStore'
import { ServicesStore } from './ServicesStore'
import { ReviewsStore } from './ReviewsStore'
import { UserStore } from './UserStore'
import { EmailConfirmStore } from './EmailConfirmStore'
import { RegistrationStore } from './RegistrationStore'

export type { ILink } from './ApplicationStore'
export type { IReview, IReviewAllJSON} from './ReviewsStore'
export type { IWork } from './WorksStore'
export type { IWorksType } from './WorksStore'
export type { IUser } from './UserStore'
export type { IService } from './ServicesStore'
export type {IWorkSchedule} from './ApplicationStore'
export type {IAdvantages} from './ApplicationStore'
export type {ICreateAdvantages} from './ApplicationStore'
export type {IContactLink} from './ApplicationStore'
export type {ICreateContactLink} from './ApplicationStore'

export { REGISTRATION, AUTHORIZATION, PASSWORD_RECOVERY } from './RegistrationStore'


export interface IGetAllJSON<T> {
    count: number;
    rows: T[];
}
export interface IImages {
    id: number;
    imageSrc?: string | null;
    name?: string | null;

}

export const applicationStore = new ApplicationStore()
export const worksStore = new WorksStore()
export const servicesStore = new ServicesStore()
export const reviewsStore = new ReviewsStore()
export const userStore = new UserStore()
export const emailConfirmStore = new EmailConfirmStore()
export const registrationStore = new RegistrationStore()