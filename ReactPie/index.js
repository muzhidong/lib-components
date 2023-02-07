
import styles from './index.less';

/**
 * 只支持两种类型数据的动态展示
 * 
 * 组件整体设计思路
 * 1. 比例大的作为主色，比例小的作为次色
 * 2. 根据较小的比例计算偏移角度
 * 3. 利用border绘制半圆环，主色半圆环根据算出的偏移角度作旋转 
 * 
 * 组件对外暴露属性：
 * items属性：两元素数组，每个元素是一个具有展示颜色color和占有比例ratio属性的对象。
 * 
 * 示例：
  <Pie items={[{
      color: '#3DE0B1',
      ratio: 0.6,
    },{
      color: '#4FBCFF',
      ratio: 0.4,
    }]}></Pie>
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
