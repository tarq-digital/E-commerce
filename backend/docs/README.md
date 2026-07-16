# Weebster Backend API

The core backend infrastructure for the Weebster platform.

## Quick Start

1. `cp .env.example .env`
2. Configure `.env` variables (Database, JWT, Cloudinary).
3. `npm install`
4. `npm run dev`

## Architecture
- Framework: Express.js (Node.js)
- Database Layer: `mysql2` (Repository Pattern)
- Validation: Joi
- Logging: Winston

See `docs/development.md` for detailed instructions on the Request Lifecycle and adding new features.
