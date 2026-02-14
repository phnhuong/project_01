# Danh Sách Rules - Hệ Thống Quản Lý Học Sinh

---

## Tổng Quan

Dự án cần **20 rule files** được tổ chức thành **5 nhóm** để định nghĩa standards và guidelines cho agent.

---

## Nhóm 1: Project Foundation Rules (4 rules)

| # | Rule | File | Mục Đích |
|---|------|------|----------|
| 1 | **Project Context** | `project-context.md` | Định nghĩa tổng quan dự án: mục tiêu, scope, tech stack, team, timeline |
| 2 | **Technical Stack** | `tech-stack.md` | Quy định công nghệ sử dụng: versions, libraries, tools, rationale |
| 3 | **Architecture Principles** | `architecture-principles.md` | Nguyên tắc kiến trúc: patterns, layers, separation of concerns, scalability |
| 4 | **Development Workflow** | `development-workflow.md` | Quy trình làm việc: branching, commits, PRs, code review, deployment |

---

## Nhóm 2: Code Standards Rules (6 rules)

| # | Rule | File | Mục Đích |
|---|------|------|----------|
| 5 | **Coding Standards** | `coding-standards.md` | Quy tắc viết code: naming, formatting, comments, file organization |
| 6 | **JavaScript/Node.js Standards** | `javascript-standards.md` | JavaScript best practices: ES6+, async/await, modules, error handling |
| 7 | **React Standards** | `react-standards.md` | React conventions: components, hooks, props, state management, performance |
| 8 | **CSS/Tailwind Standards** | `css-standards.md` | Styling rules: Tailwind usage, responsive design, naming conventions |
| 9 | **File & Folder Naming** | `naming-conventions.md` | Naming rules: files, folders, variables, functions, classes, constants |
| 10 | **Code Organization** | `code-organization.md` | Tổ chức code: folder structure, module structure, imports, exports |

---

## Nhóm 3: Database & API Rules (4 rules)

| # | Rule | File | Mục Đích |
|---|------|------|----------|
| 11 | **Database Design Rules** | `database-rules.md` | Quy tắc database: naming, types, relationships, indexes, constraints |
| 12 | **Prisma Schema Rules** | `prisma-rules.md` | Prisma conventions: models, fields, relations, migrations, naming |
| 13 | **API Design Rules** | `api-design-rules.md` | REST API standards: endpoints, methods, status codes, responses, versioning |
| 14 | **API Response Format** | `api-response-format.md` | Format chuẩn cho API responses: success, error, pagination, data structure |

---

## Nhóm 4: Security & Quality Rules (4 rules)

| # | Rule | File | Mục Đích |
|---|------|------|----------|
| 15 | **Security Rules** | `security-rules.md` | Quy tắc bảo mật: authentication, authorization, input validation, XSS, CSRF |
| 16 | **Password & Auth Rules** | `password-auth-rules.md` | Quy tắc xác thực: password strength, hashing, tokens, session management |
| 17 | **Error Handling Rules** | `error-handling-rules.md` | Xử lý errors: error types, messages, logging, user-facing errors |
| 18 | **Testing Rules** | `testing-rules.md` | Testing standards: coverage, test structure, naming, assertions, mocking |

---

## Nhóm 5: Deployment & Operations Rules (2 rules)

| # | Rule | File | Mục Đích |
|---|------|------|----------|
| 19 | **Deployment Rules** | `deployment-rules.md` | Quy tắc deployment: environment setup, build process, rollback, health checks |
| 20 | **Logging & Monitoring Rules** | `logging-monitoring-rules.md` | Logging standards: log levels, format, rotation, monitoring, alerts |

---

## Tổng Kết Rules

### Thống Kê Theo Nhóm

| Nhóm | Số Rules | Ưu Tiên | Ghi Chú |
|------|----------|---------|---------|
| **1. Project Foundation** | 4 | ⭐⭐⭐ Required | Core project definition |
| **2. Code Standards** | 6 | ⭐⭐⭐ Required | Code quality & consistency |
| **3. Database & API** | 4 | ⭐⭐⭐ Required | Data & interface standards |
| **4. Security & Quality** | 4 | ⭐⭐⭐ Required | Production-ready quality |
| **5. Deployment & Ops** | 2 | ⭐⭐ Important | Operations standards |
| **TỔNG** | **20 rules** | | |

---

## Rules Priority Levels

### Critical Rules (Must Have - Phase 1)

**Không thể thiếu cho development:**

1. Project Context
2. Technical Stack
3. Coding Standards
4. JavaScript/Node.js Standards
5. Database Design Rules
6. API Design Rules
7. Security Rules

### Important Rules (Should Have - Phase 2)

**Cải thiện quality:**

8. React Standards
9. Prisma Schema Rules
10. API Response Format
11. Error Handling Rules
12. Password & Auth Rules

### Nice to Have Rules (Phase 3)

**Polish & optimization:**

13. File & Folder Naming
14. Code Organization
15. CSS/Tailwind Standards
16. Testing Rules
17. Deployment Rules
18. Logging & Monitoring Rules
19. Architecture Principles
20. Development Workflow

---

## Rules vs Workflows vs Skills

### So Sánh Ba Thành Phần

| Component | Purpose | Content | Example |
|-----------|---------|---------|---------|
| **RULES** | Standards (WHAT) | "MUST do this" | "Variables MUST use camelCase" |
| **SKILLS** | Knowledge (HOW) | "How to do this" | "How to create Express routes" |
| **WORKFLOWS** | Process (WHEN) | "Step-by-step" | "Step 1: Schema, Step 2: Migration..." |

### Mối Quan Hệ

```
RULES → Define standards
   ↓
SKILLS → Provide knowledge to implement standards
   ↓
WORKFLOWS → Organize implementation steps
   ↓
RESULT → Consistent, high-quality code
```

### Example Integration

```
RULE (coding-standards.md):
"Controller functions MUST use try-catch for error handling"

SKILL (expressjs-api.md):
"How to implement try-catch in Express controllers"
[Code examples]

WORKFLOW (16-students-module.md):
"Step 7: Create controller
- Apply coding-standards.md
- Use expressjs-api.md skill
- Generate studentController.js"

AGENT executes:
✅ Knows WHAT to do (rule)
✅ Knows HOW to do (skill)
✅ Knows WHEN to do (workflow)
→ Generates compliant code
```

---

## Rules Coverage Matrix

### Backend Coverage

| Aspect | Rules |
|--------|-------|
| **Code Style** | #5 Coding Standards, #6 JavaScript Standards |
| **Database** | #11 Database Rules, #12 Prisma Rules |
| **API** | #13 API Design, #14 API Response Format |
| **Security** | #15 Security Rules, #16 Password/Auth Rules |
| **Error Handling** | #17 Error Handling Rules |
| **Testing** | #18 Testing Rules |
| **Logging** | #20 Logging & Monitoring |

### Frontend Coverage

| Aspect | Rules |
|--------|-------|
| **Code Style** | #5 Coding Standards, #7 React Standards |
| **Styling** | #8 CSS/Tailwind Standards |
| **Structure** | #9 Naming, #10 Code Organization |
| **API Integration** | #13 API Design (consumer side) |
| **Security** | #15 Security Rules (client-side) |
| **Testing** | #18 Testing Rules |

### DevOps Coverage

| Aspect | Rules |
|--------|-------|
| **Infrastructure** | #2 Technical Stack |
| **Deployment** | #19 Deployment Rules |
| **Monitoring** | #20 Logging & Monitoring |
| **Workflow** | #4 Development Workflow |

---

## Rule Relationships & Dependencies

### Foundation Rules (Learn First)

**Must understand before others:**

1. **Project Context** → All other rules
2. **Technical Stack** → All technical rules
3. **Architecture Principles** → Code organization rules

### Dependent Rules

**Require foundation:**

4. **Coding Standards** → Depends on: Tech Stack
5. **JavaScript Standards** → Depends on: Tech Stack, Coding Standards
6. **React Standards** → Depends on: JavaScript Standards, Coding Standards
7. **Database Rules** → Depends on: Tech Stack, Architecture
8. **API Design** → Depends on: Architecture Principles

### Advanced Rules

**Require multiple dependencies:**

9. **Security Rules** → Depends on: API Design, Database Rules, Coding Standards
10. **Testing Rules** → Depends on: Coding Standards, JavaScript Standards
11. **Deployment Rules** → Depends on: All above

---

## Rules Application in Development

### Phase 1: Setup (Workflows 1-12)

**Active rules:**
- #1 Project Context
- #2 Technical Stack
- #4 Development Workflow
- #5 Coding Standards
- #11 Database Design Rules
- #12 Prisma Schema Rules

### Phase 2: Authentication (Workflows 13-15)

**Active rules:**
- All Phase 1 rules +
- #6 JavaScript Standards
- #13 API Design Rules
- #14 API Response Format
- #15 Security Rules
- #16 Password & Auth Rules
- #17 Error Handling Rules

### Phase 3: Core Modules (Workflows 16-24)

**Active rules:**
- All Phase 2 rules +
- #9 Naming Conventions
- #10 Code Organization
- #18 Testing Rules

### Phase 4: Frontend (Workflows 25-30)

**Active rules:**
- All previous rules +
- #7 React Standards
- #8 CSS/Tailwind Standards

### Phase 5: Deployment (Workflows 31-36)

**Active rules:**
- All previous rules +
- #19 Deployment Rules
- #20 Logging & Monitoring Rules

---

## Nội Dung Mỗi Rule File

### Cấu Trúc Chung

Mỗi rule file sẽ có:

1. **Purpose** - Mục đích của rule
2. **Scope** - Phạm vi áp dụng
3. **Rules** - Danh sách rules cụ thể
4. **Examples** - Ví dụ đúng/sai
5. **Exceptions** - Trường hợp ngoại lệ
6. **Enforcement** - Cách enforce rules
7. **References** - Tài liệu liên quan

### Example Structure

```markdown
# Rule: Coding Standards

## Purpose
Ensure consistent, readable, maintainable code across the project.

## Scope
Applies to: All JavaScript/TypeScript code in backend and frontend.

## Rules

### 1. Naming Conventions

#### Variables
✅ MUST use camelCase
✅ MUST be descriptive
❌ MUST NOT use abbreviations (unless common)

**Examples:**
✅ `const studentData = ...`
✅ `const isActive = ...`
❌ `const sd = ...`
❌ `const x = ...`

#### Functions
✅ MUST use camelCase
✅ MUST start with verb
✅ MUST be descriptive

**Examples:**
✅ `function getStudentById(id) { ... }`
✅ `const calculateAverage = () => { ... }`
❌ `function student(id) { ... }`

### 2. Code Formatting

#### Indentation
✅ MUST use 2 spaces
❌ MUST NOT use tabs

#### Line Length
✅ SHOULD be max 100 characters
✅ CAN exceed for URLs or long strings

#### Quotes
✅ MUST use single quotes for strings
✅ CAN use backticks for template literals

**Examples:**
✅ `const name = 'John';`
✅ `const message = \`Hello ${name}\`;`
❌ `const name = "John";`

## Exceptions

### When to Break Rules
1. **Third-party code** - Follow library conventions
2. **Auto-generated code** - Prisma, migrations
3. **Legacy code** - When refactoring later

## Enforcement

### Automated
- ESLint configuration
- Prettier configuration
- Pre-commit hooks

### Manual
- Code review checklist
- PR guidelines

## References
- /docs/TECHNICAL_ARCHITECTURE.md
- Project coding style guide
```

---

## Rules Enforcement Strategy

### Level 1: Automated (Preferred)

**Tools:**
- ESLint - JavaScript/React rules
- Prettier - Code formatting
- Husky - Git hooks
- TypeScript - Type checking (if used)

**Example:**
```json
// .eslintrc.json
{
  "rules": {
    "camelcase": "error",
    "quotes": ["error", "single"],
    "semi": ["error", "always"]
  }
}
```

### Level 2: Agent Enforcement

**Antigravity agent checks:**
```
@rule coding-standards
@rule api-design-rules

Generate code following all rules
```

Agent will:
- ✅ Read all applicable rules
- ✅ Generate compliant code
- ✅ Self-validate against rules
- ✅ Flag violations

### Level 3: Manual Review

**Code review checklist:**
- [ ] Follows naming conventions
- [ ] Proper error handling
- [ ] Security best practices applied
- [ ] Tests included
- [ ] Documentation updated

---

## Rules Checklist

### Before Starting Development

**Project Setup:**
- [ ] Project Context defined
- [ ] Technical Stack documented
- [ ] Architecture Principles agreed
- [ ] Development Workflow established

### During Development

**Code Quality:**
- [ ] Coding Standards applied
- [ ] JavaScript/React Standards followed
- [ ] Naming Conventions consistent
- [ ] Code Organization proper

**Database & API:**
- [ ] Database Rules followed
- [ ] Prisma Schema compliant
- [ ] API Design standards met
- [ ] Response Format consistent

**Security:**
- [ ] Security Rules applied
- [ ] Password/Auth Rules followed
- [ ] Input validation implemented
- [ ] Error handling secure

### Before Deployment

**Quality Gates:**
- [ ] Testing Rules satisfied
- [ ] Test coverage > 80%
- [ ] Error Handling complete
- [ ] Logging implemented

**Operations:**
- [ ] Deployment Rules ready
- [ ] Monitoring configured
- [ ] Backup strategy defined

---

## Rules vs Project Documents

### How Rules Relate to Docs

| Document | Rules Created From |
|----------|-------------------|
| **PRD.md** | → Project Context, Architecture Principles |
| **API_SPECIFICATION.md** | → API Design Rules, API Response Format |
| **DATABASE_SCHEMA.md** | → Database Rules, Prisma Rules |
| **TECHNICAL_ARCHITECTURE.md** | → Tech Stack, Architecture Principles |
| **UI_UX_DESIGN.md** | → React Standards, CSS/Tailwind Standards |
| **TEST_PLAN.md** | → Testing Rules |
| **DEVELOPMENT_SETUP_GUIDE.md** | → Development Workflow, Deployment Rules |

### Rules are Distilled Standards

```
Project Docs (100+ pages)
    ↓
Distill key standards
    ↓
Rules (Concise, actionable)
    ↓
Agent applies rules
    ↓
Consistent code
```

---

## Updating Rules

### When to Update

**Update rules when:**
1. New technology added to stack
2. New pattern established
3. Security issue discovered
4. Team agreement on new standard
5. Best practice evolved

### How to Update

```markdown
# Version Control for Rules

## Rule: Coding Standards
**Version:** 2.0
**Last Updated:** 2026-02-03
**Changes:**
- Added: Async/await required for promises
- Changed: Max line length 80 → 100
- Removed: Support for callbacks

## Changelog
### v2.0 (2026-02-03)
- Async/await now required

### v1.0 (2026-01-31)
- Initial version
```

### Communication

**When updating rules:**
1. Document change in rule file
2. Notify team (Slack, email)
3. Update related docs
4. Update agent configuration
5. Review existing code (if breaking)

---

## Rules Maintenance

### Regular Reviews

**Monthly:**
- Review rule violations
- Identify common issues
- Update rules if needed

**Quarterly:**
- Major review of all rules
- Align with industry standards
- Update based on team feedback

### Metrics to Track

| Metric | Target | Action if Below |
|--------|--------|-----------------|
| Rule compliance | > 95% | Review & simplify rules |
| Code review violations | < 5% | Better enforcement |
| Agent-generated code quality | > 90% | Update agent prompts |
| Test coverage | > 80% | Enforce testing rules |

---

## Benefits of Well-Defined Rules

### For Developers

✅ **Clear expectations** - Know what's required
✅ **Faster development** - Less decision fatigue
✅ **Better quality** - Consistent standards
✅ **Easier reviews** - Objective criteria

### For Agent (Antigravity)

✅ **Clear guidance** - Know what to generate
✅ **Quality assurance** - Built-in validation
✅ **Consistency** - Same standards every time
✅ **Autonomous work** - Less human intervention

### For Project

✅ **Maintainability** - Consistent codebase
✅ **Scalability** - Easy to onboard
✅ **Quality** - High standards enforced
✅ **Speed** - Automated compliance

---

## Next Steps

**Bạn muốn:**

1. ✅ **Tôi viết chi tiết TẤT CẢ 20 rules?** (Complete rulebook)
2. ✅ **Tôi viết 7 critical rules trước?** (Priority approach)
3. ✅ **Tôi viết từng nhóm một?** (Category by category)
4. ✅ **Tôi viết 3-4 rules mẫu để demo format?** (Show examples)

**Chọn approach nào bạn nhé!** 🎯

---

## Summary Table - Complete Rules List

| # | Rule File | Nhóm | Ưu Tiên |
|---|-----------|------|---------|
| 1 | project-context.md | Foundation | ⭐⭐⭐ |
| 2 | tech-stack.md | Foundation | ⭐⭐⭐ |
| 3 | architecture-principles.md | Foundation | ⭐⭐ |
| 4 | development-workflow.md | Foundation | ⭐⭐ |
| 5 | coding-standards.md | Code Standards | ⭐⭐⭐ |
| 6 | javascript-standards.md | Code Standards | ⭐⭐⭐ |
| 7 | react-standards.md | Code Standards | ⭐⭐⭐ |
| 8 | css-standards.md | Code Standards | ⭐⭐ |
| 9 | naming-conventions.md | Code Standards | ⭐⭐ |
| 10 | code-organization.md | Code Standards | ⭐⭐ |
| 11 | database-rules.md | Database & API | ⭐⭐⭐ |
| 12 | prisma-rules.md | Database & API | ⭐⭐⭐ |
| 13 | api-design-rules.md | Database & API | ⭐⭐⭐ |
| 14 | api-response-format.md | Database & API | ⭐⭐⭐ |
| 15 | security-rules.md | Security & Quality | ⭐⭐⭐ |
| 16 | password-auth-rules.md | Security & Quality | ⭐⭐⭐ |
| 17 | error-handling-rules.md | Security & Quality | ⭐⭐⭐ |
| 18 | testing-rules.md | Security & Quality | ⭐⭐ |
| 19 | deployment-rules.md | Deployment & Ops | ⭐⭐ |
| 20 | logging-monitoring-rules.md | Deployment & Ops | ⭐⭐ |

---

**Rules = Standards & Guidelines** 📏  
**Skills = Knowledge & Know-how** 🧠  
**Workflows = Step-by-step Process** 📝

**Together = AI-Powered Development Excellence!** 🚀
