

## Update Announcement Banner: Countdown + Registration CTA

Replace the rotating announcements with a countdown timer to April 30, 2025 and a call-to-action pushing clients to register their preferred location.

### What Changes

**File: `src/components/AnnouncementBanner.tsx`**

- Remove the rotating announcements array, `scrollPosition` state, and the interval `useEffect`
- Add a countdown calculating days remaining until April 30, 2025 using `differenceInDays` from `date-fns` (already installed)
- Display: **"XX days till Fatt Matt leaves the building! Register your location now!"**
- Make "Register your location now!" a clickable link that smooth-scrolls to the `#locations` section
- If the deadline has passed, auto-hide the banner
- Keep the dismiss (X) button

### Technical Details

- Use `differenceInDays(new Date(2025, 3, 30), new Date())` for the countdown
- Add an anchor or click handler with `document.getElementById('locations')?.scrollIntoView({ behavior: 'smooth' })` on the CTA text
- Style the CTA portion with an underline or bold to make it stand out as clickable
- Remove all scroll/carousel logic to simplify the component

