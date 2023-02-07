import React, {
  useState,
} from 'react';
import styles from './index.less';

/**
 * 特点：
 * 图片加载完成显示
 * 图片基础样式支持扩展
 * 
 * 示例：
 * <Image src={require('./logo.png')} alt={"logo"} className={styles.logo} />
 */
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
