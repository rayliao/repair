# Initial commit

# 维修

### 接口

地址：http://doc.zxjl.com/doc/modify

后台地址：

http://www.zxjl.com/adminlogin

liaoyl/qwe123

管理员：

1008666/qwe123

### 登录流程

首页onload要做的操作：

检查缓存是否有用户信息

有：不处理

没有：调用微信登录获取code之后获取openid，去数据库读取记录，有记录就保存到缓存，没有就不处理

欢迎页和用户信息页：

检查缓存是否有用户信息

有：不用再次授权

没有：先登录授权获取用户信息，再授权获取手机号

