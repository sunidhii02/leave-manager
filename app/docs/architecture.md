# Architecture Notes

## Overview
LeaveFlow is a lightweight Next.js application that models a simple leave workflow for employees, managers, and administrators.

## Data Model
- Users: represent employees, managers, and admins
- Leave types: define the policy categories such as vacation and sick leave
- Leave balances: track remaining and total days by user and leave type
- Leave requests: capture requests, their status, and manager review details

## Authorization Approach
The UI currently uses a role-based sample dataset to simulate access across employee, manager, and admin views. In a production version, this would be replaced with server-side auth and database-backed role checks.

## Trade-offs
The initial release focuses on clarity and a polished experience rather than a full production-grade HR backend. The app is intentionally simple so the core workflow is easy to understand and extend.
