import React from 'react';
import {Link} from 'react-router-dom';
import QiushaoCloudPicJpg from '@assets/images/qiushaocloud-pic.jpg';
import {useAppSelector} from '@storets';
import {addTodo, delTodo, setTodos} from '@actions/todos';

const AboutPage: React.FC = () => {
  const todos = useAppSelector(state => state.todos);

  return (
    <div className="blog-wrapper">
      <img src={QiushaoCloudPicJpg} width={35} height={35} />
      邱少羽梦博客地址: <a href='https://www.qiushaocloud.top'>https://www.qiushaocloud.top</a>
      <div>
        这是 Blog 页面, todos: <span>{JSON.stringify(todos)}</span>
        <br />
        <button onClick={() => addTodo('addTodo')}>addTodo</button>
        <button onClick={() => delTodo(todos[0]?.id)}>delTodo</button>
        <button onClick={() => setTodos(['setTodos2', 'setTodos2', 'setTodos3'])}>setTodos</button>
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
      <iframe src="https://www.qiushaocloud.top" style={{width: '100%', height: '300px'}} ></iframe>
    </div>
  );
};

export default AboutPage;
