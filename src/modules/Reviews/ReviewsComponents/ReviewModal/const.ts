import { IImages } from "../../../../store"

export const NAME = 'name'
export const RATING = 'rating'
export const COMMENT = 'comment'
export const IMAGES = 'images'
export const INITIAL_IMAGES = 'initial_images'
export const DELETED_IDS = 'deleted_ids'
export const MAX_COMMENT_LENGTH = 2000
export const MAX_NAME_LENGTH = 50


export interface IValues {
    [NAME]: string,
    [RATING]: number,
    [COMMENT]: string,
    [IMAGES]: File[],
    [INITIAL_IMAGES]: IImages[],
    [DELETED_IDS]: number[]
}

export interface IReviewForm {
    isUserAuth?: boolean;
    isUserAdmin?: boolean;
    isOpen: boolean;
    formValues: IValues;
    onDeleteClick?: () => Promise<void>;
    fromAction: () => void | Promise<void>;
    setFormValues: React.Dispatch<React.SetStateAction<IValues>>
    startAuth?: () => void;
}
