# Website update guide

The website has no build step and no database. Most future updates require editing one of two plain-text files:

- `content/news.js` — announcements and chronological updates.
- `content/cv.js` — permanent records shown in the main CV sections.

## Which file should I edit?

| New item | Add to |
| --- | --- |
| Paper accepted or published | `news.js`, and `cv.js` → `publications` |
| Award, scholarship, grant, or research credit | `news.js`, and `cv.js` → `awards` |
| Conference or journal review | `news.js`, and `cv.js` → `service` |
| New job, internship, or research role | `news.js`, and `cv.js` → `experience` |
| New project | `cv.js` → `projects`; optionally announce it in `news.js` |
| Workshop, mentoring, teaching, or volunteering | `news.js`, and `cv.js` → `service` |
| Degree or certificate | `cv.js` → `education`; optionally announce it in `news.js` |
| New technology or tool | `cv.js` → `skillGroups` |
| Any other achievement | `news.js` with any short category name |

For an important event, adding one announcement and one permanent record is intentional: News records when it happened; the relevant CV section keeps it easy to find later.

## Add a news item

Open `content/news.js`, copy an existing object, and paste it at the top of `window.PORTFOLIO_NEWS`.

Only `date` and `title` are required:

```js
{
  date: "2026-08",
  category: "Publication",
  title: "Paper accepted at Example Conference",
  description: "Optional background retained for future use.",
  links: [{ label: "Paper", url: "https://example.com/paper" }]
},
```

- Use `YYYY-MM` or `YYYY-MM-DD`; the visible date is created automatically.
- Category can be `Publication`, `Award`, `Review`, `Service`, `Career`, `Research`, `Teaching`, `Milestone`, or any other short label.
- The first valid link makes the headline clickable.
- Use plain text, not HTML.

## Add a publication

Paste a new object into `publications` in `content/cv.js`:

```js
{
  year: "2027",
  title: "Paper title",
  authors: "M. Rakib, A. Collaborator, and B. Collaborator",
  venue: "Conference or Journal 2027",
  url: "https://example.com/paper"
},
```

If the paper does not have a public page yet, omit `url` and add it later.

## Add a project

Paste a new object into `projects`:

```js
{
  title: "Project name",
  context: "Conference 2027",
  subtitle: "Optional longer project title",
  summary: "One concise paragraph explaining the contribution and result.",
  metrics: [
    { value: "12%", label: "accuracy improvement" }
  ],
  links: [
    { label: "Project", url: "https://github.com/example/project" },
    { label: "Paper", url: "https://example.com/paper" }
  ],
  featured: true
},
```

Use `featured: true` for the visible selected-project list. Use `featured: false` for the collapsible archive. If you omit `featured`, the project appears in the selected list. `context`, `subtitle`, `metrics`, and `links` are optional.

## Add experience

Paste a new object into `experience`:

```js
{
  sortDate: "2027-05",
  date: "May 2027 — Aug 2027",
  location: "City, State",
  organization: "Organization",
  role: "Role title",
  logo: "images/organization-logo.png",
  bullets: [
    "First outcome-focused responsibility.",
    "Second outcome-focused responsibility."
  ],
  tags: ["Python", "PyTorch"]
},
```

`location`, `logo`, `bullets`, and `tags` are optional. Entries sort by `sortDate`.

## Add education

Paste a new object into `education`:

```js
{
  sortDate: "2027",
  date: "2027",
  degree: "Certificate or degree",
  school: "Institution",
  location: "City, State",
  gpa: "3.90",
  honor: "Optional honor",
  details: "Optional coursework or concentration",
  logo: "images/institution-logo.png"
},
```

`location`, `gpa`, `honor`, `details`, and `logo` are optional, which also makes this format suitable for certificates.

## Add an award

Paste a new object into `awards`:

```js
{
  year: "2027",
  title: "Award name",
  description: "Short description of the award.",
  url: "https://example.com/award"
},
```

`description` and `url` are optional. A year and award title are enough to create a valid entry.

## Add a review or other academic service

Paste a new object into `service`:

```js
{
  title: "Peer reviewer",
  description: "Reviewed for Example Conference 2027.",
  links: [{ label: "Conference", url: "https://example.com" }]
},
```

`description` and `links` are optional. This same section can hold peer reviews, committee work, workshops, mentoring, talks, and volunteering.

## Add or update skills

Either add an item to an existing `items` list or add a new group:

```js
{
  title: "New skill group",
  items: ["Tool one", "Tool two", "Tool three"]
},
```

## Check changes before publishing

Run the content validator:

```bash
node scripts/validate-content.mjs
```

Then preview the site:

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000`. The original HTML remains as a fallback, so an error in a content file will not erase the permanent sections from the page.
