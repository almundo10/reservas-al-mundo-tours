# AL Mundo Tours - Reservation Document Generator

## Overview

This is a web application for AL Mundo Tours, a Colombian travel agency, designed to generate professional reservation documents for travel packages. The system allows staff to create detailed itineraries including passenger information, destinations, hotels, flights, tours, and transfers, then export them as formatted PDF documents.

The application features a multi-step form interface for data entry and generates polished, branded PDF documents suitable for client delivery. It supports complex travel itineraries with multiple destinations, flights, accommodations, and activities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript, using Vite as the build tool and development server.

**UI Component System**: Built with shadcn/ui components (Radix UI primitives) and styled with Tailwind CSS. The design follows a hybrid approach - dark mode utility interface for data entry, light professional styling for PDF output.

**Form Management**: Multi-step wizard pattern with React Hook Form and Zod validation. The form is broken into logical sections (Basic Info, Passengers, Destinations, Flights, Final Details) to simplify complex reservation data entry.

**State Management**: Component-level state with React hooks. Form data is managed locally until submission, then passed to the PDF generation system.

**Routing**: Wouter for lightweight client-side routing. Simple two-page structure (Home and 404).

**Design System**: 
- Primary brand colors: AL Mundo Tours blue (#0a6aa1) and accent gold (#f0a500)
- Typography: Poppins font family from Google Fonts
- Dark mode interface with utility-focused design
- Professional light-themed PDF output

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

**PDF Generation**: jsPDF library for client-side PDF creation. Generates multi-page documents with images, tables, and custom styling to match AL Mundo Tours branding.

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