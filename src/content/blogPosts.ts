export interface BlogPost {
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  publishedAt: string;
  readTime: string;
  tags: string[];
  coverImage: string;
  coverImageAlt: string;
  accentColor: string;
  sections: BlogSection[];
}

export type BlogSection =
  | { type: "text"; body: string[] }
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "code"; language: string; code: string }
  | { type: "callout"; variant: "tip" | "info" | "warning"; title?: string; body: string }
  | { type: "list"; ordered?: boolean; items: string[] };

export const blogPosts: BlogPost[] = [
  {
    slug: "figma-mcp-claude-design-system",
    title: "How I Connected Figma MCP to Claude and Automated My Design System Workflow",
    subtitle: "A practical walkthrough of how I got Figma talking to Claude, and what it actually changed about my day-to-day design system work.",
    excerpt:
      "Tokens drift. Figma specs go stale. Devs implement a 'close enough' version and nobody catches it until QA. I wired Figma MCP to Claude, and that problem mostly went away. Here's exactly how I did it.",
    publishedAt: "April 6, 2026",
    readTime: "8 min read",
    tags: ["AI", "Figma", "MCP", "Design Systems", "Automation"],
    coverImage: "/images/blog/figma-mcp-claude/cover.jpg",
    coverImageAlt: "Abstract design system components and code overlaid on a blue gradient",
    accentColor: "#1A7DD4",
    sections: [
      {
        type: "text",
        body: [
          "Design tokens drift. Devs copy-paste hex values instead of using named tokens. Figma specs and the actual product quietly stop matching. I set up Figma MCP with Claude and that loop mostly stopped. Here's the exact setup.",
        ],
      },
      {
        type: "heading",
        level: 2,
        text: "What is MCP? (30-second version)",
      },
      {
        type: "text",
        body: [
          "MCP is an open protocol that lets AI tools connect to external apps like Figma. Think USB-C for AI. We're using the open-source Framelink MCP server, which pulls data from the Figma API and strips it down to just the layout and style info the model actually needs.",
        ],
      },
      {
        type: "image",
        src: "/images/blog/figma-mcp-claude/mcp-diagram.jpg",
        alt: "Abstract visualization of AI model connected to external tools and data sources via a protocol layer",
        caption: "MCP connects Claude to Figma directly. No custom integration needed.",
      },
      {
        type: "heading",
        level: 2,
        text: "Prerequisites",
      },
      {
        type: "list",
        items: [
          "Node.js 18+ installed (run `node -v` to check)",
          "A Figma account with at least one design file",
          "Claude Desktop app — or Cursor, VS Code, or any MCP-compatible client",
          "~10 minutes",
        ],
      },
      {
        type: "heading",
        level: 2,
        text: "Step 1 — Generate a Figma Personal Access Token",
      },
      {
        type: "text",
        body: [
          "You need a Figma token so the MCP server can read your files.",
        ],
      },
      {
        type: "list",
        ordered: true,
        items: [
          "In Figma, click your profile avatar (top-left) → **Settings**",
          "Go to the **Security** tab",
          "Scroll to **Personal access tokens** → click **Generate new token**",
          "Name it anything (e.g. `claude-mcp`) and give it **Read** access on both **File content** and **Dev resources**",
          "Copy the token — you won't see it again",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "Keep it secret",
        body: "Treat this token like a password. Don't commit it to Git. We'll inject it via a config file that stays on your machine.",
      },
      {
        type: "heading",
        level: 2,
        text: "Step 2 — Configure the MCP Server",
      },
      {
        type: "text",
        body: [
          "Add the Figma server block to your MCP config file. Swap `YOUR-KEY` for your token.",
        ],
      },
      {
        type: "heading",
        level: 3,
        text: "Claude Desktop (macOS / Linux)",
      },
      {
        type: "text",
        body: [
          "Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:",
        ],
      },
      {
        type: "code",
        language: "json",
        code: `{
  "mcpServers": {
    "Framelink Figma MCP": {
      "command": "npx",
      "args": ["-y", "figma-developer-mcp", "--figma-api-key=YOUR-KEY", "--stdio"]
    }
  }
}`,
      },
      {
        type: "heading",
        level: 3,
        text: "Claude Desktop (Windows)",
      },
      {
        type: "text",
        body: [
          "Edit `%APPDATA%\\Claude\\claude_desktop_config.json`:",
        ],
      },
      {
        type: "code",
        language: "json",
        code: `{
  "mcpServers": {
    "Framelink Figma MCP": {
      "command": "cmd",
      "args": ["/c", "npx", "-y", "figma-developer-mcp", "--figma-api-key=YOUR-KEY", "--stdio"]
    }
  }
}`,
      },
      {
        type: "heading",
        level: 3,
        text: "Cursor",
      },
      {
        type: "text",
        body: [
          "Open Cursor Settings, go to MCP, paste the same config block, save, and restart.",
        ],
      },
      {
        type: "callout",
        variant: "tip",
        title: "Verify the connection",
        body: "After restarting your client, look for a green MCP indicator or open a new chat and type \"List available MCP tools\". You should see `get_figma_data` in the list.",
      },
      {
        type: "heading",
        level: 2,
        text: "Step 3 — Copy a Link to Your Figma Frame",
      },
      {
        type: "text",
        body: [
          "Work one frame or section at a time, not a whole page. Right-click the frame, go to Copy/Paste as, and choose Copy link to selection.",
        ],
      },
      {
        type: "image",
        src: "/images/blog/figma-mcp-claude/figma-copy-link.png",
        alt: "Figma right-click context menu showing the Copy link to selection option",
        caption: "Right-click a frame, Copy/Paste as, then Copy link to selection.",
      },
      {
        type: "heading",
        level: 2,
        text: "Step 4 — Paste the Link into Claude",
      },
      {
        type: "text",
        body: [
          "Open Claude, start a new chat, paste the link, and tell it what to do:",
        ],
      },
      {
        type: "code",
        language: "text",
        code: `Implement this Figma frame as a React component using Tailwind CSS:
https://www.figma.com/design/YOUR-FILE-ID/...?node-id=123:456`,
      },
      {
        type: "text",
        body: [
          "Claude calls `get_figma_data`, gets back the layout and style data, and writes the code. Simple as that.",
        ],
      },
      {
        type: "image",
        src: "/images/blog/figma-mcp-claude/ide-paste-link.png",
        alt: "Claude chat interface showing a Figma link pasted with an implementation request",
        caption: "Paste the link with your instruction. Claude calls get_figma_data on its own.",
      },
      {
        type: "heading",
        level: 2,
        text: "Step 5 — Extract Design Tokens",
      },
      {
        type: "text",
        body: [
          "Skip the UI generation. Ask Claude to pull your token definitions directly from the file:",
        ],
      },
      {
        type: "code",
        language: "text",
        code: `Read this Figma file and extract all color styles, text styles, and spacing values as a 
design token JSON that follows the W3C Design Token spec. Group by category: color, 
typography, spacing, border-radius, shadow.

https://www.figma.com/design/YOUR-FILE-ID/Design-System?node-id=0:1`,
      },
      {
        type: "text",
        body: [
          "Tested on a system with ~80 components. Clean JSON in under 30 seconds:",
        ],
      },
      {
        type: "code",
        language: "json",
        code: `{
  "color": {
    "brand": {
      "primary": { "$value": "#1A7DD4", "$type": "color" },
      "primary-dark": { "$value": "#0C3A5E", "$type": "color" },
      "surface": { "$value": "#EAF2FB", "$type": "color" }
    },
    "semantic": {
      "success": { "$value": "#1A6B35", "$type": "color" },
      "warning": { "$value": "#E8A020", "$type": "color" },
      "danger": { "$value": "#D94F4F", "$type": "color" }
    }
  },
  "typography": {
    "heading-xl": {
      "$value": {
        "fontFamily": "Instrument Serif",
        "fontSize": "64px",
        "fontWeight": 700,
        "lineHeight": 1.1
      },
      "$type": "typography"
    },
    "body-base": {
      "$value": {
        "fontFamily": "Poppins",
        "fontSize": "16px",
        "fontWeight": 400,
        "lineHeight": 1.6
      },
      "$type": "typography"
    }
  },
  "spacing": {
    "xs": { "$value": "4px", "$type": "dimension" },
    "sm": { "$value": "8px", "$type": "dimension" },
    "md": { "$value": "16px", "$type": "dimension" },
    "lg": { "$value": "24px", "$type": "dimension" },
    "xl": { "$value": "40px", "$type": "dimension" },
    "2xl": { "$value": "64px", "$type": "dimension" }
  }
}`,
      },
      {
        type: "text",
        body: [
          "Pipe that straight into Style Dictionary, your Tailwind config, or CSS custom properties. Half a day of work, one prompt.",
        ],
      },
      {
        type: "heading",
        level: 2,
        text: "Step 6 — Auto-Generate Component Documentation",
      },
      {
        type: "text",
        body: [
          "Point Claude at a component set and ask it to write the docs. Really useful for onboarding.",
        ],
      },
      {
        type: "code",
        language: "text",
        code: `Look at this Figma component set and write markdown documentation for it. Include:
- Component name and description
- Props table (name, type, default, required, description)
- All variant combinations with brief usage note
- Accessibility notes (keyboard nav, ARIA roles, contrast requirements)
- Do/Don't examples as a two-column list

Figma link: https://www.figma.com/design/YOUR-FILE-ID/...?node-id=456:789`,
      },
      {
        type: "text",
        body: [
          "Review the output before shipping. Prop types need checking. But 80% done in seconds beats a blank page.",
        ],
      },
      {
        type: "heading",
        level: 2,
        text: "The Result",
      },
      {
        type: "text",
        body: [
          "Reading specs, translating values, writing the markup. That used to take 2-3 hours. Now it takes however long Claude needs to respond.",
        ],
      },
      {
        type: "image",
        src: "/images/blog/figma-mcp-claude/chrome-final-product.png",
        alt: "Browser showing the final implemented UI component matching the Figma design exactly",
        caption: "One prompt from a Figma frame to a working component. Spacing, typography, and colors all carried over.",
      },
      {
        type: "heading",
        level: 2,
        text: "The Reverse Workflow: Claude → Figma",
      },
      {
        type: "text",
        body: [
          "Got code but no Figma file? Works in reverse too. Paste your component and ask:",
        ],
      },
      {
        type: "code",
        language: "text",
        code: `Here's my existing Button component. Draft a Figma component spec for it as a 
detailed written brief: frame names, auto-layout settings, color style names, 
variant property names and values, all prop-to-variant mappings. The goal is 
for a designer to use this brief to build the Figma equivalent.`,
      },
      {
        type: "text",
        body: [
          "Not as seamless as Figma-first, but a great shortcut for legacy codebases. Bonus: Claude usually catches naming inconsistencies nobody noticed.",
        ],
      },
      {
        type: "heading",
        level: 2,
        text: "What This Doesn't Solve",
      },
      {
        type: "text",
        body: [
          "This doesn't fix everything. A few things still need you:",
        ],
      },
      {
        type: "list",
        items: [
          "**Interactive states** like hover, focus, and drag aren't fully captured in static frames, so you'll need to fill those in yourself",
          "**Motion specs** — Figma's prototype data isn't exposed by the MCP server yet",
          "**Large files** work much better section by section. Trying to process 200 frames at once will get you degraded results",
          "**Design intent** is invisible to Claude. It can read what's there, not why. Write decisions into your Figma frame descriptions so they show up as context",
        ],
      },
      {
        type: "heading",
        level: 2,
        text: "Quick Summary",
      },
      {
        type: "callout",
        variant: "info",
        title: "Quick setup checklist",
        body: "1. Generate a Figma Personal Access Token with File content + Dev resources read access.\n2. Add the Framelink MCP server config JSON to your Claude Desktop or Cursor config file.\n3. Restart your AI client — verify `get_figma_data` appears in available tools.\n4. Copy a Figma frame link → paste into Claude with your request.\n5. Start with token extraction before moving to code generation — it's the highest-ROI workflow.",
      },
      {
        type: "text",
        body: [
          "MCP won't fix how people communicate. But it does remove the manual translation step where most of the drift was coming from.",
          "If you try this and find something that works better, I'd like to know.",
        ],
      },
    ],
  },
  {
    slug: "ai-ux-research-to-prd",
    title: "How I Turn User Interview Transcripts into a PRD Using AI",
    subtitle: "A practical workflow for going from raw research to a structured product requirements doc, without losing your design judgment along the way.",
    excerpt:
      "User research synthesis used to eat 3-4 days per round. Raw transcripts, sticky note sessions, affinity mapping, then writing everything up. I now do it in a few hours using Claude. Here's the workflow.",
    publishedAt: "April 6, 2026",
    readTime: "6 min read",
    tags: ["AI", "UX Research", "Product Design", "PRD", "Workflow"],
    coverImage: "/images/blog/ai-ux-research-to-prd/cover.jpg",
    coverImageAlt: "Product team gathered around a table during a user research synthesis session",
    accentColor: "#1A7DD4",
    sections: [
      {
        type: "text",
        body: [
          "User research synthesis is slow. You do 8 interviews, get 8 transcripts, spend two days on sticky notes, and another day writing it all into something a PM can read. Most of that time isn't thinking. It's just reading and moving text around. Claude handles that part now.",
        ],
      },
      {
        type: "heading",
        level: 2,
        text: "What You Need",
      },
      {
        type: "list",
        items: [
          "Interview transcripts (Otter.ai, Rev, or just manual notes work fine)",
          "Claude Pro (the context window matters for long transcripts)",
          "Somewhere to write the final PRD: Notion, Google Docs, whatever you use",
        ],
      },
      {
        type: "heading",
        level: 2,
        text: "Step 1 — Get Your Transcripts Clean Enough",
      },
      {
        type: "text",
        body: [
          "You don't need perfect transcripts. Auto-generated ones from Otter or Fireflies work. Just do a quick pass to fix names and remove filler words. 10 minutes per transcript is enough.",
        ],
      },
      {
        type: "image",
        src: "/images/blog/ai-ux-research-to-prd/sticky-notes.jpg",
        alt: "Sticky notes and research notes spread across a table during a synthesis session",
        caption: "The old way. This is what we're replacing.",
      },
      {
        type: "heading",
        level: 2,
        text: "Step 2 — Pull Themes Out of the Transcripts",
      },
      {
        type: "text",
        body: [
          "Paste one transcript at a time and ask Claude to extract the signal:",
        ],
      },
      {
        type: "code",
        language: "text",
        code: `Here is a user interview transcript. Extract:
- The top 3-5 pain points the user mentioned
- Any workarounds they described
- Direct quotes that capture frustration or confusion
- Features or changes they asked for explicitly

Keep each point to one sentence. Flag anything that seemed emotionally charged.

[paste transcript here]`,
      },
      {
        type: "text",
        body: [
          "Run this for every transcript. Save the outputs in one doc. This takes about 2 minutes per interview instead of 20.",
        ],
      },
      {
        type: "heading",
        level: 2,
        text: "Step 3 — Find Patterns Across All Interviews",
      },
      {
        type: "text",
        body: [
          "Once you have all the extracted points, paste them together and ask Claude to find the common threads:",
        ],
      },
      {
        type: "code",
        language: "text",
        code: `Below are pain points and quotes from 8 user interviews about [product/feature].

Group them into recurring themes. For each theme:
- Give it a short name
- Write one sentence describing the problem
- List which users mentioned it (by number if names aren't included)
- Pull the strongest quote that represents the theme

[paste all extracted points here]`,
      },
      {
        type: "text",
        body: [
          "This is the step that used to take an entire afternoon with sticky notes. Now it takes 3 minutes.",
        ],
      },
      {
        type: "heading",
        level: 2,
        text: "Step 4 — Turn Themes into User Needs",
      },
      {
        type: "text",
        body: [
          "Themes tell you what people complained about. User needs tell you what they actually require. Ask Claude to reframe:",
        ],
      },
      {
        type: "code",
        language: "text",
        code: `Here are the research themes from our interviews:

[paste themes]

Rewrite each one as a job-to-be-done statement:
"When [situation], I want to [motivation], so I can [outcome]."

Then rate each need as High / Medium / Low based on how many users mentioned it and how emotional their language was.`,
      },
      {
        type: "heading",
        level: 2,
        text: "Step 5 — Draft the PRD Structure",
      },
      {
        type: "text",
        body: [
          "Now give Claude everything it needs to write a first draft:",
        ],
      },
      {
        type: "code",
        language: "text",
        code: `You're a senior product designer. Based on the user needs below, write a PRD outline with these sections:

1. Problem statement (2-3 sentences)
2. User needs (from the research, formatted as a table: Need / Priority / Evidence)
3. Success metrics (3-4 measurable outcomes)
4. Scope: what's in, what's out
5. Open questions that need stakeholder input

User needs:
[paste the JTBD statements from Step 4]

Keep it concise. This is a working draft, not a final doc.`,
      },
      {
        type: "image",
        src: "/images/blog/ai-ux-research-to-prd/prd-doc.jpg",
        alt: "Clean product requirements document open on a laptop",
        caption: "A structured PRD draft, ready for your input and stakeholder review.",
      },
      {
        type: "heading",
        level: 2,
        text: "Step 6 — You Fill In the Judgment Calls",
      },
      {
        type: "text",
        body: [
          "This is the step Claude cannot do for you. Go through the draft and add:",
        ],
      },
      {
        type: "list",
        items: [
          "Business context and constraints Claude doesn't know about",
          "Priority decisions based on your team's current goals",
          "Technical feasibility notes from conversations with your dev team",
          "Anything politically sensitive that shouldn't live in a shared doc as-is",
        ],
      },
      {
        type: "callout",
        variant: "info",
        title: "This is the part that makes you the designer",
        body: "The AI gives you a solid skeleton. Your judgment, context, and experience is what turns it into something your team can actually build from. Don't skip this step.",
      },
      {
        type: "heading",
        level: 2,
        text: "What This Actually Saves",
      },
      {
        type: "text",
        body: [
          "Before this workflow, a full research-to-PRD cycle took me 3 to 4 days. Extract themes from transcripts, run an affinity mapping session, write up insights, draft the requirements doc, review and clean it up. All manual.",
          "Now steps 2 through 5 take about 2 hours. Step 6 takes another hour. The research and interviews still happen in person. The thinking still happens with my brain. The text-moving part is gone.",
        ],
      },
      {
        type: "heading",
        level: 2,
        text: "What AI Gets Wrong",
      },
      {
        type: "list",
        items: [
          "It misses tone. A user saying something reluctantly reads differently than saying it confidently. Claude can't feel that",
          "It over-surfaces explicit requests. Users saying 'I want X' gets weighted higher than body language or workarounds, which often reveal more",
          "It doesn't know your product history. Claude has no idea what you already tried and why it failed",
        ],
      },
      {
        type: "callout",
        variant: "tip",
        title: "One thing that helps a lot",
        body: "Add context at the top of every prompt. Tell Claude what product you're working on, who the users are, and what problem you're trying to solve. The output quality jumps noticeably.",
      },
      {
        type: "heading",
        level: 2,
        text: "Quick Summary",
      },
      {
        type: "list",
        ordered: true,
        items: [
          "Get transcripts cleaned up (10 min each)",
          "Extract pain points and quotes per transcript (2 min each with Claude)",
          "Group into themes across all interviews (3 min)",
          "Reframe themes as job-to-be-done user needs",
          "Ask Claude to draft the PRD structure from those needs",
          "Add your judgment, business context, and priorities to the draft",
        ],
      },
      {
        type: "text",
        body: [
          "The research still needs a real human in the room. But everything after the interviews can be cut from days to hours.",
        ],
      },
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
