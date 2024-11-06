import { NavLink, Link } from 'react-router-dom';
import { POLICY_ROUTE } from '../../../../utils/const/routes';
import classes from '../Footer/Footer.module.scss';
import { observer } from 'mobx-react-lite';
import { applicationStore } from '../../../../store';
import { FC } from 'react';
interface IPageLinks {
    onLinkClick: () => void
}
export const PageLinks: FC<IPageLinks> = observer(({ onLinkClick }) => (
    <div className={classes.footer__column}>
        <h6 className={classes.footer__columnTitle}>Cтраницы</h6>
        <div className={classes.footer__linksList}>
            {applicationStore.headerLinks.map(link => {
                if (!link.link || !link.name) return null
                return (
                    <NavLink
                        className={classes.footer__link}
                        to={link.link}
                        key={link.name}
                        onClick={onLinkClick}
                    >
                        {link.name}
                    </NavLink>
                )
            })}
            <Link
                to={POLICY_ROUTE}
                target="_blank"
                rel="noopener noreferrer"
                className={classes.footer__policy}
            >
                Политика конфиденциальности
            </Link>
        </div>
    </div>
));