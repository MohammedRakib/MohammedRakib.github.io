document.documentElement.classList.add("js");

document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".site-nav");
  const navigationLinks = [...document.querySelectorAll('.site-nav a[href^="#"]')];
  const year = document.querySelector("#current-year");

  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  const closeMenu = (returnFocus = false) => {
    if (!menuButton || !navigation) return;
    navigation.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation menu");
    document.body.classList.remove("menu-open");
    if (returnFocus) menuButton.focus();
  };

  const openMenu = () => {
    if (!menuButton || !navigation) return;
    navigation.classList.add("is-open");
    menuButton.setAttribute("aria-expanded", "true");
    menuButton.setAttribute("aria-label", "Close navigation menu");
    document.body.classList.add("menu-open");
  };

  menuButton?.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    if (isOpen) closeMenu();
    else openMenu();
  });

  navigationLinks.forEach((link) => link.addEventListener("click", () => {
    const wasOpen = navigation?.classList.contains("is-open");
    const target = document.querySelector(link.getAttribute("href"));
    closeMenu();

    if (wasOpen && target) {
      const focusTarget = target.querySelector("h1, h2") || target;
      focusTarget.setAttribute("tabindex", "-1");
      requestAnimationFrame(() => focusTarget.focus({ preventScroll: true }));
    }
  }));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navigation?.classList.contains("is-open")) {
      closeMenu(true);
    }
  });

  document.addEventListener("click", (event) => {
    if (!navigation?.classList.contains("is-open")) return;
    if (navigation.contains(event.target) || menuButton?.contains(event.target)) return;
    closeMenu();
  });

  const isSafeUrl = (value) => typeof value === "string"
    && /^(https?:\/\/|mailto:|\/|\.\.?\/|images\/|resume\/)/i.test(value);

  const createContentLink = (label, url, className = "") => {
    if (!isSafeUrl(url)) return null;
    const link = document.createElement("a");
    link.href = url;
    link.textContent = label;
    if (className) link.className = className;
    if (!url.startsWith("mailto:")) {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }
    return link;
  };

  const appendAuthors = (container, authors) => {
    const parts = String(authors || "").split(/(M\. Rakib)/g);
    parts.forEach((part) => {
      if (part === "M. Rakib") {
        const strong = document.createElement("strong");
        strong.textContent = part;
        container.append(strong);
      } else if (part) {
        container.append(document.createTextNode(part));
      }
    });
  };

  const formatNewsDate = (value) => {
    const match = /^(\d{4})-(\d{2})(?:-(\d{2}))?$/.exec(value);
    if (!match) return "Undated";

    const [, yearValue, monthValue, dayValue] = match;
    const dateValue = new Date(Date.UTC(
      Number(yearValue),
      Number(monthValue) - 1,
      dayValue ? Number(dayValue) : 1
    ));
    const options = { month: "short", year: "numeric", timeZone: "UTC" };
    if (dayValue) options.day = "numeric";
    return new Intl.DateTimeFormat("en-US", options).format(dateValue);
  };

  const newsItems = Array.isArray(window.PORTFOLIO_NEWS)
    ? window.PORTFOLIO_NEWS
      .filter((item) => item && typeof item.title === "string" && item.title.trim())
      .map((item) => {
        const dateValue = typeof item.date === "string" && /^\d{4}-\d{2}(?:-\d{2})?$/.test(item.date)
          ? item.date
          : "";
        return {
          ...item,
          date: dateValue,
          displayDate: typeof item.displayDate === "string" && item.displayDate.trim()
            ? item.displayDate
            : formatNewsDate(dateValue),
          category: typeof item.category === "string" && item.category.trim()
            ? item.category
            : "Update",
          description: typeof item.description === "string" ? item.description : "",
          links: Array.isArray(item.links) ? item.links : []
        };
      })
      .sort((a, b) => (b.date || "0000-00").localeCompare(a.date || "0000-00"))
    : [];
  const newsList = document.querySelector("#news-list");

  const renderNews = () => {
    if (!newsList || !newsItems.length) return;
    newsList.replaceChildren();

    const fragment = document.createDocumentFragment();

    newsItems.forEach((item) => {
      const article = document.createElement("article");
      article.className = "news-card";
      article.dataset.category = item.category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const meta = document.createElement("div");
      meta.className = "news-meta";

      const date = document.createElement("time");
      if (item.date) date.dateTime = item.date;
      date.textContent = item.displayDate;

      const category = document.createElement("span");
      category.className = "news-category";
      category.textContent = item.category;

      const title = document.createElement("h3");
      const primaryLink = Array.isArray(item.links)
        ? item.links.find((itemLink) => isSafeUrl(itemLink.url))
        : null;

      if (primaryLink) {
        const titleLink = document.createElement("a");
        titleLink.href = primaryLink.url;
        titleLink.target = "_blank";
        titleLink.rel = "noopener noreferrer";
        titleLink.textContent = item.title;
        title.append(titleLink);
      } else {
        title.textContent = item.title;
      }

      meta.append(date, category);
      article.append(meta, title);

      if (item.description) {
        const description = document.createElement("p");
        description.textContent = item.description;
        article.append(description);
      }

      fragment.append(article);
    });

    newsList.append(fragment);

  };

  renderNews();

  const cvContent = window.PORTFOLIO_CV && typeof window.PORTFOLIO_CV === "object"
    ? window.PORTFOLIO_CV
    : null;

  const appendTextWithLink = (container, text, linkData) => {
    if (!linkData || !isSafeUrl(linkData.url) || !text.includes(linkData.label)) {
      container.append(document.createTextNode(text));
      return;
    }

    const start = text.indexOf(linkData.label);
    container.append(document.createTextNode(text.slice(0, start)));
    const link = createContentLink(linkData.label, linkData.url);
    if (link) container.append(link);
    container.append(document.createTextNode(text.slice(start + linkData.label.length)));
  };

  const renderExperience = () => {
    const container = document.querySelector("#experience-list");
    if (!container || !Array.isArray(cvContent?.experience) || !cvContent.experience.length) return;

    const items = [...cvContent.experience]
      .filter((item) => item && item.organization && item.role)
      .sort((a, b) => String(b.sortDate || "").localeCompare(String(a.sortDate || "")));
    if (!items.length) return;

    const fragment = document.createDocumentFragment();
    items.forEach((item) => {
      const article = document.createElement("article");
      article.className = "timeline-item";

      const meta = document.createElement("div");
      meta.className = "timeline-meta";
      const date = document.createElement("time");
      if (item.sortDate) date.dateTime = item.sortDate;
      date.textContent = item.date || item.sortDate || "";
      meta.append(date);
      if (item.location) {
        const location = document.createElement("span");
        location.textContent = item.location;
        meta.append(location);
      }

      const card = document.createElement("div");
      card.className = "timeline-card";
      const heading = document.createElement("div");
      heading.className = "role-heading";

      if (item.logo && isSafeUrl(item.logo)) {
        const logo = document.createElement("img");
        logo.className = `company-logo${item.logoClass ? ` ${item.logoClass}` : ""}`;
        logo.src = item.logo;
        logo.alt = "";
        logo.loading = "lazy";
        if (Number.isFinite(item.logoWidth)) logo.width = item.logoWidth;
        if (Number.isFinite(item.logoHeight)) logo.height = item.logoHeight;
        heading.append(logo);
      } else if (item.mark) {
        const mark = document.createElement("div");
        mark.className = `company-mark${item.markClass ? ` ${item.markClass}` : ""}`;
        mark.setAttribute("aria-hidden", "true");
        mark.textContent = item.mark;
        heading.append(mark);
      }

      const titleGroup = document.createElement("div");
      const organization = document.createElement("p");
      organization.textContent = item.organization;
      const role = document.createElement("h3");
      role.textContent = item.role;
      titleGroup.append(organization, role);
      heading.append(titleGroup);
      card.append(heading);

      if (Array.isArray(item.bullets) && item.bullets.length) {
        const list = document.createElement("ul");
        item.bullets.forEach((bullet, bulletIndex) => {
          if (typeof bullet !== "string" || !bullet.trim()) return;
          const listItem = document.createElement("li");
          const bulletLink = Array.isArray(item.bulletLinks)
            ? item.bulletLinks.find((candidate) => candidate.bulletIndex === bulletIndex)
            : null;
          appendTextWithLink(listItem, bullet, bulletLink);
          list.append(listItem);
        });
        if (list.children.length) card.append(list);
      }

      if (Array.isArray(item.tags) && item.tags.length) {
        const tags = document.createElement("div");
        tags.className = "tag-row";
        item.tags.forEach((tag) => {
          const span = document.createElement("span");
          span.textContent = tag;
          tags.append(span);
        });
        card.append(tags);
      }

      article.append(meta, card);
      fragment.append(article);
    });

    container.replaceChildren(fragment);
  };

  const appendProjectLinks = (container, links, className = "") => {
    if (!Array.isArray(links)) return;
    links.forEach((item, index) => {
      const link = createContentLink(item.label || "View", item.url, className);
      if (!link) return;
      if (index > 0) container.append(document.createTextNode(" "));
      container.append(link);
    });
  };

  const renderProjects = () => {
    const featuredContainer = document.querySelector("#project-list");
    const archiveContainer = document.querySelector("#project-archive-list");
    if (!Array.isArray(cvContent?.projects)) return;

    const projects = cvContent.projects.filter((item) => item && item.title && item.summary);
    const featured = projects.filter((item) => item.featured !== false);
    const archived = projects.filter((item) => item.featured === false);

    if (featuredContainer && featured.length) {
      const fragment = document.createDocumentFragment();
      featured.forEach((item, index) => {
        const article = document.createElement("article");
        article.className = `project-card${index < 2 ? " project-featured" : ""}${index === 1 ? " alt" : ""}`;

        const top = document.createElement("div");
        top.className = "project-top";
        const number = document.createElement("span");
        number.className = "project-index";
        number.textContent = String(index + 1).padStart(2, "0");
        const context = document.createElement("span");
        context.className = "project-year";
        context.textContent = item.context || "Project";
        top.append(number, context);

        const title = document.createElement("h3");
        title.textContent = item.title;
        article.append(top, title);

        if (item.subtitle) {
          const subtitle = document.createElement("p");
          subtitle.className = "project-subtitle";
          subtitle.textContent = item.subtitle;
          article.append(subtitle);
        }

        const summary = document.createElement("p");
        summary.textContent = item.summary;
        article.append(summary);

        if (Array.isArray(item.metrics) && item.metrics.length) {
          const metrics = document.createElement("div");
          metrics.className = "metric-row";
          item.metrics.forEach((metric) => {
            if (!metric?.value) return;
            const span = document.createElement("span");
            const value = document.createElement("strong");
            value.textContent = metric.value;
            span.append(value, document.createTextNode(metric.label ? ` ${metric.label}` : ""));
            metrics.append(span);
          });
          if (metrics.children.length) article.append(metrics);
        }

        appendProjectLinks(article, item.links, "project-link");
        fragment.append(article);
      });
      featuredContainer.replaceChildren(fragment);
    }

    if (archiveContainer && archived.length) {
      const fragment = document.createDocumentFragment();
      archived.forEach((item) => {
        const article = document.createElement("article");
        const title = document.createElement("h3");
        title.textContent = item.title;
        const summary = document.createElement("p");
        summary.textContent = item.summary;
        article.append(title, summary);
        appendProjectLinks(article, item.links);
        fragment.append(article);
      });
      archiveContainer.replaceChildren(fragment);
    }
  };

  const renderPublications = () => {
    const container = document.querySelector("#publication-list");
    if (!container || !Array.isArray(cvContent?.publications) || !cvContent.publications.length) return;

    const publications = [...cvContent.publications]
      .filter((item) => item && item.year && item.title)
      .sort((a, b) => String(b.year).localeCompare(String(a.year)));
    if (!publications.length) return;

    const fragment = document.createDocumentFragment();
    publications.forEach((item) => {
      const listItem = document.createElement("li");
      const yearValue = document.createElement("span");
      yearValue.className = "pub-year";
      yearValue.textContent = item.year;

      const content = document.createElement("div");
      const title = document.createElement("h3");
      const titleLink = createContentLink(item.title, item.url);
      if (titleLink) title.append(titleLink);
      else title.textContent = item.title;

      const citation = document.createElement("p");
      appendAuthors(citation, item.authors);
      if (item.venue) citation.append(document.createTextNode(`${item.authors ? " · " : ""}${item.venue}`));
      content.append(title, citation);
      listItem.append(yearValue, content);
      fragment.append(listItem);
    });

    container.replaceChildren(fragment);
  };

  const renderEducation = () => {
    const container = document.querySelector("#education-list");
    if (!container || !Array.isArray(cvContent?.education) || !cvContent.education.length) return;

    const entries = [...cvContent.education]
      .filter((item) => item && item.degree && item.school)
      .sort((a, b) => String(b.sortDate || "").localeCompare(String(a.sortDate || "")));
    if (!entries.length) return;

    const fragment = document.createDocumentFragment();
    entries.forEach((item) => {
      const article = document.createElement("article");
      article.className = "education-card";

      if (item.logo && isSafeUrl(item.logo)) {
        const logoWrap = document.createElement("div");
        logoWrap.className = `education-logo${item.logoClass ? ` ${item.logoClass}` : ""}`;
        const logo = document.createElement("img");
        logo.src = item.logo;
        logo.alt = `${item.school} logo`;
        logo.loading = "lazy";
        if (Number.isFinite(item.logoWidth)) logo.width = item.logoWidth;
        if (Number.isFinite(item.logoHeight)) logo.height = item.logoHeight;
        logoWrap.append(logo);
        article.append(logoWrap);
      }

      const date = document.createElement("p");
      date.className = "degree-date";
      date.textContent = item.date || item.sortDate || "";
      const degree = document.createElement("h3");
      degree.textContent = item.degree;
      const school = document.createElement("p");
      school.append(document.createTextNode(item.school));
      if (item.location) school.append(document.createElement("br"), document.createTextNode(item.location));
      article.append(date, degree, school);

      if (item.gpa || item.honor) {
        const grade = document.createElement("span");
        grade.className = "grade";
        grade.textContent = [item.gpa ? `GPA ${item.gpa}` : "", item.honor || ""].filter(Boolean).join(" · ");
        article.append(grade);
      }

      if (item.details) {
        const details = document.createElement("small");
        details.textContent = item.details;
        article.append(details);
      }
      fragment.append(article);
    });

    container.replaceChildren(fragment);
  };

  const renderAwards = () => {
    const container = document.querySelector("#awards-list");
    if (!container || !Array.isArray(cvContent?.awards) || !cvContent.awards.length) return;

    const items = [...cvContent.awards]
      .filter((item) => item && item.year && item.title)
      .sort((a, b) => String(b.year).localeCompare(String(a.year)));
    if (!items.length) return;

    const fragment = document.createDocumentFragment();
    items.forEach((item) => {
      const listItem = document.createElement("li");
      const yearValue = document.createElement("span");
      yearValue.textContent = item.year;
      const content = document.createElement("div");
      const title = document.createElement("strong");
      const titleLink = createContentLink(item.title, item.url);
      if (titleLink) title.append(titleLink);
      else title.textContent = item.title;
      const description = document.createElement("p");
      description.textContent = item.description || "";
      content.append(title, description);
      listItem.append(yearValue, content);
      fragment.append(listItem);
    });

    container.replaceChildren(fragment);
  };

  const renderService = () => {
    const container = document.querySelector("#service-list");
    if (!container || !Array.isArray(cvContent?.service) || !cvContent.service.length) return;

    const fragment = document.createDocumentFragment();
    cvContent.service.filter((item) => item && item.title).forEach((item) => {
      const listItem = document.createElement("li");
      const mark = document.createElement("span");
      mark.className = "service-icon";
      mark.setAttribute("aria-hidden", "true");
      mark.textContent = item.mark || "";

      const content = document.createElement("p");
      const title = document.createElement("strong");
      title.textContent = item.title;
      content.append(title, document.createElement("br"));

      const description = item.description || "";
      const links = Array.isArray(item.links) ? item.links : [];
      const inlineLink = links.find((linkData) => description.includes(linkData.label));
      appendTextWithLink(content, description, inlineLink);

      links.filter((linkData) => linkData !== inlineLink).forEach((linkData) => {
        const link = createContentLink(linkData.label || "View", linkData.url);
        if (!link) return;
        content.append(document.createTextNode(" "), link);
      });
      listItem.append(mark, content);
      fragment.append(listItem);
    });

    if (fragment.childNodes.length) container.replaceChildren(fragment);
  };

  const renderSkills = () => {
    const container = document.querySelector("#skills-list");
    if (!container || !Array.isArray(cvContent?.skillGroups) || !cvContent.skillGroups.length) return;

    const fragment = document.createDocumentFragment();
    cvContent.skillGroups.filter((item) => item && item.title && Array.isArray(item.items)).forEach((item) => {
      const group = document.createElement("div");
      const title = document.createElement("h3");
      title.textContent = item.title;
      const values = document.createElement("p");
      values.textContent = item.items.join(", ");
      group.append(title, values);
      fragment.append(group);
    });

    if (fragment.childNodes.length) container.replaceChildren(fragment);
  };

  if (cvContent) {
    renderExperience();
    renderProjects();
    renderPublications();
    renderEducation();
    renderAwards();
    renderService();
    renderSkills();
  }

  if ("IntersectionObserver" in window) {
    const observedSections = [...document.querySelectorAll("main section[id]")];
    const sectionObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;

      navigationLinks.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${visible.target.id}`;
        link.classList.toggle("is-active", isActive);
        if (isActive) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    }, { rootMargin: "-28% 0px -58%", threshold: [0.05, 0.2, 0.5] });

    observedSections.forEach((section) => sectionObserver.observe(section));
  }

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900) closeMenu();
  });
});
