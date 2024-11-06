import { FC, useState, useEffect, useCallback } from 'react'
import Modal from '../../../../components/Modal/Modal';
import { ReviewFormMain } from './ReviewFormMain';
import { ReviewFormImages } from './ReviewFormImages';
import { COMMENT, DELETED_IDS, IMAGES, INITIAL_IMAGES, IValues, NAME, RATING } from './const';

import classes from './ReviewModal.module.scss'
import { AnimatePresence } from 'framer-motion';
import { observer } from 'mobx-react-lite';
import { IReview, registrationStore, userStore } from '../../../../store';
interface IReviewModal {
    isOpen: boolean;
    userReview?: IReview;
    closeModal: () => void;
    deleteReview?: () => Promise<void>;
    action: (review: IValues) => Promise<void>
}

const initialValues: IValues = {
    [NAME]: "",
    [RATING]: 0,
    [COMMENT]: "",
    [IMAGES]: [],
    [INITIAL_IMAGES]: [],
    [DELETED_IDS]: []
};

export const ReviewModal: FC<IReviewModal> = observer(({
    isOpen,
    userReview,
    closeModal,
    deleteReview,
    action
}) => {
    const [formValues, setFormValues] = useState(initialValues);
    const [isMainOpen, setIsMainOpen] = useState<boolean>(true)

    useEffect(() => {
        if (!isOpen && !userReview) {
            if (userStore.user?.name && !userStore.isAdmin) {
                setFormValues({ ...initialValues, [NAME]: userStore.user?.name });
            }
            else {
                setFormValues(initialValues);
            }
        }
        else if (userReview) {
            setFormValues({
                name: userReview.user?.name || '',
                rating: userReview.rating || 0,
                comment: userReview.comment || '',
                images: [],
                initial_images: userReview.reviews_images || [],
                deleted_ids: []
            })
        }
        if (!isOpen) setIsMainOpen(true);
    }, [isOpen]);

    const completeAction = async () => {
        await action(formValues)
    }
    const startAuth = () => {
        registrationStore.setIsOpen(true)
        closeModal()
    }
    return (
        <Modal className={classes.reviewModal} isOpen={isOpen} closeModal={closeModal} >
            <AnimatePresence>
                <ReviewFormMain
                    key={'ReviewFormMain'}
                    isOpen={isMainOpen}
                    formValues={formValues}
                    onDeleteClick={deleteReview}
                    setFormValues={setFormValues}
                    fromAction={() => setIsMainOpen(false)}
                    isUserAuth={userStore.isAuth || !!userReview?.user}
                    isUserAdmin={userStore.isAdmin}
                    startAuth={startAuth}
                />
                <ReviewFormImages
                    key={'ReviewFormImages'}
                    isOpen={!isMainOpen}
                    formValues={formValues}
                    onDeleteClick={deleteReview}
                    setFormValues={setFormValues}
                    fromAction={completeAction}
                />
            </AnimatePresence>
        </Modal>
    );
}) 