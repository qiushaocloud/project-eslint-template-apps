// eslint-disable-next-line no-use-before-define
import React from 'react';
import {Link} from 'react-router-dom';
import QiushaoCloudPicJpg from '@assets/images/qiushaocloud-pic.jpg';

const AboutPage: React.FC = () => {
  return (
    <div className="blog-wrapper">
      <img src={QiushaoCloudPicJpg} width={35} height={35} />
      邱少羽梦博客地址: <a href='https://www.qiushaocloud.top'>https://www.qiushaocloud.top</a>
      <div>
        这是 Blog 页面
        <nav>
          <ul>
            <li>
              <Link to="/">Home 页面</Link>
            </li>
            <li>
              <Link to="/about">关于页面</Link>
            </li>
            <li>
              <Link to="/blog">博客页面</Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default AboutPage;
