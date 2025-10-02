# Design Guidelines: AL Mundo Tours Reservation Document Generator

## Design Approach

**Hybrid Approach**: Utility-focused application interface with professional document output styling. The form interface prioritizes usability and efficiency, while the document preview/output mirrors the professional tourism industry aesthetic from the provided examples.

**Reference Inspiration**: Professional booking platforms (Booking.com, TripAdvisor business tools) combined with document generation tools (DocuSign, PandaDoc) for the form interface. Output documents reference the provided PDF examples with clean, structured layouts.

## Core Design Elements

### A. Color Palette

**Application Interface (Dark Mode)**:
- Background: 220 15% 12% (deep charcoal)
- Surface: 220 15% 18% (elevated surface)
- Border: 220 10% 25% (subtle borders)
- Text Primary: 0 0% 98%
- Text Secondary: 0 0% 70%

**Document Output (Light, Professional)**:
- Primary Brand: 200 82% 35% (AL Mundo Tours blue - #0a6aa1)
- Accent Gold: 38 95% 50% (warm gold for highlights - #f0a500)
- Document Background: 0 0% 100%
- Document Text: 0 0% 20%
- Divider Gray: 0 0% 85%

### B. Typography

**Primary Font Family**: Poppins (Google Fonts)
- Headings: Poppins Bold, 600 weight
- Body: Poppins Regular, 400 weight
- Small Text: Poppins Regular, 300 weight

**Application Interface Scale**:
- Form Labels: 14px, 500 weight
- Input Text: 15px, 400 weight
- Section Titles: 20px, 600 weight
- Page Heading: 28px, 700 weight

**Document Output Scale**:
- Reservation Code: 36px, 700 weight (hero element)
- Section Titles: 24px, 600 weight
- Subsection Titles: 18px, 600 weight
- Body Text: 14px, 400 weight
- Small Print: 11px, 400 weight

### C. Layout System

**Tailwind Spacing Units**: 2, 4, 6, 8, 12, 16, 20, 24

**Application Layout**:
- Container: max-w-7xl with px-6
- Form sections: space-y-6
- Input groups: space-y-2
- Section padding: py-8
- Card padding: p-6

**Document Preview Layout**:
- A4 proportions (210mm × 297mm simulated)
- Content margins: 40px all sides
- Section spacing: 24px between major sections
- Grid layouts: 3-column for hotel photos, 2-column for details

### D. Component Library

**Form Interface Components**:

1. **Multi-Step Form Navigation**
   - Progress indicator with 5 steps: Información Básica → Destinos → Vuelos → Extras → Revisión
   - Active step highlighted in brand blue
   - Completed steps with checkmark icon

2. **Input Fields**
   - Rounded borders (rounded-lg)
   - Dark backgrounds with light text
   - Focus state: blue ring with increased brightness
   - Label above input pattern

3. **Dynamic Lists** (Destinations, Tours, Passengers)
   - Card-based items with delete/edit actions
   - "+ Agregar" button with dashed border
   - Drag handles for reordering (optional visual indicator)

4. **Image Upload Components**
   - Drag-and-drop zones with preview thumbnails
   - Library selector modal with pre-loaded destination images
   - 3:2 aspect ratio for banners, square for logos

5. **Action Buttons**
   - Primary: Blue background (200 82% 35%), white text
   - Secondary: Transparent with blue border
   - Success: Green for "Generar PDF"
   - Consistent height: h-10 or h-12

**Document Preview Components**:

1. **Header**
   - Logo (top-left, 60px height)
   - Agency details (top-right, small text)
   - Consistent across all pages

2. **Hero Section** (Page 1)
   - Full-width destination banner (aspect-ratio-21/9)
   - Large reservation code centered over subtle overlay
   - Passenger list in clean table format

3. **Itinerary Cards**
   - Numbered circles for destinations (40px, blue background)
   - White cards with subtle shadows
   - Icon indicators for flight/hotel/tour/transfer

4. **Flight Display**
   - Airline logo (80px square) left-aligned
   - Flight details in 2-column grid
   - Timeline visualization with connecting lines
   - Gray dividers between segments

5. **Hotel Section**
   - Hotel name (24px, bold)
   - 3 photos in horizontal row (equal width, 4:3 ratio)
   - Details below in list format with icons

6. **Footer**
   - Gray divider line
   - Agency logo (small, 40px height)
   - Contact information centered
   - Legal disclaimer (10px, gray text)
   - "Gracias por viajar..." message (12px, brand blue)

### E. Animations

**Minimal and Purposeful**:
- Form field focus: subtle scale and glow (duration-200)
- Add/remove list items: fade and slide (duration-300)
- Step transitions: slide content left/right (duration-400)
- PDF generation: spinner with progress percentage
- No decorative animations

## Images

**Image Strategy**:

1. **Application Interface**:
   - No hero image needed for the form interface
   - Small illustrative icons for empty states
   - Thumbnail previews for uploaded/selected images

2. **Pre-loaded Library** (organized by destination):
   - Banner images for popular Colombian destinations:
     * San Andrés (beach, Johnny Cay)
     * Cartagena (historic center, sunset)
     * Bogotá (Monserrate, city view)
     * Medellín (metro cable, flowers)
     * Eje Cafetero (coffee farms, Cocora Valley)
   - Airline logos: Avianca, LATAM, Wingo, Viva Air, Copa
   - Transfer vehicle photos: sedans, vans, buses (realistic stock photos)

3. **Document Output**:
   - Page 1: Destination banner (full-width, 350px height)
   - Page 2+: Secondary destination banner (full-width, 250px height)
   - Flight section: Airline logos (80px × 80px)
   - Transfer section: Vehicle photo (300px × 200px)
   - Hotel section: 3 photos in row (220px × 165px each)

**Image Treatment**:
- Subtle overlay (rgba(0,0,0,0.1)) on banners for text legibility
- Rounded corners (rounded-lg) for hotel and vehicle photos
- Proper aspect ratios maintained, object-fit: cover

## Special Considerations

**Professional Document Standards**:
- Consistent margins and padding throughout document
- Clear visual hierarchy with size and weight variations
- Blue underlines for clickable links (terms & conditions)
- Tables with alternating row backgrounds for passenger lists
- Icons from Heroicons for consistency (flights, hotels, transfers, tours)

**Responsive Behavior**:
- Application interface: responsive down to mobile (single column on small screens)
- Document preview: fixed A4 proportions, zoom controls for mobile viewing
- Print-optimized CSS for actual PDF generation

**Accessibility**:
- High contrast text (WCAG AA minimum)
- Form labels properly associated
- Keyboard navigation for all interactive elements
- Screen reader friendly document structure