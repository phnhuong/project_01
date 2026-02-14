# Danh Sách Workflows - Hệ Thống Quản Lý Học Sinh

---

## Tổng Quan

Dự án được chia thành **6 giai đoạn** với **30 workflows** để triển khai đầy đủ.

---

## Giai Đoạn 1: Setup & Infrastructure (5 workflows)

| # | Workflow | File | Mục Đích |
|---|----------|------|----------|
| 1 | **Server Preparation** | `01-server-preparation.md` | Chuẩn bị Ubuntu server: update system, cài đặt tools cơ bản, configure firewall |
| 2 | **PostgreSQL Setup** | `02-postgresql-setup.md` | Cài đặt PostgreSQL 16, tạo database, configure user, test connection |
| 3 | **Node.js & NPM Setup** | `03-nodejs-setup.md` | Cài đặt Node.js 20.x, npm, global packages (PM2, Prisma CLI) |
| 4 | **Nginx Setup** | `04-nginx-setup.md` | Cài đặt Nginx, configure basic settings, test web server |
| 5 | **Project Structure** | `05-project-structure.md` | Tạo cấu trúc thư mục ~/qlhs_02, git init, create base folders |

---

## Giai Đoạn 2: Backend Foundation (7 workflows)

| # | Workflow | File | Mục Đích |
|---|----------|------|----------|
| 6 | **Backend Initialization** | `06-backend-init.md` | Setup backend: npm init, install dependencies, folder structure |
| 7 | **Prisma Schema** | `07-prisma-schema.md` | Tạo Prisma schema từ DATABASE_SCHEMA.md, define models, relationships |
| 8 | **Database Migration** | `08-database-migration.md` | Run Prisma migrations, generate client, verify tables created |
| 9 | **Database Seeding** | `09-database-seeding.md` | Tạo seed script, populate initial data (users, subjects, sample students) |
| 10 | **Backend Core Setup** | `10-backend-core.md` | Setup Express app, middleware (CORS, helmet, rate-limit), error handling |
| 11 | **Utilities & Helpers** | `11-backend-utilities.md` | Tạo response helpers, logger (Winston), validation schemas, constants |
| 12 | **Environment Config** | `12-environment-config.md` | Setup .env files, environment validation, configuration management |

---

## Giai Đoạn 3: Authentication & Authorization (3 workflows)

| # | Workflow | File | Mục Đích |
|---|----------|------|----------|
| 13 | **Authentication Module** | `13-auth-module.md` | Tạo auth controller, service, routes: login, logout, refresh token |
| 14 | **JWT Middleware** | `14-jwt-middleware.md` | Implement JWT authentication middleware, token validation, refresh logic |
| 15 | **Password Management** | `15-password-management.md` | Change password, forgot password, reset password functionality |

---

## Giai Đoạn 4: Core Modules (9 workflows)

| # | Workflow | File | Mục Đích |
|---|----------|------|----------|
| 16 | **Students Module** | `16-students-module.md` | CRUD students: controller, service, routes, validation (list, create, update, delete) |
| 17 | **Students Search & Filter** | `17-students-search.md` | Implement search, filter, sort, pagination for students list |
| 18 | **Subjects Module** | `18-subjects-module.md` | CRUD subjects: controller, service, routes, validation |
| 19 | **Scores Module - Basic** | `19-scores-basic.md` | CRUD scores: controller, service, routes, validation |
| 20 | **Scores Calculation** | `20-scores-calculation.md` | Implement score calculation logic, average calculation, update triggers |
| 21 | **Score History** | `21-score-history.md` | Track score changes, audit trail, view history functionality |
| 22 | **Dashboard Module** | `22-dashboard-module.md` | Dashboard API: statistics, summaries, recent activities |
| 23 | **Reports Module** | `23-reports-module.md` | Generate reports: student performance, class statistics, export data |
| 24 | **Audit Logs** | `24-audit-logs.md` | Implement audit logging for all CRUD operations, view logs |

---

## Giai Đoạn 5: Frontend Development (6 workflows)

| # | Workflow | File | Mục Đích |
|---|----------|------|----------|
| 25 | **Frontend Initialization** | `25-frontend-init.md` | Setup React + Vite, install dependencies, configure Tailwind, folder structure |
| 26 | **API Service Layer** | `26-api-services.md` | Create Axios instance, API services (auth, students, subjects, scores), interceptors |
| 27 | **Common Components** | `27-common-components.md` | Create reusable components: Button, Input, Table, Modal, Card, etc. |
| 28 | **Authentication UI** | `28-auth-ui.md` | Login page, logout, change password UI, protected routes |
| 29 | **Students UI** | `29-students-ui.md` | Students list, form (create/edit), detail, search/filter UI |
| 30 | **Subjects & Scores UI** | `30-subjects-scores-ui.md` | Subjects management UI, scores input UI, score history view |

---

## Giai Đoạn 6: Testing, Deployment & Production (6 workflows)

| # | Workflow | File | Mục Đích |
|---|----------|------|----------|
| 31 | **Backend Unit Tests** | `31-backend-tests.md` | Write unit tests for services, utilities, helpers (Jest) |
| 32 | **Backend Integration Tests** | `32-integration-tests.md` | API integration tests for all endpoints (Supertest) |
| 33 | **Frontend Tests** | `33-frontend-tests.md` | Component tests, page tests (Vitest, React Testing Library) |
| 34 | **PM2 Configuration** | `34-pm2-setup.md` | Setup PM2 ecosystem, start app, configure auto-restart, monitoring |
| 35 | **Nginx Production Config** | `35-nginx-production.md` | Configure Nginx reverse proxy, static files, SSL (optional), rate limiting |
| 36 | **Production Deployment** | `36-production-deploy.md` | Build frontend, deploy to production, verify, backup database |

---

## Giai Đoạn 7: Maintenance & Optimization (4 workflows - Optional)

| # | Workflow | File | Mục Đích |
|---|----------|------|----------|
| 37 | **Database Optimization** | `37-db-optimization.md` | Add indexes, optimize queries, analyze performance |
| 38 | **Logging & Monitoring** | `38-monitoring.md` | Setup log rotation, monitoring tools, health checks, alerts |
| 39 | **Backup & Recovery** | `39-backup-recovery.md` | Automated database backups, restore procedures, disaster recovery |
| 40 | **Security Hardening** | `40-security-hardening.md` | Change default passwords, SSH hardening, security audit, SSL setup |

---

## Tổng Kết

### Thống Kê Workflows

| Giai Đoạn | Số Workflows | Ưu Tiên |
|-----------|--------------|---------|
| **1. Setup & Infrastructure** | 5 | ⭐⭐⭐ Required |
| **2. Backend Foundation** | 7 | ⭐⭐⭐ Required |
| **3. Authentication** | 3 | ⭐⭐⭐ Required |
| **4. Core Modules** | 9 | ⭐⭐⭐ Required |
| **5. Frontend Development** | 6 | ⭐⭐⭐ Required |
| **6. Testing & Deployment** | 6 | ⭐⭐⭐ Required |
| **7. Maintenance & Optimization** | 4 | ⭐⭐ Optional |
| **TỔNG** | **40 workflows** | |

### Workflows Bắt Buộc (Required)

**Minimum Viable Product (MVP):** 30 workflows đầu tiên (Giai đoạn 1-6)

### Workflows Tùy Chọn (Optional)

**Optimization & Production-Ready:** 4 workflows cuối (Giai đoạn 7)

---

## Thứ Tự Thực Hiện Đề Xuất

### Week 1: Infrastructure & Backend Foundation
- Workflows 1-12 (Setup, Backend foundation)

### Week 2: Authentication & Core Modules (Backend)
- Workflows 13-24 (Auth + Core modules)

### Week 3: Frontend Development
- Workflows 25-30 (Frontend UI)

### Week 4: Testing & Deployment
- Workflows 31-36 (Tests + Production)

### Week 5-6: Optimization (Optional)
- Workflows 37-40 (Maintenance & Security)

---

## Dependencies Between Workflows

### Critical Path

```
01 Server Prep
  ↓
02 PostgreSQL → 03 Node.js → 04 Nginx
  ↓
05 Project Structure
  ↓
06 Backend Init → 07 Prisma Schema → 08 Migration → 09 Seeding
  ↓
10 Backend Core → 11 Utilities → 12 Environment
  ↓
13 Auth Module → 14 JWT Middleware → 15 Password Mgmt
  ↓
16-24 Core Modules (can be parallel)
  ↓
25 Frontend Init → 26 API Services → 27 Components
  ↓
28-30 Frontend Pages (depends on 26-27)
  ↓
31-33 Testing
  ↓
34 PM2 → 35 Nginx Config → 36 Deployment
  ↓
37-40 Optimization (optional)
```

### Parallel Workflows

**Có thể làm song song:**
- Workflows 16-24 (Core modules) - nếu có nhiều developers
- Workflows 28-30 (Frontend pages) - nếu backend APIs đã sẵn sàng
- Workflows 31-33 (Testing) - có thể viết tests trong quá trình develop

---

## Ước Tính Thời Gian

| Workflow | Estimated Time | Notes |
|----------|----------------|-------|
| 01-05 (Infrastructure) | 2-3 hours | One-time setup |
| 06-12 (Backend Foundation) | 4-6 hours | Core setup |
| 13-15 (Authentication) | 3-4 hours | Critical module |
| 16-24 (Core Modules) | 12-16 hours | Main development work |
| 25-30 (Frontend) | 10-12 hours | UI development |
| 31-33 (Testing) | 6-8 hours | Quality assurance |
| 34-36 (Deployment) | 3-4 hours | Production setup |
| 37-40 (Optimization) | 4-6 hours | Optional improvements |
| **TOTAL** | **44-59 hours** | ~1-2 weeks with Antigravity |

**Without Antigravity:** Estimated 3-4 weeks

---

## Cách Sử Dụng Workflows

### Trong Antigravity IDE

```
# Start a workflow
@workflow 01-server-preparation

# Antigravity sẽ:
1. Đọc workflow instructions
2. Follow từng bước
3. Generate code/config
4. Verify results
5. Move to next step
```

### Sequential Execution

```bash
# Thực hiện tuần tự
@workflow 01-server-preparation
@workflow 02-postgresql-setup
@workflow 03-nodejs-setup
...
```

### With Context

```
@workflow 16-students-module

Context:
- API spec: /docs/API_SPECIFICATION.md section 4.1
- Database: /docs/DATABASE_SCHEMA.md section 3.2
- UI design: /docs/UI_UX_DESIGN.md section 7.1

Generate complete students CRUD module
```

---

## Lưu Ý Quan Trọng

### ⚠️ Không Bỏ Qua Workflows Này:

1. **01-05**: Infrastructure setup - Nền tảng cho mọi thứ
2. **06-09**: Backend + Database - Core foundation
3. **13-15**: Authentication - Bảo mật quan trọng
4. **34-36**: Deployment - Đưa app lên production

### ✅ Best Practices:

1. **Follow thứ tự:** Workflows có dependencies, nên follow đúng thứ tự
2. **Verify từng bước:** Test sau mỗi workflow trước khi chuyển sang workflow tiếp theo
3. **Commit thường xuyên:** Git commit sau mỗi workflow hoàn thành
4. **Document changes:** Note lại những modifications nếu cần
5. **Test early:** Đừng đợi đến cuối mới test

### 📝 Checklist Sau Mỗi Workflow:

- [ ] Workflow completed successfully
- [ ] Code tested manually
- [ ] No errors in logs
- [ ] Git committed
- [ ] Documentation updated (if needed)
- [ ] Ready for next workflow

---

## Tài Liệu Tham Khảo

Mỗi workflow sẽ reference các tài liệu sau:

- `/docs/PRD.md` - Product requirements
- `/docs/API_SPECIFICATION.md` - API endpoints
- `/docs/DATABASE_SCHEMA.md` - Database design
- `/docs/TECHNICAL_ARCHITECTURE.md` - Architecture
- `/docs/UI_UX_DESIGN.md` - UI specifications
- `/docs/TEST_PLAN.md` - Testing requirements
- `/.agent/rules/` - Coding standards & rules
- `/project-context/` - Project context

---

**Sẵn sàng bắt đầu với Workflow 01!** 🚀
