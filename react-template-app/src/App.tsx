import * as React from 'react'
import QiushaoCloudPic from '@assets/images/qiushaocloud-pic.jpg'

import '@styles/index.less'

const App: React.FC = () => {
  return (
    <div className="wrapper">
      <img src={QiushaoCloudPic} width={35} height={35} />
      邱少羽梦博客地址: <a href='https://www.qiushaocloud.top'>https://www.qiushaocloud.top</a>
    </div>
  )
}

export default App
