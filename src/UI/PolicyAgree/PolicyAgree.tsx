import { memo, FC } from 'react'
import { Link } from 'react-router-dom';
import { POLICY_ROUTE } from '../../utils/const/routes';
import { classConnection } from '../../utils/function';

import classes from './PolicyAgree.module.scss'
interface IPolicyAgree {
    className?: string;
    agreeWith?: string;
}
const PolicyAgree: FC<IPolicyAgree> = memo(({
    className,
    agreeWith = '**Нажимая на эту кнопку',

}) => {
    return (
        <p
            className={classConnection(classes.policyAgree, className)}
            aria-label='Соглашение с политикой конфиденциальности'
        >
            {
                `${agreeWith} `
            }
            Вы соглашаетесь с
            <Link
                to={POLICY_ROUTE}
                target="_blank"
                rel="noopener noreferrer"
                title='Страница политики конфиденциальности'
                aria-label='Страница политики конфиденциальности'
            >
                <span aria-hidden> политикой конфиденциальности</span>
            </Link>

        </p>
    )
})

export default PolicyAgree