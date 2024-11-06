import { FC, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import classes from './CookieBanner.module.scss'
import { Link } from 'react-router-dom';
import { POLICY_ROUTE } from '../../../../utils/const/routes';
import Button from '../../../../UI/Button/Button';

export const CookieBanner: FC = () => {
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [isAnimatingOut, setIsAnimatingOut] = useState<boolean>(false);

    useEffect(() => {
        const cookieConsent = localStorage.getItem('cookieConsent');
        if (!cookieConsent) {
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, []);

    const handleAcceptCookies = () => {
        localStorage.setItem('cookieConsent', 'true');
        setIsVisible(false);
    };


    return (
        <AnimatePresence>
            {
                isVisible
                    ? <motion.div
                        className={classes.coolieBanner}
                        initial={{ opacity: 0, y: "100%" }}
                        animate={{ opacity: 0.9, y: 0 }}
                        exit={{ opacity: 0, y: "100%" }}
                    >
                        <div className={classes.coolieBanner__inner}>
                            <p className={classes.coolieBanner__text}>
                                <span>
                                    Мы используем cookies для улучшения Вашего опыта на нашем сайте.
                                </span>
                                <Link
                                    to={POLICY_ROUTE}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title='Страница политики конфиденциальности'
                                    aria-label='Страница политики конфиденциальности'
                                >
                                    {` Подробнее`}
                                </Link>
                            </p>
                            <Button
                                className={classes.coolieBanner__button}
                                onClick={handleAcceptCookies}
                                title='Принять'
                            >
                                Принять
                            </Button>
                        </div>
                    </motion.div>
                    : null
            }
        </AnimatePresence>

    );
};