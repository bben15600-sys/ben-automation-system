---
name: daily-brief
description: Daily market brief with stock updates. Trigger on market/stocks/brief queries.
---

# Daily Brief Agent

## Instructions
1. Search current prices for: VOO, QQQ, NVDA, TSLA
2. Calculate daily % change
3. Read Investments DB for portfolio allocation
4. Compare current % vs target % (VOO=70, QQQ=15, Growth=15)
5. Generate action recommendations (Buy/Hold/Review)
6. Create Daily Brief entry in Notion
7. Send summary in Hebrew

## Data Sources
- **Write**: Daily Brief DB (`collection://bfcfbfe8-e343-43d2-85a6-f12668150157`)
- **Read**: Investments DB (`collection://30c5ed27-8b02-439a-a510-de4601e22a30`)
- **Search**: Brave Search API
