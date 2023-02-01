
import styles from './index.less';

/**
 * 参数说明：两元素数组items，每个元素是一个对象，拥有展示颜色color和占有比例ratio属性
 */
export default function(props) {

  const {
    items = [{
      color: 'red',
      ratio: 0.5,
    },{
      color: 'yellow',
      ratio: 0.5,
    }]
  } = props;

  let mainColor;
  let subColor;
  let lessRatio;
  if(items[0].ratio >= items[1].ratio){
    mainColor = items[0].color;
    subColor = items[1].color;
    lessRatio = items[1].ratio;
  }else{
    mainColor = items[1].color;
    subColor = items[0].color;
    lessRatio = items[0].ratio;
  }

  const angle =  -45 - (-360 * lessRatio + 180);

  return (
    <div className={styles.container} style={{
      background: `radial-gradient(circle at center, transparent 0%, transparent 38%, ${mainColor} calc(38% + 1px))`,
     }}>
      <div className={styles.left} style={{
        borderColor: `${mainColor}`,
        transform: `rotate(${angle}deg)`
      }}></div>
      <div className={styles.right} style={{
        borderColor: `${subColor}`
      }}></div>
    </div>
  );
}
