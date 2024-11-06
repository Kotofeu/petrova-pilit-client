import { memo, FC } from 'react'
import Rating from 'react-star-ratings'
interface IStarRating {
    name?: string,
    rating?: number,
    setRating?: (rating: number) => void,
    className?: string
    starRatedColor?: string;
    starEmptyColor?: string;
    starHoverColor?: string;
    starDimension?: string;
    starSpacing?: string;
}
const StarRating: FC<IStarRating> = memo((props) => {
    const {
        name,
        rating = 0,
        setRating,
        className = '',
        starRatedColor = '#f52f42',
        starEmptyColor = '#241F20',
        starHoverColor = '#F64254',
        starDimension = '20px',
        starSpacing = '2px',

    } = props

    return (
        <div className={className}>
            <Rating
                rating={rating}
                name={name}
                changeRating={setRating}
                starRatedColor={starRatedColor}
                starEmptyColor={starEmptyColor}
                starHoverColor={starHoverColor}
                starDimension={starDimension}
                starSpacing={starSpacing}
                svgIconPath='M23.6,0c-2.9,0-5.4,1.3-7.6,3.4C13.8,1.3,11.3,0,8.4,0C3.8,0,0,3.8,0,8.4c0,6.2,10.2,12.5,16,21.2 c5.8-8.7,16-15,16-21.2C32,3.8,28.2,0,23.6,0z'
                svgIconViewBox='0 0 33 26.6'
            />
        </div>
    )
})
export default StarRating