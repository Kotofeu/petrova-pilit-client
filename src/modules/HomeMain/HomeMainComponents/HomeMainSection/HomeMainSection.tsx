import { useRef, memo, useEffect } from "react"

import Section from "../../../../components/Section/Section"
import { HomeMainSlider } from "../HomeMainSlider/HomeMainSlider"
import Arrow from '../../../../assets/icons/Arrow.svg'

import classes from './HomeMainSection.module.scss'
import ContactList from "../../../../components/ContactList/ContactList"
import { classConnection } from "../../../../utils/function"
import useRequest from "../../../../utils/hooks/useRequest"
import { homeSliderApi } from "../../../../http"
import { applicationStore, IGetAllJSON, IImages } from "../../../../store"
import { useMessage } from "../../../MessageContext"

export const HomeMainSection = memo(() => {
    const { addMessage } = useMessage()

    const [
        sliderImages,
        sliderImagesIsLoading,
        sliderImagesError
    ] = useRequest<IGetAllJSON<IImages>>(homeSliderApi.getImages);
   
    const homeMainBottom = useRef<HTMLDivElement>(null)
 
    const lookMoreClick = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault()
        if (homeMainBottom.current) {
            homeMainBottom.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        }
    }

    useEffect(() => {
        if (sliderImagesError && sliderImagesError !== applicationStore.error) {
            applicationStore.setError(sliderImagesError)
            addMessage(sliderImagesError, 'error')
        }
    }, [sliderImagesError])

    useEffect(() => {
        if (sliderImages?.rows.length) {
            applicationStore.setSliderImages(sliderImages.rows)
        }
    }, [sliderImages])
    
    return (
        <Section className={classes.homeMain} isUnderline>
            <div className={classes.homeMain__titleBox}>
                <span className={classConnection(classes.homeMain__titleDecoration, classes.homeMain__titleDecoration_reverse)} />
                <h1 className={classes.homeMain__title}>PETROVA PILIT</h1>
                <span className={classes.homeMain__titleDecoration} />
            </div>
            <div className={classes.homeMain__content}>
                <div className={classes.homeMain__contact}>
                    <ContactList
                        className={classes.homeMain__links}
                    />
                    <h6 className={classes.homeMain__contactDecoration}>Связь со мной</h6>

                </div>
                <HomeMainSlider isLoading={sliderImagesIsLoading && !sliderImages} />
                <div className={classes.homeMain__lookMore}>
                    <button
                        className={classes.homeMain__lookMoreArrow}
                        onClick={lookMoreClick}
                        type="button"
                        aria-label="Перемотать ниже"
                        title="Перемотать ниже"
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span>
                            <img className={classes.homeMain__lookMoreIcon} src={Arrow} alt='arrow' />
                        </span>

                    </button>
                </div>
            </div>
            <div ref={homeMainBottom} />
        </Section>
    )
})