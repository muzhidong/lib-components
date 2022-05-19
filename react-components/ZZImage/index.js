import React, {
  useState,
} from 'react';
import styles from './index.less';

export default function(props) {

  const {
    alt = '空',
    src: targetSrc,
    className = '',
    containerClassName = '',
    onClick = null,
  } = props;

  const [src, setSrc] = useState('');

  const onLoad = function(){
    setSrc(targetSrc);
  }

  return (
    <div className={`${styles.container} ${containerClassName}`}>
      <img src={src} alt={alt} className={`${styles.image} ${className}`} onClick={onClick} />
      <img src={targetSrc} alt={alt} onLoad={onLoad} hidden/>
    </div>
  );
}
