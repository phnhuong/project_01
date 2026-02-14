# Danh Sách Skills - Hệ Thống Quản Lý Học Sinh

---

## Tổng Quan

Dự án cần **25 skills** được tổ chức thành **7 nhóm** để hỗ trợ agent trong quá trình development.

---

## Nhóm 1: Infrastructure & DevOps Skills (5 skills)

| # | Skill | File | Mục Đích |
|---|-------|------|----------|
| 1 | **Ubuntu Server Management** | `ubuntu-server.md` | Quản lý Ubuntu server: apt commands, systemctl, user management, file permissions |
| 2 | **PostgreSQL Management** | `postgresql.md` | Quản lý PostgreSQL: installation, database creation, user management, pg commands |
| 3 | **Nginx Configuration** | `nginx-config.md` | Configure Nginx: server blocks, reverse proxy, SSL, static files, rate limiting |
| 4 | **PM2 Process Management** | `pm2-management.md` | Quản lý processes với PM2: start, stop, restart, monitoring, logs, clustering |
| 5 | **Git Version Control** | `git-workflow.md` | Git best practices: branching, commits, merging, pull requests, conflict resolution |

---

## Nhóm 2: Backend Development Skills (7 skills)

| # | Skill | File | Mục Đích |
|---|-------|------|----------|
| 6 | **Express.js API Development** | `expressjs-api.md` | Build REST APIs với Express: routing, middleware, request handling, response formatting |
| 7 | **Prisma ORM** | `prisma-orm.md` | Sử dụng Prisma: schema design, migrations, queries, relations, transactions |
| 8 | **JWT Authentication** | `jwt-auth.md` | Implement JWT: token generation, validation, refresh tokens, security best practices |
| 9 | **Input Validation** | `validation-joi.md` | Validate inputs với Joi: schemas, custom validators, error messages, sanitization |
| 10 | **Error Handling** | `error-handling.md` | Error handling patterns: custom errors, async error handling, error middleware |
| 11 | **Logging with Winston** | `winston-logging.md` | Logging với Winston: log levels, transports, file rotation, structured logging |
| 12 | **Backend Testing** | `backend-testing.md` | Testing với Jest & Supertest: unit tests, integration tests, mocking, coverage |

---

## Nhóm 3: Frontend Development Skills (6 skills)

| # | Skill | File | Mục Đích |
|---|-------|------|----------|
| 13 | **React Development** | `react-development.md` | React best practices: components, hooks, state management, context, performance |
| 14 | **React Router** | `react-router.md` | Routing với React Router v6: routes, navigation, protected routes, params |
| 15 | **Axios HTTP Client** | `axios-http.md` | HTTP requests với Axios: instances, interceptors, error handling, cancellation |
| 16 | **Tailwind CSS** | `tailwind-css.md` | Styling với Tailwind: utility classes, responsive design, custom theme, components |
| 17 | **Form Handling** | `react-hook-form.md` | Forms với React Hook Form: validation, error handling, submission, complex forms |
| 18 | **Frontend Testing** | `frontend-testing.md` | Testing với Vitest & RTL: component tests, user interactions, mocking, coverage |

---

## Nhóm 4: Database Skills (3 skills)

| # | Skill | File | Mục Đích |
|---|-------|------|----------|
| 19 | **Database Design** | `database-design.md` | Database design: normalization, relationships, indexes, constraints, optimization |
| 20 | **SQL Query Optimization** | `sql-optimization.md` | Optimize SQL queries: indexes, EXPLAIN, query planning, performance tuning |
| 21 | **Database Migration** | `database-migration.md` | Database migrations: versioning, rollback, data migration, zero-downtime deployments |

---

## Nhóm 5: Security Skills (3 skills)

| # | Skill | File | Mục Đích |
|---|-------|------|----------|
| 22 | **Web Security** | `web-security.md` | Security best practices: XSS, CSRF, SQL injection, authentication, authorization |
| 23 | **Password Security** | `password-security.md` | Password handling: hashing (bcrypt), salting, reset tokens, password policies |
| 24 | **API Security** | `api-security.md` | Secure APIs: rate limiting, CORS, helmet, input validation, authentication |

---

## Nhóm 6: Code Quality Skills (2 skills)

| # | Skill | File | Mục Đích |
|---|-------|------|----------|
| 25 | **Code Review** | `code-review.md` | Code review practices: checklist, common issues, feedback, best practices |
| 26 | **Refactoring** | `refactoring.md` | Code refactoring: patterns, techniques, when to refactor, clean code principles |

---

## Nhóm 7: Documentation & Communication Skills (2 skills)

| # | Skill | File | Mục Đích |
|---|-------|------|----------|
| 27 | **API Documentation** | `api-documentation.md` | Document APIs: JSDoc, OpenAPI/Swagger, examples, error responses |
| 28 | **Technical Writing** | `technical-writing.md` | Technical documentation: README, setup guides, architecture docs, comments |

---

## Tổng Kết Skills

### Thống Kê Theo Nhóm

| Nhóm | Số Skills | Ưu Tiên | Ghi Chú |
|------|-----------|---------|---------|
| **1. Infrastructure & DevOps** | 5 | ⭐⭐⭐ Required | Server & deployment |
| **2. Backend Development** | 7 | ⭐⭐⭐ Required | Core backend skills |
| **3. Frontend Development** | 6 | ⭐⭐⭐ Required | UI development |
| **4. Database** | 3 | ⭐⭐⭐ Required | Data management |
| **5. Security** | 3 | ⭐⭐⭐ Required | Critical for production |
| **6. Code Quality** | 2 | ⭐⭐ Important | Quality assurance |
| **7. Documentation** | 2 | ⭐⭐ Important | Communication |
| **TỔNG** | **28 skills** | | |

---

## Skills vs Workflows Mapping

### Giai Đoạn 1: Infrastructure (Workflows 1-5)

**Skills cần:**
- #1 Ubuntu Server Management
- #2 PostgreSQL Management
- #3 Nginx Configuration
- #5 Git Version Control

### Giai Đoạn 2: Backend Foundation (Workflows 6-12)

**Skills cần:**
- #6 Express.js API Development
- #7 Prisma ORM
- #10 Error Handling
- #11 Logging with Winston
- #19 Database Design
- #21 Database Migration

### Giai Đoạn 3: Authentication (Workflows 13-15)

**Skills cần:**
- #6 Express.js API Development
- #8 JWT Authentication
- #9 Input Validation
- #22 Web Security
- #23 Password Security
- #24 API Security

### Giai Đoạn 4: Core Modules (Workflows 16-24)

**Skills cần:**
- #6 Express.js API Development
- #7 Prisma ORM
- #9 Input Validation
- #10 Error Handling
- #12 Backend Testing
- #19 Database Design
- #20 SQL Query Optimization

### Giai Đoạn 5: Frontend (Workflows 25-30)

**Skills cần:**
- #13 React Development
- #14 React Router
- #15 Axios HTTP Client
- #16 Tailwind CSS
- #17 Form Handling
- #18 Frontend Testing

### Giai Đoạn 6: Deployment (Workflows 31-36)

**Skills cần:**
- #1 Ubuntu Server Management
- #3 Nginx Configuration
- #4 PM2 Process Management
- #12 Backend Testing
- #18 Frontend Testing
- #22 Web Security
- #24 API Security

### Giai Đoạn 7: Optimization (Workflows 37-40)

**Skills cần:**
- #2 PostgreSQL Management
- #11 Logging with Winston
- #20 SQL Query Optimization
- #22 Web Security
- #25 Code Review
- #26 Refactoring

---

## Skill Dependencies

### Foundational Skills (Học trước)

**Must learn first:**
1. Ubuntu Server Management (#1)
2. Git Version Control (#5)
3. Express.js API Development (#6)
4. React Development (#13)

### Intermediate Skills (Học sau foundation)

**Build on foundation:**
5. Prisma ORM (#7) - requires Express.js
6. JWT Authentication (#8) - requires Express.js
7. React Router (#14) - requires React
8. Tailwind CSS (#16) - requires React

### Advanced Skills (Học sau intermediate)

**Requires solid understanding:**
9. SQL Query Optimization (#20) - requires DB experience
10. API Security (#24) - requires API development experience
11. Refactoring (#26) - requires coding experience

---

## Cách Sử Dụng Skills

### Trong Workflows

```
@workflow 13-auth-module

# Agent sẽ tự động load skills:
@skill expressjs-api
@skill jwt-auth
@skill input-validation
@skill password-security
@skill api-security

# Và apply knowledge từ skills vào workflow
```

### Standalone Usage

```
# Học một skill riêng lẻ
@skill prisma-orm

Explain:
1. How to define models
2. How to create relationships
3. How to write queries
4. Best practices

Then generate example for students model
```

### Combined Skills

```
@skill expressjs-api
@skill prisma-orm
@skill jwt-auth

Create authentication API với:
- Express routing
- Prisma database access
- JWT token generation
```

---

## Nội Dung Mỗi Skill

### Cấu Trúc Chung

Mỗi skill file sẽ có:

1. **Overview** - Giới thiệu skill
2. **Key Concepts** - Các khái niệm quan trọng
3. **Common Patterns** - Patterns thường dùng
4. **Best Practices** - Best practices
5. **Common Pitfalls** - Lỗi thường gặp
6. **Code Examples** - Examples cụ thể
7. **Tools & Libraries** - Tools liên quan
8. **Resources** - Links & references

### Example Structure

```markdown
# Skill: Express.js API Development

## Overview
What is Express.js and why use it

## Key Concepts
- Routing
- Middleware
- Request/Response
- Error handling

## Common Patterns
### REST API Pattern
[Code example]

### Middleware Pattern
[Code example]

## Best Practices
1. Use async/await
2. Proper error handling
3. Input validation
...

## Common Pitfalls
❌ Not handling async errors
✅ Use try-catch or error middleware

## Code Examples
[Multiple examples]

## Tools & Libraries
- express-validator
- helmet
- cors

## Resources
- Official docs
- Tutorials
```

---

## Skill Priorities

### Critical Skills (Must Have)

**Cannot proceed without:**
1. Ubuntu Server Management
2. Express.js API Development
3. Prisma ORM
4. React Development
5. Git Version Control

### Important Skills (Should Have)

**Greatly improve development:**
6. JWT Authentication
7. Input Validation
8. Error Handling
9. React Router
10. Tailwind CSS

### Nice to Have Skills

**Enhance quality:**
11. Backend Testing
12. Frontend Testing
13. Code Review
14. Refactoring
15. API Documentation

---

## Learning Path

### Beginner Path (Week 1)

**Core foundations:**
1. Ubuntu Server Management
2. Git Version Control
3. Express.js API Development
4. React Development

### Intermediate Path (Week 2)

**Build features:**
5. Prisma ORM
6. JWT Authentication
7. React Router
8. Axios HTTP Client
9. Tailwind CSS

### Advanced Path (Week 3-4)

**Quality & security:**
10. Input Validation
11. Error Handling
12. Web Security
13. API Security
14. Testing (Backend + Frontend)
15. Database Optimization

---

## Skills Checklist

### Infrastructure Skills

- [ ] Ubuntu Server Management
- [ ] PostgreSQL Management
- [ ] Nginx Configuration
- [ ] PM2 Process Management
- [ ] Git Version Control

### Backend Skills

- [ ] Express.js API Development
- [ ] Prisma ORM
- [ ] JWT Authentication
- [ ] Input Validation
- [ ] Error Handling
- [ ] Logging with Winston
- [ ] Backend Testing

### Frontend Skills

- [ ] React Development
- [ ] React Router
- [ ] Axios HTTP Client
- [ ] Tailwind CSS
- [ ] Form Handling
- [ ] Frontend Testing

### Database Skills

- [ ] Database Design
- [ ] SQL Query Optimization
- [ ] Database Migration

### Security Skills

- [ ] Web Security
- [ ] Password Security
- [ ] API Security

### Quality Skills

- [ ] Code Review
- [ ] Refactoring

### Documentation Skills

- [ ] API Documentation
- [ ] Technical Writing

---

## Estimated Time to Learn Each Skill

| Skill | Time | Difficulty |
|-------|------|------------|
| Ubuntu Server Management | 4 hours | ⭐⭐ Medium |
| PostgreSQL Management | 3 hours | ⭐⭐ Medium |
| Nginx Configuration | 2 hours | ⭐⭐ Medium |
| PM2 Process Management | 1 hour | ⭐ Easy |
| Git Version Control | 2 hours | ⭐ Easy |
| Express.js API Development | 6 hours | ⭐⭐⭐ Hard |
| Prisma ORM | 4 hours | ⭐⭐ Medium |
| JWT Authentication | 3 hours | ⭐⭐ Medium |
| Input Validation | 2 hours | ⭐ Easy |
| Error Handling | 2 hours | ⭐⭐ Medium |
| Logging with Winston | 2 hours | ⭐ Easy |
| Backend Testing | 4 hours | ⭐⭐ Medium |
| React Development | 8 hours | ⭐⭐⭐ Hard |
| React Router | 2 hours | ⭐ Easy |
| Axios HTTP Client | 2 hours | ⭐ Easy |
| Tailwind CSS | 3 hours | ⭐⭐ Medium |
| Form Handling | 2 hours | ⭐⭐ Medium |
| Frontend Testing | 4 hours | ⭐⭐ Medium |
| Database Design | 4 hours | ⭐⭐⭐ Hard |
| SQL Query Optimization | 3 hours | ⭐⭐⭐ Hard |
| Database Migration | 2 hours | ⭐⭐ Medium |
| Web Security | 4 hours | ⭐⭐⭐ Hard |
| Password Security | 2 hours | ⭐⭐ Medium |
| API Security | 3 hours | ⭐⭐⭐ Hard |
| Code Review | 2 hours | ⭐⭐ Medium |
| Refactoring | 3 hours | ⭐⭐ Medium |
| API Documentation | 2 hours | ⭐ Easy |
| Technical Writing | 2 hours | ⭐ Easy |
| **TOTAL** | **79 hours** | ~2 weeks |

**Note:** Với Antigravity agent, thời gian học sẽ giảm đi vì agent đã có knowledge sẵn, chỉ cần reference skills khi cần.

---

## Cách Skills Hỗ Trợ Agent

### Before Skills

```
Prompt: "Create students API"

Agent: 
- Không có context cụ thể
- Có thể miss best practices
- Inconsistent code style
```

### With Skills

```
Prompt: "Create students API"

Agent loads skills:
- @skill expressjs-api → Biết routing patterns
- @skill prisma-orm → Biết query patterns
- @skill input-validation → Biết validate inputs
- @skill error-handling → Biết handle errors

Agent generates:
✅ Consistent code style
✅ Best practices applied
✅ Proper error handling
✅ Input validation included
```

---

## Skills vs Rules

### Differences

| Aspect | Rules | Skills |
|--------|-------|--------|
| **Purpose** | Define standards | Provide knowledge |
| **Content** | "MUST do this" | "HOW to do this" |
| **Usage** | Enforce compliance | Enable capability |
| **Example** | "Use camelCase" | "How to write Express routes" |

### Complementary

```
Rules: "Controller must have error handling"
Skill: "How to implement error handling in Express"

Together:
→ Agent knows WHAT to do (rules)
→ Agent knows HOW to do (skills)
→ Consistent, high-quality code
```

---

## Next Steps

**Bạn muốn:**

1. ✅ **Tôi viết chi tiết TẤT CẢ 28 skills?** (complete knowledge base)
2. ✅ **Tôi viết 10 skills quan trọng nhất trước?** (critical skills first)
3. ✅ **Tôi viết skills theo nhóm?** (group by category)
4. ✅ **Tôi viết một số skills mẫu để bạn xem format?** (example-based)

**Bạn muốn approach nào?** 🎯

---

**Skills = Knowledge Base cho Agent** 🧠  
**Workflows = Step-by-step Instructions** 📝  
**Rules = Standards & Guidelines** 📏

**Together = Powerful AI-Assisted Development!** 🚀
