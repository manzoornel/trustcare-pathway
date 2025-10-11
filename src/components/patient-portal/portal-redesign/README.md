# Doctor Uncle Patient Portal - Redesigned Components

This directory contains the redesigned Patient Portal components following the premium Doctor Uncle mobile UI design.

## Components

### PortalTopBar
Top navigation bar with hamburger menu, title, and notifications.

**Props:**
- `onMenuClick`: Function to open the side drawer
- `notificationCount`: Optional number for notification badge

### SideDrawer
Sliding navigation menu with profile, menu items, and logout.

**Props:**
- `isOpen`: Boolean to control drawer visibility
- `onClose`: Function to close the drawer

**Customization:**
Edit the `menuItems` array in `SideDrawer.tsx` to add/remove menu items:
```typescript
const menuItems = [
  { icon: LayoutDashboard, label: "Patient Portal", path: "/patient-portal", active: true },
  { icon: Calendar, label: "Appointments", path: "/appointments" },
  // Add more items here
];
```

### FeatureCard
Individual feature card for the 2×3 grid.

**Props:**
- `icon`: Lucide icon component
- `label`: Display text
- `onClick`: Click handler
- `badge`: Optional badge count
- `disabled`: Disable interaction
- `comingSoon`: Show "SOON" badge

### PortalGrid
Main feature grid with 6 active features and 3 coming soon placeholders.

**Customization:**
Edit the `mainFeatures` array in `PortalGrid.tsx` to change features:
```typescript
const mainFeatures = [
  { icon: FileText, label: "Lab Reports", key: "lab-reports" },
  // Modify or add features here
];
```

**Wiring APIs:**
Feature keys are mapped to tab values in `handleFeatureClick`. Update the `tabMapping` object to connect features to your API routes:
```typescript
const tabMapping: Record<string, string> = {
  "lab-reports": "labReports",
  "medications": "medications",
  // Add your API mappings here
};
```

## Design Tokens

All colors and styling use CSS variables scoped to the portal:

```css
--du-bg: #203238           /* Dark background */
--du-surface: #253943      /* Card surface */
--du-teal: #34C9C7         /* Primary teal */
--du-teal-2: #58D7D6       /* Secondary teal */
--du-text: #FFFFFF         /* Text on dark */
--du-muted: #94A3B8        /* Muted labels */
--du-radius: 20px          /* Border radius */
--du-shadow: 0 8px 24px... /* Card shadow */
```

These are defined inline in `PatientPortal.tsx` and only affect this page.

## Changing Icons

Icons use `lucide-react`. To change an icon:

1. Import the new icon: `import { NewIcon } from "lucide-react"`
2. Replace in the feature/menu array: `{ icon: NewIcon, label: "..." }`

## Mobile-First Design

All components are optimized for 390-430px width viewports and scale gracefully to tablet/desktop. Key features:

- Touch-friendly tap targets (44px minimum)
- Smooth transitions (240-300ms)
- Accessible focus states
- WCAG AA contrast ratios

## Accessibility

All interactive elements include:
- `aria-label` attributes
- `role="button"` where needed
- Keyboard navigation support
- Screen reader friendly

## Performance

- Drawer uses CSS transforms for smooth animations
- Cards use `will-change` for GPU acceleration
- No global CSS pollution - all styles scoped to portal

## Testing

To verify the redesign:
1. Navigate to `/patient-portal`
2. Test hamburger menu → drawer opens/closes smoothly
3. Tap feature cards → navigates to correct tab
4. Check notifications badge → displays count
5. Test logout flow → confirmation dialog appears
