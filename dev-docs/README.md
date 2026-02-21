# 📚 Neeti AI Developer Documentation

## Overview
Comprehensive documentation for developers, architects, and stakeholders working on the **Neeti AI** platform - an enterprise-grade technical interview platform powered by multi-agent AI evaluation.

---

## 📁 Documentation Structure

### 🎯 For Executives & Stakeholders
- **[📊 Executive Summary](EXECUTIVE_SUMMARY.md)** - High-level project overview, business value, roadmap, and metrics

### 🏗️ For Architects & Tech Leads
- **[🏛️ Architecture](ARCHITECTURE.md)** - System design, component diagrams, and technical architecture
- **[🔌 API Reference](API_REFERENCE.md)** - Complete API endpoint documentation and schemas

### 💻 For Developers
- **[🚀 Development Guide](DEVELOPMENT.md)** - Local development setup and workflow
- **[⚡ End-to-End Setup](END_TO_END_SETUP.md)** - Complete 15-minute setup walkthrough

### 🌐 For DevOps & Deployment
- **[🐳 Production Setup](PRODUCTION_SETUP.md)** - Production deployment and scaling guide
- **[☁️ Supabase Deployment](SUPABASE_DEPLOYMENT.md)** - Supabase-specific configuration

---

## 🚀 Quick Navigation

### **New to the Project?**
1. Start with **[Executive Summary](EXECUTIVE_SUMMARY.md)** for project overview
2. Review **[Architecture](ARCHITECTURE.md)** for technical understanding
3. Follow **[End-to-End Setup](END_TO_END_SETUP.md)** to get started

### **Ready to Develop?**
1. Clone repository and set up environment
2. Follow **[Development Guide](DEVELOPMENT.md)** for local setup
3. Use **[API Reference](API_REFERENCE.md)** for endpoint integration

### **Deploying to Production?**
1. Review **[Production Setup](PRODUCTION_SETUP.md)** for requirements
2. Configure **[Supabase Deployment](SUPABASE_DEPLOYMENT.md)** for database
3. Follow security and scaling best practices

---

## 🎯 Key Features

- **🤖 Multi-Agent AI Evaluation** - 5 specialized agents analyzing code, speech, vision, reasoning, and overall fit
- **📹 Real-time Video Interviews** - LiveKit WebRTC with sub-second latency
- **💻 Collaborative Code Editor** - Monaco editor with 50+ language support
- **📊 Live Monitoring Dashboard** - Real-time metrics and recruiter insights
- **🔒 Enterprise Security** - Supabase auth, JWT tokens, RBAC
- **⚡ Event-Driven Architecture** - Redis pub/sub for scalability

---

## 📋 Documentation Index

| Document | Type | Audience | Read Time |
|----------|------|----------|-----------|
| [EXECUTIVE_SUMMARY.md](EXECUTIVE_SUMMARY.md) | Business Overview | Executives, PMs, Stakeholders | 15 min |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Technical Design | Architects, Senior Devs | 20 min |
| [API_REFERENCE.md](API_REFERENCE.md) | API Documentation | Backend Developers | 30 min |
| [DEVELOPMENT.md](DEVELOPMENT.md) | Setup Guide | All Developers | 15 min |
| [END_TO_END_SETUP.md](END_TO_END_SETUP.md) | Tutorial | New Contributors | 15 min |
| [PRODUCTION_SETUP.md](PRODUCTION_SETUP.md) | Deployment Guide | DevOps, SRE | 25 min |
| [SUPABASE_DEPLOYMENT.md](SUPABASE_DEPLOYMENT.md) | Database Setup | Backend Devs, DevOps | 10 min |

---

## 🛠️ Tech Stack Summary

**Frontend**: React 19 • TypeScript 5 • Vite • TailwindCSS • Zustand • Monaco Editor • LiveKit  
**Backend**: FastAPI • Python 3.11 • SQLAlchemy 2.0 • PostgreSQL 15 • Celery • Redis 7  
**Infrastructure**: Docker • Supabase • LiveKit • Judge0 • OpenAI • Anthropic Claude

---

## 📞 Support & Contribution

- **Issues**: [GitHub Issues](https://github.com/sukrit-89/Neeti-AI/issues)
- **Discussions**: [GitHub Discussions](https://github.com/sukrit-89/Neeti-AI/discussions)
- **Email**: sukrit.goswami.work@gmail.com

### Contributing Guidelines

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow code standards (Black, PEP 8, ESLint)
4. Write tests for new features
5. Commit with conventional commits (`feat:`, `fix:`, `docs:`)
6. Open a Pull Request

---

## 🔄 Document Updates

| Date | Document | Changes |
|------|----------|---------|
| 2025-06 | All docs | Renamed Integrity AI → Neeti AI (नीति) |
| 2025-06 | ARCHITECTURE.md | Updated file structure to match actual code, fixed React 18→19, removed structlog references |
| 2025-06 | DEVELOPMENT.md | Replaced Alembic references with init_db.py/create_all() workflow, updated project tree |
| 2025-06 | EXECUTIVE_SUMMARY.md | Removed claims about non-existent features (WCAG, multi-language UI, SOC2, export formats) |
| 2025-06 | API_REFERENCE.md | Added Supabase Auth note |
| 2025-06 | SUPABASE_DEPLOYMENT.md | Replaced Alembic with init_db.py |
| 2025-06 | PRODUCTION_SETUP.md | Replaced Alembic with init_db.py |
| 2026-02-10 | EXECUTIVE_SUMMARY.md | Created comprehensive project overview |
| 2026-02-10 | README.md | Updated documentation structure |
| 2026-01-15 | END_TO_END_SETUP.md | Added setup walkthrough |
| 2026-01-10 | ARCHITECTURE.md | Initial architecture documentation |

---

<div align="center">

**Neeti AI Documentation**  
*Version 1.0 • Last Updated: February 10, 2026*

[🏠 Main Repository](../) • [📖 Documentation](.) • [🚀 Get Started](END_TO_END_SETUP.md)

</div>
