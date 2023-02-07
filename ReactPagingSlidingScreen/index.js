import React, {
  useEffect,
  useState,
} from 'react';
import styles from './index.less';

// 阻止默认行为
const preventDefault = function(e) {
  const event = e || window.event;
  if (event.preventDefault) {
    event.preventDefault();
  } else {
    event.returnValue = false;
  }
}

// 纵向起始位置
let startY;
// 纵向移动位置
let moveY;
// 客户端高度
let clientHeight;
// 触发切换分页纵向阈值
const threshold =  200;
// 当前分页
let currentPage = 0;

// 首次渲染
let firstRendered = true;

/**
 * 组件整体设计思路
 * 1. 计算分页百分比大小（父元素的高度是所有屏幕高度之和）和客户端高度
 * 2. 监听事件，如阻止触摸事件默认行为，监听客户端高度变化
 * 3. 定义触摸开始、移动、结束事件
 * 4. 监听外属性next变化时，切换到下一页
 * 5. 组件布局，一个容器顶层，主要绑定触摸事件，一个嵌套层，关键点是根据屏数确定高度。
 * 
 * 组件对外暴露属性
 * 1. 分页数pageNum
 * 2. 触发切换到下一页标识next
 * 
 * 示例：
  <PagingSlidingScreen pageNum={7} next={next}>
    <div className={styles.page}></div>
    <div className={styles.page}></div>
    <div className={styles.page}></div>
    <div className={styles.page}></div>
    <div className={styles.page}></div>
    <div className={styles.page}></div>
    <div className={styles.page}></div>
  </PagingSlidingScreen>
 */
export default function(props) {

  let {
    // 分页数
    pageNum = 10,
    // 切换到下一页
    next ,
    children = [],
  } = props;

  // 计算分页百分比大小
  const percent = (1 / pageNum * 100).toFixed(2);

  // 计算客户端高度
  const getH = function() {
    clientHeight = document.body.clientHeight;
  };
  getH();

  const [translateY, setTranslateY] = useState('none');

  useEffect(()=>{
    if(firstRendered){

      document.body.addEventListener("touchmove", preventDefault, {
        passive: false
      });

      window.addEventListener("load", getH, false);
      window.addEventListener("resize", getH, false);

      firstRendered = false;
    }else{
      currentPage++;
      setTranslateY(`translateY(-${currentPage * percent}%)`);
    }

  }, [next, percent])

  // 触摸开始事件
  const onTouchStart = function(e) {
    let event = e || window.event;
    if (!event.touches.length) {
      return;
    }
    // 登记y轴起始位置，重置移动偏移量
    startY = event.touches[0].pageY;
    moveY = 0;
  };

  // 触摸移动事件
  const onTouchMove = function(e) {
    let event = e || window.event;
    if (!event.touches.length) {
      return;
    }
    // 计算移动偏移量，并渲染
    moveY = event.touches[0].pageY - startY;
    setTranslateY(`translateY(${-currentPage * clientHeight + moveY}px)`);
  };

  // 触摸结束事件
  const onTouchEnd = function(e) {

    // 小于阈值不翻页
    // 下一页
    if (moveY < -threshold) {
      currentPage++;
    }
    // 上一页
    if (moveY > threshold) {
      currentPage--;
    }

    // 处理临界
    if (currentPage < 0) {
      currentPage = 0;
    }
    if (currentPage > pageNum - 1) {
      currentPage = pageNum - 1;
    }
    // 切换分页
    setTranslateY(`translateY(${-currentPage * percent}%)`);
  };

  return (
    <div className={styles.container}
      style={{height: clientHeight + 'px'}}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}>
      <div className={styles.wrapper}
        style={{
          transform: translateY,
          WebkitTransform: translateY,
          height: pageNum * 100 + '%',
          transition: "transform .5s",
          WebkitTransition: "transform .5s",
        }}
      >
        {React.Children.map(children, (child, index) => {
          return React.cloneElement(child, {
            style: { ...child.props.style, height: percent + '%' },
            key: index,
          })
        })}
      </div>
    </div>
  );
}
