import { ChangeEvent, forwardRef, memo } from 'react'

import classes from './TextArea.module.scss';
import { classConnection } from '../../utils/function';

interface ITextArea {
    className?: string;
    value: string;
    title?: string;
    placeholder?: string;
    name?: string;
    onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
    style?: React.CSSProperties;
    disabled?: boolean

}

const TextArea = forwardRef<HTMLTextAreaElement, ITextArea>((props, ref) => {
    const {
        className = '',
        title,
        value,
        placeholder,
        name,
        onChange,
        style,
        disabled = false
    } = props;

    return (
        <textarea
            className={classConnection(classes.textArea, className)}
            ref={ref}
            style={style}
            name={name}
            title={title}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            aria-label={title}
            disabled={disabled}
        />
    )
})

export default memo(TextArea);