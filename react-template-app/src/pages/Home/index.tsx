import React from 'react';
import {Link} from 'react-router-dom';
import QiushaoCloudPicJpg from '@assets/images/qiushaocloud-pic.jpg';
import {useAppDispatch, useAppSelector} from '@storets';
import {increment, decrement, incrBy, setCount, getCounterAPI} from '@features/counterSlice';
import styles from './index.module.less';
import './global.test.less';

const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const {count} = useAppSelector(state => state.counter);

  return (
    <div className={`home-wrapper ${styles.wrapper}`}>
      <img src={QiushaoCloudPicJpg} width={35} height={35} />
      邱少羽梦博客地址: <a href='https://www.qiushaocloud.top'>https://www.qiushaocloud.top</a>
      <div>
        <button onClick={() => document.documentElement.setAttribute('data-theme-mode', document.documentElement.getAttribute('data-theme-mode') === 'light' ? 'dark' : 'light')}>切换主题</button>
        <button><Link to="/">Home 页面</Link></button>
        <button><Link to="/about">关于页面</Link></button>
        <button><Link to="/blog">博客页面</Link></button>
        <hr />
        <button onClick={() => dispatch(increment())}>increment</button>
        <button onClick={() => dispatch(decrement())}>decrement</button>
        <button onClick={() => dispatch(incrBy(3))}>incrBy</button>
        <button onClick={() => dispatch(setCount(111))}>setCount</button>
        <button onClick={() => dispatch(getCounterAPI())}>getCounterAPI</button>
        <br />
        这是 Home 页面, count: <span>{count}</span>
      </div>
      <hr />
      <br />
      <iframe src="https://space.bilibili.com/493330110?spm_id_from=333.1007.0.0" width='100%' height='900px' ></iframe>
    </div>
  );
};

export default HomePage;
