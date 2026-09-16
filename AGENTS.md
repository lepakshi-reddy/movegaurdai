# MoveGuard AI — Engineering Guidelines & Architecture

## System Overview
MoveGuard AI is a full-stack, on-device AI movement analysis and wellness platform built with React, TypeScript, Tailwind CSS, MediaPipe Pose Landmarker, and Supabase (with offline persistent fallback).

## Core Principles
1. **100% On-Device Privacy**: Video frames are analyzed locally in browser memory via WebAssembly/WebGL and discarded immediately. No raw webcam footage is ever transmitted or stored on any server.
2. **Deterministic Rep Counting**: NEVER count reps once per frame. All repetition counting is guarded by the `RepStateMachine` with angle smoothing (EMA), hysteresis bounds, minimum transition durations, debounce intervals, and confidence checks.
3. **Transparent Fitness Scoring**: Movement quality is scored on a transparent 0–100 scale (Excellent: 90–100, Good: 75–89, Needs Improvement: 60–74, Needs Correction: <60). Never describe this as a medical diagnosis.
4. **Resilient Dual Data Layer**: Supports Supabase PostgreSQL with Row Level Security (RLS) when environment variables are supplied, and defaults to a persistent universal storage layer when offline or running in standalone demo mode.
5. **Multi-Language Support**: All strings are centralized in `src/lib/i18n.ts` supporting English, Telugu (తెలుగు), and Hindi (हिन्दी).

## Project Commands
- **Install Dependencies**: `npm install`
- **Development Server**: `npm run dev` (starts on port 3000)
- **Run Unit Tests**: `npm test` (runs Vitest test suites)
- **Production Build**: `npm run build` (TypeScript compiler + Vite bundle)
- **Preview Production Build**: `npm run preview`

## Directory Structure
- `src/ai/`: MediaPipe pose landmarker, geometric math vector calculations, repetition state machine, posture analyzer, skeleton renderer, and synthetic pose simulator.
- `src/auth/`: AuthProvider, ProtectedRoute, role-based access control (`user` vs `admin`).
- `src/components/`: Reusable accessible UI components, layout (Navbar, Footer), charts, and live camera overlays.
- `src/pages/`: Landing, Login, Signup, Dashboard, Analyze, Posture, Exercises, Reports, History, Profile, Settings, Chat, and Admin.
- `src/services/`: Unified persistent database client, speech audio cue service, and workout management.
- `src/types/`: Strict TypeScript definitions for database models, exercises, and authentication.
- `supabase/migrations/`: SQL migration files with full schema and RLS policies.
- `tests/`: Automated Vitest suites for rep state machines, geometry, and auth/db layers.
