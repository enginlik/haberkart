AI-powered news card generator for social media. Creates story, post, square and Twitter-ready visuals from news text using HTML templates, Puppeteer, OpenAI and Gemini. Supports multi-format export, palettes, branding, queue-based rendering and cloud storage.

# haberkart

AI-powered news card generator for social media publishers.  
Create story, post, square, Twitter/X and other social-ready visuals from news text, images and templates using HTML rendering, Puppeteer, OpenAI and Gemini.

## Overview

haberkart is a content production tool designed for news publishers, editors and digital media teams. It transforms a news text, optional headline/subtext, branding assets and template settings into ready-to-publish visual cards for multiple social media platforms.

The system can work with manually entered text or generate editorial headline/subtext suggestions with AI. It renders HTML templates into image outputs and stores the generated files locally or in S3-compatible object storage such as MinIO.

## Features

- AI-assisted headline and subtext generation with OpenAI and Google Gemini
- Multi-format image rendering for social media publishing
- HTML template-based rendering pipeline
- Multiple visual templates and color palettes
- Breaking news mode support
- Optional async job queue with BullMQ and Redis
- Local output storage or MinIO / S3-compatible object storage
- Branding support with logo, social handle and contact blocks
- Saved settings and generation history support

## Supported Formats

The project supports multiple export targets for social publishing, including:

- Post
- Story
- Square
- Twitter / X
- Facebook
- YouTube
- LinkedIn
- Pinterest

## How It Works

1. The user submits a news text, optional headline and subtext, image, logo and output format selection.
2. The system optionally generates headline/subtext suggestions with AI.
3. A selected HTML template is populated with content placeholders and style tokens.
4. Puppeteer renders the template in the target dimensions.
5. The final image is exported as a ready-to-publish visual.
6. Outputs are saved locally or uploaded to MinIO / S3-compatible storage.

## Core Stack

- Node.js
- Express-based backend architecture
- Puppeteer for HTML-to-image rendering
- OpenAI and Google Gemini for AI text generation
- BullMQ + Redis for background job processing
- MinIO / S3-compatible object storage
- HTML/CSS template system

## Template System

Templates are loaded from the filesystem and rendered dynamically.  
Each template receives content placeholders such as:

- `HEADLINE`
- `SUBTEXT`
- `DATE`
- `IMAGEURL`
- `LOGOHTML`
- `SOCIALHANDLE`
- `CONTACTHTML`

Templates can also support palette-specific style tokens and special visual modes such as breaking news overlays.

## Example Use Cases

- News websites generating fast social media visuals
- Local publishers creating branded story and post cards
- Editors producing platform-specific news visuals from one source text
- Automated newsroom workflows for headline-to-card generation

## Storage

Generated outputs can be:

- Stored locally for direct server access
- Uploaded to MinIO / S3-compatible object storage
- Returned as URLs for downstream publishing workflows

## Project Goal

The goal of haberkart is to reduce the time needed to turn raw news content into consistent, branded and platform-ready visual assets. It is built for editorial speed, repeatability and scalable content operations.

## Roadmap

Planned and evolving areas include:

- Improved worker-based rendering architecture
- Better browser pooling and performance optimization
- More advanced template manifest structure
- Easier template creation workflow
- SaaS-ready workspace and quota system
- Better observability, testing and job tracking

## License

MIT
