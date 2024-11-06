import { memo, FC } from 'react'

import classes from './PolicyParagraph.module.scss'
import { IPolicy } from '../../policy';
interface IPolicyParagraph {
    rel: React.LegacyRef<HTMLDivElement> | undefined;
    section: IPolicy;
}
export const PolicyParagraph: FC<IPolicyParagraph> = memo(({ rel, section }) => {
    return (
        <div
            className={classes.paragraph}
            ref={rel}
        >
            <h3 className={classes.paragraph__title}>{section.title}</h3>
            {section.content && section.content.map((text, i) => (
                <p className={classes.paragraph__text} key={i}>{text}</p>
            ))}
            {section.table &&

                <table className={classes.paragraph__table}>
                    <tbody>
                        {section.table.map((table, i) => (
                            <tr className={classes.paragraph__row} key={i}>
                                <td className={classes.paragraph__rowName}>{table.name}</td>
                                <td className={classes.paragraph__rowValue}>{table.text}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            }
        </div>)
})
