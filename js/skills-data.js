/* ============================================================
   SKILLS DATA — single source of truth for the Skills section.
   Every tile, filter, and category box derives from this array.
   Add/remove a skill only here.

   icon: "devicon:<name>-<variant>"  → full-color official logo (devicon CDN)
         "simple:<slug>"             → monochrome brand mark (simple-icons CDN),
                                        recolored via `color` to the real brand hex
         "custom:<id>"               → hand-kept SVG/image (see skills.js)
   color: hex (no #) applied to `simple:` icons. Omit only for brands whose
          official mark is genuinely monochrome black/white (GitHub Copilot,
          Cursor, Ollama, Vercel, Apple) — recoloring those would misrepresent
          the real logo.
   ============================================================ */

window.SKILLS_DATA = [

  /* ---------- Languages ---------- */
  { name: "HTML5",       category: "lang", icon: "devicon:html5-original",       core: true,  note: "Semantic structure" },
  { name: "CSS3",        category: "lang", icon: "devicon:css3-original",        core: true,  note: "Responsive design" },
  { name: "JavaScript",  category: "lang", icon: "devicon:javascript-original",  core: true,  note: "ES6+ Logic & Async" },
  { name: "TypeScript",  category: "lang", icon: "devicon:typescript-original",  core: true,  note: "Type-safe development" },
  { name: "Python",      category: "lang", icon: "devicon:python-original",      core: true,  note: "Scripting & AI automation" },
  { name: "C++",         category: "lang", icon: "devicon:cplusplus-original",   core: true,  note: "System programming" },
  { name: "PHP",         category: "lang", icon: "devicon:php-original",         core: true,  note: "Backend & Web APIs" },
  { name: "Java",        category: "lang", icon: "devicon:java-original",        core: true,  note: "Object-oriented apps" },
  { name: "C#",          category: "lang", icon: "devicon:csharp-original",      core: true,  note: ".NET & Desktop apps" },

  /* ---------- Web & Mobile ---------- */
  { name: "React Native",   category: "web", icon: "devicon:react-original",       core: true, note: "Cross-platform mobile" },
  { name: "Flutter",        category: "web", icon: "devicon:flutter-original",     core: true, note: "Cross-platform mobile" },
  { name: "Node.js",        category: "web", icon: "devicon:nodejs-original",      core: true, note: "Backend runtime" },
  { name: "Firebase",       category: "web", icon: "devicon:firebase-plain",       core: true, note: "Auth, DB & Hosting" },
  { name: "Supabase",       category: "web", icon: "devicon:supabase-original",    core: true, note: "PostgreSQL Backend" },
  { name: "Docker",         category: "web", icon: "devicon:docker-original",      core: true, note: "Containerized deployment" },
  { name: "Netlify",        category: "web", icon: "devicon:netlify-original",     core: true, note: "CI/CD & Web hosting" },
  { name: "Vercel",         category: "web", icon: "simple:vercel",                core: true, note: "Next.js & Frontend hosting" },
  { name: "WordPress",      category: "web", icon: "devicon:wordpress-plain",      core: true, note: "CMS & E-commerce" },
  { name: "Android Studio", category: "web", icon: "devicon:androidstudio-original", core: true, note: "IDE & Android SDK" },
  { name: "Android",        category: "web", icon: "devicon:android-original",     core: true, note: "Native App Development" },
  { name: "Apple / iOS",    category: "web", icon: "simple:apple",                 core: true, note: "iOS App Ecosystem" },

  /* ---------- AI & Automation ---------- */
  { name: "ChatGPT",         category: "ai", icon: "simple:openai",        color: "10A37F", core: true, note: "AI-assisted development" },
  { name: "Claude AI",       category: "ai", icon: "simple:anthropic",     color: "D97757", core: true, note: "Advanced LLM coding" },
  { name: "Gemini",          category: "ai", icon: "simple:googlegemini", color: "4796E3", core: true, note: "Multimodal AI solutions" },
  { name: "GitHub Copilot",  category: "ai", icon: "simple:githubcopilot", core: true, note: "AI pair programming" },
  { name: "Cursor AI",       category: "ai", icon: "simple:cursor",        core: true, note: "AI code editor" },
  { name: "Ollama",          category: "ai", icon: "simple:ollama",        core: true, note: "Local LLM execution" },
  { name: "n8n",             category: "ai", icon: "simple:n8n",           color: "EA4B71", core: true, note: "Workflow automation" },
  { name: "Hugging Face",    category: "ai", icon: "simple:huggingface",   color: "FFD21E", core: true, note: "AI models & Datasets" },
  { name: "Perplexity",      category: "ai", icon: "simple:perplexity",    color: "20808D", core: true, note: "AI research & Search" },
  { name: "Replit AI",       category: "ai", icon: "simple:replit",        color: "F26207", core: true, note: "Cloud coding agent" },
  { name: "DeepSeek",        category: "ai", icon: "simple:deepseek",      color: "4D6BFE", core: true, note: "Reasoning AI model" },
  { name: "LangChain",       category: "ai", icon: "simple:langchain",     color: "1C8C74", core: true, note: "LLM Orchestration" },
  { name: "FastAPI",         category: "ai", icon: "simple:fastapi",       color: "009688", core: true, note: "High-performance Python APIs" },
  { name: "Streamlit",       category: "ai", icon: "simple:streamlit",     color: "FF4B4B", core: true, note: "Data & AI web apps" },
  { name: "Lovable",         category: "ai", icon: "custom:lovable",       core: true, note: "AI web generator" },

  /* ---------- Design ---------- */
  { name: "Figma",       category: "design", icon: "custom:figma",       core: true, note: "UI/UX design" },
  { name: "Canva",       category: "design", icon: "custom:canva",       core: true, note: "Rapid visual design" },
  { name: "Illustrator", category: "design", icon: "custom:illustrator", core: true, note: "Vector graphics & Logos" },
  { name: "Photoshop",   category: "design", icon: "custom:photoshop",   core: true, note: "Image editing & Assets" },

  /* ---------- Video ---------- */
  { name: "CapCut",       category: "video", icon: "custom:capcut", core: true, note: "Short-form video editing" },
  { name: "Premiere Pro", category: "video", icon: "custom:premiere", core: true, note: "Professional video editing" },
  { name: "YouTube",      category: "video", icon: "custom:youtube",  core: true, note: "Video publishing & Content" },
  { name: "TikTok",       category: "video", icon: "custom:tiktok",   core: true, note: "Short-form video content" },

  /* ---------- SEO ---------- */
  { name: "Search Console",  category: "seo", icon: "simple:googlesearchconsole", color: "4285F4", core: true, note: "Google Search Indexing" },
  { name: "Analytics 4",     category: "seo", icon: "simple:googleanalytics",     color: "E37400", core: true, note: "Traffic & User tracking" },
  { name: "PageSpeed",       category: "seo", icon: "simple:pagespeedinsights",   color: "4285F4", core: true, note: "Core Web Vitals" },
  { name: "Lighthouse",      category: "seo", icon: "simple:lighthouse",          color: "F44B21", core: true, note: "Audit & Performance" },
  { name: "Semrush",         category: "seo", icon: "simple:semrush",             color: "FF642D", core: true, note: "SEO & Keyword research" },

];

window.SKILL_CATEGORIES = [
  { id: "all",    label: "All" },
  { id: "web",    label: "Web & Mobile" },
  { id: "lang",   label: "Languages" },
  { id: "ai",     label: "AI & Automation" },
  { id: "design", label: "Design" },
  { id: "video",  label: "Video" },
  { id: "seo",    label: "SEO" },
];
