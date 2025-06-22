# API 接口文档

## 用户认证相关接口

### 1. 用户登录

**接口地址:** `POST /api/auth/login`

**请求参数:**
```json
{
  "username": "admin",          // 用户名或邮箱
  "password": "admin123",       // 密码
  "rememberMe": false           // 可选，是否记住我
}
```

**响应示例:**
```json
{
  "message": "登录成功",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@alist.com",
    "role": "admin",
    "status": "active",
    "last_login_at": "2024-01-01T12:00:00.000Z",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T12:00:00.000Z"
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "15m"
  }
}
```

**cURL 示例:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### 2. 用户登出

**接口地址:** `POST /api/auth/logout`

**请求头:**
```
Authorization: Bearer <access_token>
```

**响应示例:**
```json
{
  "message": "登出成功"
}
```

**cURL 示例:**
```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 3. 刷新访问令牌

**接口地址:** `POST /api/auth/refresh`

**请求参数:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**响应示例:**
```json
{
  "message": "令牌刷新成功",
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "15m"
  }
}
```

**cURL 示例:**
```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken":"YOUR_REFRESH_TOKEN"}'
```

### 4. 获取当前用户信息

**接口地址:** `GET /api/auth/profile`

**请求头:**
```
Authorization: Bearer <access_token>
```

**响应示例:**
```json
{
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@alist.com",
    "role": "admin",
    "status": "active",
    "last_login_at": "2024-01-01T12:00:00.000Z",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T12:00:00.000Z"
  }
}
```

**cURL 示例:**
```bash
curl -X GET http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 5. 更新用户名

**接口地址:** `PUT /api/auth/username`

**请求头:**
```
Authorization: Bearer <access_token>
```

**请求参数:**
```json
{
  "username": "newusername"
}
```

**响应示例:**
```json
{
  "message": "用户名更新成功",
  "user": {
    "id": 1,
    "username": "newusername",
    "email": "admin@alist.com",
    "role": "admin",
    "status": "active",
    "last_login_at": "2024-01-01T12:00:00.000Z",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T12:30:00.000Z"
  }
}
```

**cURL 示例:**
```bash
curl -X PUT http://localhost:3000/api/auth/username \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"username":"newusername"}'
```

### 6. 更新密码

**接口地址:** `PUT /api/auth/password`

**请求头:**
```
Authorization: Bearer <access_token>
```

**请求参数:**
```json
{
  "currentPassword": "admin123",
  "newPassword": "newpassword123"
}
```

**响应示例:**
```json
{
  "message": "密码更新成功，请重新登录"
}
```

**cURL 示例:**
```bash
curl -X PUT http://localhost:3000/api/auth/password \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"currentPassword":"admin123","newPassword":"newpassword123"}'
```

### 7. 用户注册（管理员功能）

**接口地址:** `POST /api/auth/register`

**请求头:**
```
Authorization: Bearer <admin_access_token>
```

**请求参数:**
```json
{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "password123",
  "role": "user"
}
```

**响应示例:**
```json
{
  "message": "用户创建成功",
  "user": {
    "id": 2,
    "username": "newuser",
    "email": "newuser@example.com",
    "role": "user",
    "status": "active",
    "last_login_at": null,
    "created_at": "2024-01-01T13:00:00.000Z",
    "updated_at": "2024-01-01T13:00:00.000Z"
  }
}
```

**cURL 示例:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Authorization: Bearer YOUR_ADMIN_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"username":"newuser","email":"newuser@example.com","password":"password123","role":"user"}'
```

## 错误响应格式

所有错误响应都遵循以下格式：

```json
{
  "error": "错误描述",
  "code": "ERROR_CODE"
}
```

常见错误代码：

- `NO_TOKEN`: 未提供认证令牌
- `INVALID_TOKEN`: 无效的令牌
- `TOKEN_EXPIRED`: 令牌已过期
- `USER_NOT_FOUND`: 用户不存在
- `ACCOUNT_DISABLED`: 账户已被禁用
- `INVALID_CREDENTIALS`: 用户名或密码错误
- `MISSING_CREDENTIALS`: 缺少用户名或密码
- `USERNAME_EXISTS`: 用户名已存在
- `EMAIL_EXISTS`: 邮箱已存在
- `WEAK_PASSWORD`: 密码强度不足
- `RATE_LIMIT_EXCEEDED`: 请求频率超限

## 认证流程

1. **登录**: 使用用户名/邮箱和密码获取访问令牌和刷新令牌
2. **访问API**: 在请求头中携带访问令牌
3. **令牌过期**: 当访问令牌过期时，使用刷新令牌获取新的访问令牌
4. **登出**: 清除服务器端的刷新令牌

## 持久登录

- 选择"记住我"时，刷新令牌会保存在HttpOnly Cookie中
- Cookie有效期为7天
- 登出时会清除所有令牌和Cookie

## 安全特性

- 密码使用bcrypt加密
- JWT令牌包含用户基本信息
- 刷新令牌存储在数据库中，支持撤销
- 请求频率限制
- CORS配置
- 安全头设置 