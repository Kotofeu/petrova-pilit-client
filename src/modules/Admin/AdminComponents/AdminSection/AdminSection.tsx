import React, { useEffect, useRef } from 'react'
import Section from '../../../../components/Section/Section'

import Button from '../../../../UI/Button/Button';
import { AdminWorkDay } from '../AdminWorkDay/AdminWorkDay';
import { AdminSocial } from '../AdminSocial/AdminSocial';
import { AdminAdvantages } from '../AdminAdvantages/AdminAdvantages';
import { AdminTextArea } from '../AdminTextArea/AdminTextArea';
import { observer } from 'mobx-react-lite';
import { applicationStore, IAdvantages, IGetAllJSON, IImages, IService, servicesStore } from '../../../../store';
import { AdminServices } from '../AdminServices/AdminServices';
import { AdminImages } from '../AdminImages/AdminImages';
import { AdminHowToGet } from '../AdminHowToGet/AdminHowToGet';

import classes from './AdminSection.module.scss'
import useRequest from '../../../../utils/hooks/useRequest';
import { advantageApi, homeSliderApi, officeApi, serviceApi } from '../../../../http';
import { useMessage } from '../../../MessageContext';
import Loader from '../../../../UI/Loader/Loader';

interface IParagraph {
    title: string;
    item: React.ReactNode;
}

interface IContent {
    title: string;
    paragraphs: IParagraph[];
}

export const AdminSection = observer(() => {

    const content: IContent[] = [
        {
            title: 'Основные настройки',
            paragraphs: [
                {
                    title: 'Промо баннер', item: <AdminTextArea
                        initialValue={applicationStore.promoBanner || ''}
                        saveValue={(promo) => applicationStore.changePromoBanner(promo)}
                        minHeight='2.3em'
                        maxHeight='4em'
                    />
                },
                { title: 'Социальные сети/адрес', item: < AdminSocial /> },
                { title: 'График работы', item: <AdminWorkDay /> },
                { title: 'Твои преимущества (фото 4:3)', item: <AdminAdvantages /> },
                {
                    title: 'Ссылка на карту', item: <AdminTextArea
                        initialValue={applicationStore.addressMap || ''}
                        saveValue={(address) => applicationStore.setAddressMap(address)}
                    />
                },
                { title: 'Видео как добраться', item: <AdminHowToGet /> },
            ],
        },
        {
            title: 'Главная страница',
            paragraphs: [
                {
                    title: 'Главный слайдер (фото 16:9)',
                    item: <AdminImages
                        images={applicationStore.homeSlider}
                        addImage={(image) => applicationStore.addMainSlider(image)}
                        deleteImage={(id) => applicationStore.deleteMainSlider(id)}
                        title='Добавить фото'
                        aspect={16 / 9}
                    />
                },
                { title: 'Услуги', item: <AdminServices /> },
            ],
        },
        {
            title: 'Данные "Обо мне"',
            paragraphs: [
                {
                    title: 'Текст', item: <AdminTextArea
                        initialValue={applicationStore.aboutMe || ''}
                        saveValue={(aboutMe) => applicationStore.setAboutMe(aboutMe)}
                    />
                },
                {
                    title: 'Фотографии мастерской', item: <AdminImages
                        images={applicationStore.officeImages}
                        addImage={(image) => applicationStore.addOfficeImage(image)}
                        deleteImage={(id) => applicationStore.deleteOfficeImage(id)}
                        title='Добавить фото мастерской'
                    />
                },
            ],
        },
    ];

    const sectionRefs = useRef<(HTMLDivElement | null)[][]>(Array(content.length).fill(null).map(() => Array(0)));

    const scrollToSection = (sectionIndex: number, paraIndex?: number) => {
        const section = sectionRefs.current[sectionIndex][paraIndex || 0];
        if (section) {
            const offset = 90;
            const top = section.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    };
    const { addMessage } = useMessage()

    const handleError = (error: string | null) => {
        if (error && error !== applicationStore.error) {
            applicationStore.setError(error);
            addMessage(error, 'error');
        }
    };
    const [
        services,
        servicesIsLoading,
        servicesError
    ] = useRequest<IGetAllJSON<IService>>(serviceApi.getServices);

    const [
        homeSlider,
        homeSliderIsLoading,
        homeSliderError
    ] = useRequest<IGetAllJSON<IImages>>(homeSliderApi.getImages);

    const [
        advantages,
        advantagesIsLoading,
        advantagesError
    ] = useRequest<IGetAllJSON<IAdvantages>>(advantageApi.getAdvantages);

    const [
        officeImages,
        officeImagesIsLoading,
        officeImagesError
    ] = useRequest<IGetAllJSON<IImages>>(officeApi.getImages);

    useEffect(() => {
        handleError(servicesError);
        if (services?.rows.length) {
            servicesStore.setServices(services.rows)
        }
    }, [services, servicesError])

    useEffect(() => {
        handleError(homeSliderError);
        if (homeSlider?.rows.length) {
            applicationStore.setSliderImages(homeSlider.rows)
        }
    }, [homeSlider, homeSliderError])

    useEffect(() => {
        handleError(advantagesError);
        if (advantages?.rows.length) {
            applicationStore.setAdvantages(advantages.rows)
        }
    }, [advantages, advantagesError])

    useEffect(() => {
        handleError(officeImagesError);
        if (officeImages?.rows.length) {
            applicationStore.setOfficeImages(officeImages.rows)
        }
    }, [officeImages, officeImagesError])

    return (
        <Section className={classes.admin}>
            <Loader
                className={classes.admin__loader}
                isLoading={
                    servicesIsLoading ||
                    homeSliderIsLoading ||
                    advantagesIsLoading ||
                    officeImagesIsLoading ||
                    applicationStore.isLoading ||
                    servicesStore.isLoading
                }
            />
            <h1 className={classes.admin__title}>Панель администратора</h1>
            <nav className={classes.admin__nav}>
                <ul className={classes.admin__navList}>
                    {content.map((section, sectionIndex) => (
                        <li
                            className={classes.admin__navTitle}
                            key={section.title}
                        >
                            <Button
                                onClick={() => scrollToSection(sectionIndex)}
                            >
                                <span>
                                    {sectionIndex + 1}.
                                </span>
                                {section.title}
                            </Button>
                            <ul className={classes.admin__navParaList}>
                                {section.paragraphs.map((para, paraIndex) => (
                                    <li
                                        className={classes.admin__navParaTitle}
                                        key={para.title}
                                    >
                                        <Button
                                            onClick={() => scrollToSection(sectionIndex, paraIndex)}
                                        >
                                            <span>
                                                {sectionIndex + 1}.{paraIndex + 1}.
                                            </span>
                                            {para.title}
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className={classes.admin__content}>
                {content.map((section, sectionIndex) => (
                    <div
                        className={classes.admin__section}
                        key={section.title}
                        ref={(el) => (sectionRefs.current[sectionIndex][0] = el)}
                    >
                        <h2 className={classes.admin__sectionTitle}>
                            <span>
                                {sectionIndex + 1}.
                            </span>{section.title}
                        </h2>
                        {section.paragraphs.map((para, paraIndex) => (
                            <div
                                className={classes.admin__para}
                                key={para.title}
                                ref={(el) => (sectionRefs.current[sectionIndex][paraIndex] = el)}
                            >
                                <h3 className={classes.admin__paraTitle}>
                                    <span>
                                        {sectionIndex + 1}.{paraIndex + 1}.
                                    </span>
                                    {para.title}
                                </h3>
                                <div className={classes.admin__paraContent}>
                                    {para.item}
                                </div>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </Section>
    );
});
