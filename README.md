# ApplyFlow - Full-Stack Job Application Tracking System

A production-style full-stack web application built to manage and analyze job applications reliably under realistic data loads.

ApplyFlow was designed and implemented end-to-end, with a focus on correctness, performance, and maintainability rather than just feature completeness.

---

## Why I Built This
I built this project to solve a real problem I personally faced, tracking job applications at scale, while learning how full-stack systems behave in production environments.

Instead of treating this as a demo, I focused on building a system that could handle realistic usage, validate inputs correctly, and remain responsive as data grows.

---

## System Overview
- Frontend handles filtering, sorting, and UI state management
- Backend exposes REST APIs with validation and structured error handling
- PostgreSQL provides persistent, relational storage
- Deployed as a distributed system with independent frontend and backend services

---

## Tech Stack
**Frontend:** React, TypeScript, Tailwind CSS  
**Backend:** Java, Spring Boot, REST APIs  
**Database:** PostgreSQL  
**Deployment:** Vercel (frontend), Render (backend)

---

## Key Engineering Decisions
- Designed REST APIs with explicit input validation and predictable error responses
- Chose PostgreSQL for relational consistency and future extensibility
- Implemented server-side filtering and pagination to support larger datasets
- Structured frontend state to avoid unnecessary re-renders during filtering
- Deployed services independently to mirror real-world system separation

---

## Performance & Validation
- Tested with 300+ job application records
- Lighthouse scores:
  - Performance: 100
  - Best Practices: 100
  - SEO: 100
- Core metrics:
  - LCP: 1.3s
  - TBT: 50ms
  - CLS: 0

---

## What This Project Demonstrates
- Ability to design and implement full-stack systems end-to-end
- Experience building RESTful backends with validation and persistence
- Understanding of frontend state management and performance
- Comfort deploying, debugging, and maintaining live applications
- Focus on correctness, testing, and measurable performance

---

## Live Demo
https://job-tracker-fullstack-ashen.vercel.app/

---

## What I Learned
- Designing APIs that behave predictably under edge cases
- Debugging issues that only appear after deployment
- Measuring and improving real-world frontend performance
- Writing code with maintainability in mind, not just functionality

