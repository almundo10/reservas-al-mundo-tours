# AL Mundo Tours - Reservation Document Generator

## Overview

This is a web application for AL Mundo Tours, a Colombian travel agency, designed to generate professional reservation documents for travel packages. The system allows staff to create detailed itineraries including passenger information, destinations, hotels, flights, tours, and transfers, then export them as formatted PDF documents.

The application features a multi-step form interface for data entry and generates polished, branded PDF documents suitable for client delivery. It supports complex travel itineraries with multiple destinations, flights, accommodations, and activities.

## Recent Changes (October 2025)

### Schema Updates
- **Hotel fields added**: `telefono`, `direccion`, `numeroReserva`
- **Tour fields added**: `operador` (tour operator name)
- **Reservation fields added**: `fechaPlazoPago` (payment deadline date)
- **Responsible person contact**: `telefonoResponsable`

### Form Enhancements
- Custom destination input with toggle between predefined list and manual entry
- Custom airline input with toggle between predefined list and manual entry
- Hotel section now includes: address, phone, reservation number fields
- Tour section now includes: operator name field
- Final details section now includes: payment deadline date field
- Basic info section includes: responsible person phone number

### PDF Improvements
- Company logo displayed in header (replaces text "AL Mundo Tours")
- Header background: corporate blue (#242553) with white text
- Hotel details show: address, phone, reservation number
- Tour details show: operator name
- Contact section shows: responsible person phone number
- Payment section shows: payment deadline date below balance
- Consecutive page numbering on all pages
- Minimum 9pt font size for improved readability
- Two-color scheme: Blue (#242553) and Orange (#F07E1A) only

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript, using Vite as the build tool and development server.

**UI Component System**: Built with shadcn/ui components (Radix UI primitives) and styled with Tailwind CSS. The design follows a hybrid approach - dark mode utility interface for data entry, light professional styling for PDF output.

**Form Management**: Multi-step wizard pattern with React Hook Form and Zod validation. The form is broken into logical sections (Basic Info, Passengers, Destinations, Flights, Final Details) to simplify complex reservation data entry. Features include:
- Custom destination input (checkbox toggles between predefined selector and free text)
- Custom airline input (checkbox toggles between predefined selector and free text)
- Hotel fields: check-in/out times, room count, nights, meal plans
- Responsible party contact: name, document, phone number

**State Management**: Component-level state with React hooks. Form data is managed locally until submission, then passed to the PDF generation system.

**Routing**: Wouter for lightweight client-side routing. Simple two-page structure (Home and 404).

**Design System**: 
- Corporate brand colors: Primary blue (#242553) and Orange (#F07E1A) only (purple and cyan removed per user request)
- Typography: Poppins font family from Google Fonts (interface and PDF)
- Dark mode interface with utility-focused design
- Professional light-themed PDF output with company logo in footer

### Backend Architecture

**Server Framework**: Express.js with TypeScript running on Node.js.

**Development Setup**: Custom Vite middleware integration for hot module replacement in development. Production serves static files from the build output.

**Storage Interface**: Abstracted storage layer with in-memory implementation (MemStorage). Designed for easy migration to database persistence.

**API Structure**: RESTful API pattern with `/api` prefix (currently minimal implementation, expandable for future features like saving reservations, user management, or template storage).

### Data Storage Solutions

**Current Implementation**: In-memory storage using JavaScript Maps for temporary data persistence during development.

**Database Schema**: Defined using Drizzle ORM with PostgreSQL dialect. Schema includes User model as foundation, ready for expansion to include Reservation, Destination, Flight, and other travel-related entities.

**Migration Strategy**: Drizzle Kit configured for schema migrations with support for future database provisioning.

**Future Considerations**: Schema is prepared for PostgreSQL but not yet connected. Storage interface allows seamless transition from in-memory to database persistence.

### External Dependencies

**PDF Generation**: jsPDF library for client-side PDF creation. Generates multi-page documents with images, tables, and custom styling to match AL Mundo Tours branding. Features include:
- Company logo in footer (left) on all pages
- Consecutive page numbering (right) on all pages  
- Clickable links for terms and conditions (displays "Términos y Condiciones" text)
- Minimum 9pt font size for all content (improved readability)
- Two-color scheme: Blue (#242553) and Orange (#F07E1A) only
- Hotel details include check-in/out times and room count
- Passenger contact includes responsible party phone number

**Form Validation**: Zod schema validation integrated with React Hook Form resolvers. Comprehensive schemas defined for Passenger, Flight, Tour, Transfer, Hotel, and Destination entities.

**UI Component Library**: 
- Radix UI primitives for accessible components (dialogs, popovers, selects, etc.)
- Tailwind CSS for utility-first styling
- Custom component variants using class-variance-authority

**Date Handling**: date-fns for date formatting and manipulation throughout the application.

**Database ORM**: Drizzle ORM with Neon serverless PostgreSQL adapter (configured but not yet connected).

**Development Tools**:
- Replit-specific plugins for development environment integration
- TypeScript for type safety across the stack
- ESBuild for production server bundling

**Asset Management**: Static image library system planned for destination photos, airline logos, vehicle types, and hotel images. Currently uses placeholder structure with mock data.

### Key Architectural Decisions

**Single-Page Application**: Chosen for smooth user experience during multi-step form completion without page reloads. Wouter provides minimal routing overhead.

**Client-Side PDF Generation**: PDF creation happens in the browser using jsPDF, eliminating need for server-side PDF rendering libraries and reducing server load. Allows instant preview and download.

**Schema-First Design**: Zod schemas serve as single source of truth for data validation, TypeScript types, and form validation rules. Ensures consistency across validation layers.

**Component Isolation**: Separate editor components (DestinationEditor, FlightEditor) for each major data entity, promoting reusability and maintainable code structure.

**Hybrid Storage Strategy**: Abstracted storage interface allows development with in-memory data while maintaining clean migration path to PostgreSQL when needed.

**Tailwind + Shadcn Pattern**: Combines utility-first CSS with pre-built accessible components, enabling rapid UI development while maintaining design consistency and accessibility standards.

**Development Experience**: Vite integration with Express provides fast HMR and optimal developer experience, while production build creates optimized static assets and bundled server code.