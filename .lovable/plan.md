

## Fix: Update Banner Deadline to April 30, 2026

The banner is hidden because the current deadline is set to April 30, 2025, which has already passed. Update the year to 2026.

### Change

**File: `src/components/AnnouncementBanner.tsx`** (line 8)
- Change `new Date(2025, 3, 30)` to `new Date(2026, 3, 30)`

This one-line fix will immediately restore the banner with the correct countdown to April 30, 2026.

