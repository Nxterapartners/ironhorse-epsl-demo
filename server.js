const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static('public'));

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ANALYZE PROJECT PROMPT
app.post('/api/analyze', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'No prompt provided' });

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `You are EPSL AI, an industrial construction execution platform by Iron Horse Group. 
Analyze this industrial construction project and return ONLY valid JSON (no markdown, no explanation):

Project: "${prompt}"

Return this exact JSON structure:
{
  "projectName": "short project name",
  "location": "city, state",
  "sqft": "number like 200000",
  "projectType": "one of: Data Center, Distribution Center, Manufacturing Facility, Industrial Campus",
  "criticalLoad": "power in MW if applicable, else null",
  "totalCost": "estimated hard cost in format like $48.2M",
  "traditionalCost": "benchmark cost ~18% higher in format like $56.9M", 
  "savings": "dollar savings in format like $8.7M",
  "savingsPct": "percentage like 15.3%",
  "duration": "schedule in months like 18",
  "traditionalDuration": "traditional duration like 22",
  "peakWorkers": "number like 640",
  "sheets": 14,
  "bomItems": "number like 247",
  "conflicts": "number of AI-detected conflicts like 7",
  "summary": "2 sentence summary of what EPSL AI generated and key insights",
  "aiFlags": [
    {"type": "conflict", "title": "CONFLICT DETECTED", "body": "specific technical conflict found", "impact": "estimated cost/time impact"},
    {"type": "conflict", "title": "CODE CONFLICT", "body": "specific code compliance issue", "impact": "action required"},
    {"type": "warning", "title": "COORDINATION NOTE", "body": "coordination issue", "impact": "severity note"},
    {"type": "insight", "title": "STRUCTURAL INSIGHT", "body": "optimization opportunity", "impact": "estimated savings"},
    {"type": "savings", "title": "PROCUREMENT MATCH", "body": "procurement opportunity", "impact": "savings amount"},
    {"type": "insight", "title": "SCHEDULE INSIGHT", "body": "long-lead item alert", "impact": "risk description"}
  ],
  "procurement": [
    {"category": "STRUCTURAL / CIVIL", "items": [
      {"name": "Structural Steel Package", "spec": "50 KSI Wide Flange", "qty": "X TON", "unitPrice": "$X,XXX", "extended": "$X.XXM", "benchmark": "$X,XXX/T", "savings": "+$XXXK", "status": "quoted"},
      {"name": "Concrete — Foundations & Slab", "spec": "4,000 PSI Ready-Mix", "qty": "XX,000 CY", "unitPrice": "$XXX", "extended": "$X.XXM", "benchmark": "$XXX/CY", "savings": "+$XXXK", "status": "quoted"},
      {"name": "Rebar — All Foundations", "spec": "#4-#8 ASTM A615", "qty": "X,XXX TON", "unitPrice": "$X,XXX", "extended": "$X.XXM", "benchmark": "$X,XXX/T", "savings": "+$XXXK", "status": "awarded"}
    ]},
    {"category": "ELECTRICAL / POWER", "items": [
      {"name": "Main Switchgear", "spec": "Primary voltage, dual-bus", "qty": "X UNITS", "unitPrice": "$XXX,XXX", "extended": "$X.XXM", "benchmark": "$XXX,XXX/ea", "savings": "+$XXXK", "status": "pending"},
      {"name": "Emergency Generators", "spec": "Per project spec", "qty": "X UNITS", "unitPrice": "$XXX,XXX", "extended": "$X.XXM", "benchmark": "$XXX,XXX/ea", "savings": "+$XXXK", "status": "quoted"}
    ]},
    {"category": "MECHANICAL / ENVELOPE", "items": [
      {"name": "Mechanical Equipment", "spec": "Per project spec", "qty": "X UNITS", "unitPrice": "$XX,XXX", "extended": "$X.XXM", "benchmark": "$XX,XXX/ea", "savings": "+$XXXK", "status": "quoted"},
      {"name": "Building Envelope", "spec": "Insulated metal panels", "qty": "XX,XXX SF", "unitPrice": "$XX", "extended": "$X.XXM", "benchmark": "$XX/SF", "savings": "+$XXXK", "status": "pending"}
    ]}
  ]
}`
      }]
    });

    const text = message.content[0].text.trim();
    const json = JSON.parse(text);
    res.json({ success: true, data: json });
  } catch (err) {
    console.error('Analyze error:', err.message);
    res.status(500).json({ error: 'Analysis failed', details: err.message });
  }
});

// CHANGE ORDER
app.post('/api/changeorder', async (req, res) => {
  const { change, projectContext } = req.body;
  if (!change) return res.status(400).json({ error: 'No change provided' });

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 512,
      messages: [{
        role: 'user',
        content: `You are EPSL AI processing a change order for an industrial construction project.

Project context: ${projectContext || 'Large industrial data center'}
Change requested: "${change}"

Return ONLY valid JSON:
{
  "summary": "one sentence: Change applied: [what changed]",
  "drawingsUpdated": ["list of 3-4 sheet numbers updated like A-101, S-201"],
  "costDelta": "cost change like +$380K or -$120K",
  "scheduleDelta": "schedule impact like +6 days or 0-day impact",
  "procurementDelta": "key procurement changes in one sentence",
  "processingTime": "time like 0.4 seconds"
}`
      }]
    });

    const text = message.content[0].text.trim();
    const json = JSON.parse(text);
    res.json({ success: true, data: json });
  } catch (err) {
    console.error('Change order error:', err.message);
    res.status(500).json({ error: 'Change order failed', details: err.message });
  }
});

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', platform: 'EPSL AI — Iron Horse Group' }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`EPSL AI running on port ${PORT}`));
