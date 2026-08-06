# Mohammed Rakib — Academic Portfolio

Source for [mohammedrakib.github.io](https://mohammedrakib.github.io/), a lightweight academic portfolio built with plain HTML, CSS, and JavaScript. It runs directly on GitHub Pages—there is no framework, build step, or package installation.

## Maintaining the website

Start with the [website update guide](content/UPDATE_GUIDE.md). It includes copy-and-paste examples for news, publications, projects, experience, education, awards, academic service, and skills.

| What to update | File |
| --- | --- |
| News, acceptances, awards, reviews, talks, and other dated announcements | [`content/news.js`](content/news.js) |
| Experience, projects, publications, education, awards, service, and skills | [`content/cv.js`](content/cv.js) |
| Introduction, About text, section headings, and static fallback content | [`index.html`](index.html) |
| Typography, colors, spacing, and responsive layout | [`css/style.css`](css/style.css) |
| Content rendering, navigation, and interactions | [`js/main.js`](js/main.js) |
| Profile photos and organization logos | [`images/`](images/) |
| Job résumés and academic CVs | [`resume/`](resume/) |

For a news item, only `date` and `title` are required. Use `YYYY-MM` or `YYYY-MM-DD`; the site formats the date and sorts entries newest first. Category, display date, description, and links are optional.

Important milestones usually belong in two places: add a dated announcement to `content/news.js`, then add the permanent record to the relevant section in `content/cv.js`.

The normal site is rendered from the content files. `index.html` also contains a static no-JavaScript fallback; mirror permanent CV changes there only when you want that fallback to remain identical.

## Check changes locally

Validate the editable content first:

```bash
node scripts/validate-content.mjs
```

The validator checks data structure, required fields, dates, duplicate titles, URLs, and referenced local files.

Preview the full website from the repository root:

```bash
python3 -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000), review the desktop and mobile layouts, and press `Ctrl+C` to stop the server.

## Publish

After reviewing the changes:

```bash
git status
git diff --check
git add -A
git diff --cached --check
git commit -m "Update academic portfolio"
git push origin main
```

GitHub Pages publishes the site from this repository. After pushing, allow a few minutes for the live page to refresh.
