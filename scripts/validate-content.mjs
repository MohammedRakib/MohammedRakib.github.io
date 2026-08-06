#!/usr/bin/env node

import { access, readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("../", import.meta.url));
const errors = [];
const localReferences = [];

const sourcePath = (relativePath) => path.join(repoRoot, relativePath);
const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function readWithRetry(relativePath, attempts = 20, delayMilliseconds = 250) {
  const absolutePath = sourcePath(relativePath);

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await readFile(absolutePath, "utf8");
    } catch (error) {
      if (error?.code !== "ENOENT" || attempt === attempts) {
        throw error;
      }
      await delay(delayMilliseconds);
    }
  }

  throw new Error(`Unable to read ${relativePath}`);
}

async function loadBrowserData(relativePath) {
  let source;

  try {
    source = await readWithRetry(relativePath);
  } catch (error) {
    errors.push(`${relativePath}: could not be read (${error.message})`);
    return Object.create(null);
  }

  const browserWindow = Object.create(null);
  const context = vm.createContext({ window: browserWindow });

  try {
    vm.runInContext(source, context, {
      filename: relativePath,
      timeout: 1_000
    });
  } catch (error) {
    errors.push(`${relativePath}: could not be evaluated (${error.message})`);
  }

  return browserWindow;
}

function addError(location, message) {
  errors.push(`${location}: ${message}`);
}

function isRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function requireRecord(value, location) {
  if (!isRecord(value)) {
    addError(location, "must be an object");
    return false;
  }
  return true;
}

function requireArray(value, location) {
  if (!Array.isArray(value)) {
    addError(location, "must be an array");
    return [];
  }
  return value;
}

function requireString(value, location, { allowEmpty = false } = {}) {
  if (typeof value !== "string") {
    addError(location, "must be a string");
    return false;
  }
  if (!allowEmpty && value.trim() === "") {
    addError(location, "must not be empty");
    return false;
  }
  return true;
}

function optionalString(value, location, options) {
  if (value === undefined) return true;
  return requireString(value, location, options);
}

function validateStringArray(value, location, { allowEmpty = true } = {}) {
  const items = requireArray(value, location);
  if (!allowEmpty && items.length === 0) {
    addError(location, "must contain at least one item");
  }
  items.forEach((item, index) => requireString(item, `${location}[${index}]`));
  return items;
}

function validateYear(value, location) {
  const text = typeof value === "number" ? String(value) : value;
  if (typeof text !== "string" || !/^\d{4}$/.test(text)) {
    addError(location, "must be a four-digit year (YYYY)");
    return;
  }

  const year = Number(text);
  if (year < 1900 || year > 2100) {
    addError(location, "must be between 1900 and 2100");
  }
}

function validateIsoDate(value, location, allowedPrecisions) {
  if (typeof value !== "string") {
    addError(location, "must be an ISO date string");
    return;
  }

  const match = /^(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?$/.exec(value);
  if (!match) {
    addError(location, `must use ${allowedPrecisions.join(" or ")}`);
    return;
  }

  const precision = match[3] ? "YYYY-MM-DD" : match[2] ? "YYYY-MM" : "YYYY";
  if (!allowedPrecisions.includes(precision)) {
    addError(location, `must use ${allowedPrecisions.join(" or ")}`);
    return;
  }

  const year = Number(match[1]);
  const month = match[2] ? Number(match[2]) : 1;
  const day = match[3] ? Number(match[3]) : 1;
  if (year < 1900 || year > 2100 || month < 1 || month > 12) {
    addError(location, "contains an invalid year or month");
    return;
  }

  if (match[3]) {
    const candidate = new Date(Date.UTC(year, month - 1, day));
    if (
      candidate.getUTCFullYear() !== year ||
      candidate.getUTCMonth() !== month - 1 ||
      candidate.getUTCDate() !== day
    ) {
      addError(location, "contains an invalid calendar date");
    }
  }
}

function validateUrl(value, location, { required = true } = {}) {
  if (value === undefined && !required) return;
  if (!requireString(value, location)) return;

  if (/\s|[<>]/u.test(value)) {
    addError(location, "must not contain whitespace or angle brackets");
    return;
  }

  const scheme = /^([a-z][a-z\d+.-]*):/iu.exec(value)?.[1]?.toLowerCase();
  if (scheme) {
    if (!["http", "https", "mailto"].includes(scheme)) {
      addError(location, `uses unsupported URL scheme \"${scheme}\"`);
      return;
    }
    try {
      new URL(value);
    } catch {
      addError(location, "must be a valid URL");
    }
    return;
  }

  if (value.startsWith("//")) {
    addError(location, "protocol-relative URLs are not allowed");
    return;
  }

  const pathname = value.split(/[?#]/u, 1)[0];
  if (!pathname || pathname === "." || pathname.includes("..")) {
    addError(location, "must be a safe repository-relative path");
    return;
  }

  localReferences.push({ location, pathname: pathname.replace(/^\//u, "") });
}

function validateLinks(value, location, { required = false } = {}) {
  if (value === undefined && !required) return [];
  const links = requireArray(value, location);

  links.forEach((link, index) => {
    const itemLocation = `${location}[${index}]`;
    if (!requireRecord(link, itemLocation)) return;
    requireString(link.label, `${itemLocation}.label`);
    validateUrl(link.url, `${itemLocation}.url`);
  });

  return links;
}

function normalizedTitle(value) {
  return value
    .normalize("NFKC")
    .toLocaleLowerCase("en-US")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

function validateDuplicateTitles(items, location) {
  const seen = new Map();

  items.forEach((item, index) => {
    if (!isRecord(item) || typeof item.title !== "string" || item.title.trim() === "") return;
    const normalized = normalizedTitle(item.title);
    if (!normalized) return;

    if (seen.has(normalized)) {
      addError(
        `${location}[${index}].title`,
        `duplicates ${location}[${seen.get(normalized)}].title (\"${item.title}\")`
      );
    } else {
      seen.set(normalized, index);
    }
  });
}

function validateNews(news) {
  const items = requireArray(news, "content/news.js: window.PORTFOLIO_NEWS");

  items.forEach((item, index) => {
    const location = `content/news.js: PORTFOLIO_NEWS[${index}]`;
    if (!requireRecord(item, location)) return;

    validateIsoDate(item.date, `${location}.date`, ["YYYY-MM", "YYYY-MM-DD"]);
    requireString(item.title, `${location}.title`);
    optionalString(item.displayDate, `${location}.displayDate`);
    optionalString(item.category, `${location}.category`);
    optionalString(item.description, `${location}.description`);
    validateLinks(item.links, `${location}.links`);
  });

  validateDuplicateTitles(items, "content/news.js: PORTFOLIO_NEWS");
  return items;
}

function validateExperience(value) {
  const items = requireArray(value, "content/cv.js: PORTFOLIO_CV.experience");

  items.forEach((item, index) => {
    const location = `content/cv.js: PORTFOLIO_CV.experience[${index}]`;
    if (!requireRecord(item, location)) return;

    validateIsoDate(item.sortDate, `${location}.sortDate`, ["YYYY", "YYYY-MM", "YYYY-MM-DD"]);
    requireString(item.date, `${location}.date`);
    optionalString(item.location, `${location}.location`);
    requireString(item.organization, `${location}.organization`);
    requireString(item.role, `${location}.role`);
    const bullets = item.bullets === undefined
      ? []
      : validateStringArray(item.bullets, `${location}.bullets`);
    if (item.tags !== undefined) validateStringArray(item.tags, `${location}.tags`);
    optionalString(item.mark, `${location}.mark`);
    optionalString(item.markClass, `${location}.markClass`);
    optionalString(item.logoClass, `${location}.logoClass`);
    if (item.logo !== undefined) validateUrl(item.logo, `${location}.logo`);

    for (const dimension of ["logoWidth", "logoHeight"]) {
      if (item[dimension] !== undefined && (!Number.isInteger(item[dimension]) || item[dimension] <= 0)) {
        addError(`${location}.${dimension}`, "must be a positive integer");
      }
    }

    if (item.bulletLinks !== undefined) {
      const bulletLinks = requireArray(item.bulletLinks, `${location}.bulletLinks`);
      bulletLinks.forEach((link, linkIndex) => {
        const linkLocation = `${location}.bulletLinks[${linkIndex}]`;
        if (!requireRecord(link, linkLocation)) return;
        if (!Number.isInteger(link.bulletIndex) || link.bulletIndex < 0 || link.bulletIndex >= bullets.length) {
          addError(`${linkLocation}.bulletIndex`, "must reference an existing bullets array index");
        }
        requireString(link.label, `${linkLocation}.label`);
        validateUrl(link.url, `${linkLocation}.url`);
      });
    }
  });

  return items;
}

function validateProjects(value) {
  const items = requireArray(value, "content/cv.js: PORTFOLIO_CV.projects");

  items.forEach((item, index) => {
    const location = `content/cv.js: PORTFOLIO_CV.projects[${index}]`;
    if (!requireRecord(item, location)) return;

    requireString(item.title, `${location}.title`);
    optionalString(item.context, `${location}.context`, { allowEmpty: true });
    requireString(item.summary, `${location}.summary`);
    optionalString(item.imageAlt, `${location}.imageAlt`);
    optionalString(item.imageSourceLabel, `${location}.imageSourceLabel`);
    optionalString(item.figureCaption, `${location}.figureCaption`);
    if (item.image !== undefined) {
      validateUrl(item.image, `${location}.image`);
      if (item.imageAlt === undefined) {
        addError(`${location}.imageAlt`, "is required when image is provided");
      }
    }
    if (item.imageSource !== undefined) validateUrl(item.imageSource, `${location}.imageSource`);
    const metrics = item.metrics === undefined ? [] : requireArray(item.metrics, `${location}.metrics`);
    metrics.forEach((metric, metricIndex) => {
      const metricLocation = `${location}.metrics[${metricIndex}]`;
      if (!requireRecord(metric, metricLocation)) return;
      requireString(metric.value, `${metricLocation}.value`);
      requireString(metric.label, `${metricLocation}.label`);
    });

    validateLinks(item.links, `${location}.links`);
  });

  validateDuplicateTitles(items, "content/cv.js: PORTFOLIO_CV.projects");
  return items;
}

function validatePublications(value) {
  const items = requireArray(value, "content/cv.js: PORTFOLIO_CV.publications");

  items.forEach((item, index) => {
    const location = `content/cv.js: PORTFOLIO_CV.publications[${index}]`;
    if (!requireRecord(item, location)) return;

    validateYear(item.year, `${location}.year`);
    requireString(item.title, `${location}.title`);
    requireString(item.authors, `${location}.authors`);
    requireString(item.venue, `${location}.venue`);
    if (item.url !== undefined) validateUrl(item.url, `${location}.url`);
  });

  validateDuplicateTitles(items, "content/cv.js: PORTFOLIO_CV.publications");
  return items;
}

function validateEducation(value) {
  const items = requireArray(value, "content/cv.js: PORTFOLIO_CV.education");

  items.forEach((item, index) => {
    const location = `content/cv.js: PORTFOLIO_CV.education[${index}]`;
    if (!requireRecord(item, location)) return;

    validateIsoDate(item.sortDate, `${location}.sortDate`, ["YYYY", "YYYY-MM", "YYYY-MM-DD"]);
    requireString(item.date, `${location}.date`);
    requireString(item.degree, `${location}.degree`);
    requireString(item.school, `${location}.school`);
    optionalString(item.location, `${location}.location`);
    optionalString(item.gpa, `${location}.gpa`);
    optionalString(item.honor, `${location}.honor`);
    optionalString(item.details, `${location}.details`);
    optionalString(item.logoClass, `${location}.logoClass`);
    if (item.logo !== undefined) validateUrl(item.logo, `${location}.logo`);

    for (const dimension of ["logoWidth", "logoHeight"]) {
      if (item[dimension] !== undefined && (!Number.isInteger(item[dimension]) || item[dimension] <= 0)) {
        addError(`${location}.${dimension}`, "must be a positive integer");
      }
    }
  });

  return items;
}

function validateAwards(value) {
  const items = requireArray(value, "content/cv.js: PORTFOLIO_CV.awards");

  items.forEach((item, index) => {
    const location = `content/cv.js: PORTFOLIO_CV.awards[${index}]`;
    if (!requireRecord(item, location)) return;
    validateYear(item.year, `${location}.year`);
    requireString(item.title, `${location}.title`);
    optionalString(item.description, `${location}.description`);
    if (item.url !== undefined) validateUrl(item.url, `${location}.url`);
  });

  return items;
}

function validateService(value) {
  const items = requireArray(value, "content/cv.js: PORTFOLIO_CV.service");

  items.forEach((item, index) => {
    const location = `content/cv.js: PORTFOLIO_CV.service[${index}]`;
    if (!requireRecord(item, location)) return;
    requireString(item.title, `${location}.title`);
    optionalString(item.description, `${location}.description`);
    optionalString(item.mark, `${location}.mark`);
    validateLinks(item.links, `${location}.links`);
  });

  return items;
}

async function validateLocalReferences() {
  const checked = new Set();

  for (const reference of localReferences) {
    if (checked.has(reference.pathname)) continue;
    checked.add(reference.pathname);

    try {
      await access(sourcePath(reference.pathname));
    } catch {
      addError(reference.location, `references missing local file \"${reference.pathname}\"`);
    }
  }
}

const [newsWindow, cvWindow] = await Promise.all([
  loadBrowserData("content/news.js"),
  loadBrowserData("content/cv.js")
]);

const news = validateNews(newsWindow.PORTFOLIO_NEWS);

if (!requireRecord(cvWindow.PORTFOLIO_CV, "content/cv.js: window.PORTFOLIO_CV")) {
  await validateLocalReferences();
} else {
  const cv = cvWindow.PORTFOLIO_CV;
  const experience = validateExperience(cv.experience);
  const projects = validateProjects(cv.projects);
  const publications = validatePublications(cv.publications);
  const education = validateEducation(cv.education);
  const awards = validateAwards(cv.awards);
  const service = validateService(cv.service);

  await validateLocalReferences();

  if (errors.length === 0) {
    console.log(
      `Content valid: ${news.length} news, ${experience.length} experience, ` +
      `${projects.length} projects, ${publications.length} publications, ` +
      `${education.length} education, ${awards.length} awards, ` +
      `${service.length} service.`
    );
  }
}

if (errors.length > 0) {
  console.error(`Content validation failed (${errors.length} error${errors.length === 1 ? "" : "s"}):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exitCode = 1;
}
