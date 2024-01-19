import React from 'react';
import {Link} from 'react-router-dom';
import QiushaoCloudPicJpg from '@assets/images/qiushaocloud-pic.jpg';
import {useAppDispatch, useAppSelector} from '@storets';
import {addUser, setUsers, loadUsersAPI} from '@features/usersSlice';

const AboutPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const users = useAppSelector(state => state.users);

  return (
    <div className="about-wrapper">
      <img src={QiushaoCloudPicJpg} width={35} height={35} />
      邱少羽梦博客地址: <a href='https://www.qiushaocloud.top'>https://www.qiushaocloud.top</a>
      <div>
        这是 About 页面, users: <span>{JSON.stringify(users)}</span>
        <br />
        <button onClick={() => dispatch(addUser({id: `uid_${Math.random()}`, name: 'adduser'}))}>addUser</button>
        <button onClick={() => dispatch(setUsers([{id: `uid_${Math.random()}`, name: 'setusers'}]))}>setUsers</button>
        <button onClick={() => dispatch(loadUsersAPI('loadusers'))}>loadUsersAPI</button>
        <hr />
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

      <iframe src="https://www.qiushaocloud.top" width='100%' height='500px' ></iframe>
    </div>
  );
};

export default AboutPage;
