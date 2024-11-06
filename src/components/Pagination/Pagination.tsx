import { memo, useMemo } from 'react';
import classes from './Pagination.module.scss';

interface IPagination {
    className?: string;
    currentPage: number;
    itemCount: number;
    limit: number;
    pageOffset?: number;
    onChange: (page: number) => void;
}

export const Pagination: React.FC<IPagination> = memo((props) => {
    const { className = '', pageOffset = 3, currentPage, itemCount, limit, onChange } = props
    const totalPages = Math.ceil(itemCount / limit);

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) {
            return;
        }
        onChange(page);
    };
    const renderPageButtons = useMemo(() => {
        const buttons = [];
        for (let i = currentPage - pageOffset; i <= currentPage + pageOffset; i++) {
            if (i < 1 || i > totalPages) {
                continue;
            }
            buttons.push(
                <button
                    key={i}
                    className={[
                        classes.pagination_button,
                        currentPage === i ? classes.pagination_button___disabled : ''
                    ].join(' ')}
                    onClick={() => handlePageChange(i)}
                    type='button'
                    title={`Страница: ${i}`}
                >
                    {i}
                </button>
            );
        }
        return buttons;
    }, [currentPage, totalPages])
    if (itemCount <= 1 || totalPages <= 1) return null
    return (
        <nav className={[classes.pagination, className].join(' ')}>
            <button
                className={[
                    classes.pagination_arrowButton,
                    currentPage === 1 ? classes.pagination_arrowButton___disabled : ''
                ].join(' ')}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                type='button'
                title='Назад'
            >
                {'<'}
            </button>
            {renderPageButtons}
            <button
                className={[
                    classes.pagination_arrowButton,
                    currentPage === totalPages ? classes.pagination_arrowButton___disabled : ''
                ].join(' ')}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                type='button'
                title='Вперёд'

            >
                {'>'}
            </button>
        </nav>
    );
});