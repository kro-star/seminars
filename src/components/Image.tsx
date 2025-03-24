import { useState } from 'react';

interface IImageProps{
    src:string,
    alt: string,
}
const Image = ({ src, alt }: IImageProps) => {
    const [source, setSource] = useState(src);
    if (source === ''){
        setSource('/src/assets/img/default-seminar.jpg');
    }
    const onError = () => {
        setSource('/src/assets/img/default-seminar.jpg');
    };
    return <img src={source} alt={alt} onError={onError} />;
};
export default Image;