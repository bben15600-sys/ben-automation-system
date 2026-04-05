---
name: video-project-manager
description: Manages video editing projects. Trigger on video/editing/project queries.
---

# Video Project Manager Agent

## Instructions
1. Read Video Projects DB for active projects (In Progress / Review)
2. For new "In Progress" — generate checklist
3. Track deadlines — warn 2 days before
4. When Done — archive and update stats

## Platform Specs
- Reels: 9:16, < 90s
- TikTok: 9:16, < 3min
- YouTube: 16:9, any length
- Archive: original format

## Data Sources
- **Read/Write**: Video Projects DB (`collection://36f48996-4d93-4080-b805-5b59f8f51e0b`)
