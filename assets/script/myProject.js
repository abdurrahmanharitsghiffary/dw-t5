const contactForm = document.getElementById("add-project-form");
const projects = [];

const CLEAR_AFTER_SUBMIT = false;
const sampleProjects = [
  {
    projectName: "Project 1",
    image:
      "https://plus.unsplash.com/premium_photo-1685082778205-8665f65e8c2c?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    startDate: "2024-12-03T03:24:00",
    endDate: "2024-12-04T03:25:00",
    description: "Project pertama saya",
    technologies: ["ts"],
  },
  {
    projectName: "Project 1",
    image:
      "https://plus.unsplash.com/premium_photo-1685082778205-8665f65e8c2c?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    startDate: "2023-12-03T03:24:00",
    endDate: "2024-12-04T03:25:00",
    description: "Project pertama saya",
    technologies: ["ts", "nodejs"],
  },
  {
    projectName: "Project 1",
    image:
      "https://plus.unsplash.com/premium_photo-1685082778205-8665f65e8c2c?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    startDate: "2024-12-03T03:24:10",
    endDate: "2024-12-04T03:25:50",
    description: "Project pertama saya",
    technologies: ["ts"],
  },
];

const fieldIds = [
  "projectName",
  "startDate",
  "endDate",
  "description",
  "image",
];
const checkboxIds = ["nodejs", "nextjs", "react", "ts"];

const errorMessage = {
  empty: (key) => `${key} must not be empty.`,
  startDateHigherThanEndDate: "Start date must not be higher than end date.",
  techCheckbox: "Must be at least checked one box.",
};

[...fieldIds, ...checkboxIds].forEach((field) => {
  const el = document.getElementById(field);
  const isCheckbox = el.getAttribute("type") === "checkbox";
  const onChange = (e) => {
    e.preventDefault();
    if (isCheckbox) {
      clearErrorMessage("#technologies + .error-message");
    }
    if (el.value && !isCheckbox) {
      clearFieldError("#" + field);
      clearErrorMessage(`#${field} + .error-message`);
    }
  };

  el.addEventListener("change", onChange);
});

const onSubmit = (e) => {
  e.preventDefault();

  const data = { technologies: [] };
  let isInvalid = false;

  fieldIds.forEach((field) => {
    data[field] = getInputValue("#" + field);
  });

  checkboxIds.forEach((field) => {
    const isChecked = getIsChecked("#" + field);
    if (isChecked) data.technologies.push(field);
  });

  Object.entries(data).forEach(([key, value]) => {
    const isValueEmpty = value === "" || !value || value === undefined;

    if (isValueEmpty) {
      isInvalid = true;

      showErrorMessage(`#${key} + .error-message`, errorMessage.empty(key));
      showFieldError("#" + key);
    }
  });

  if (data.startDate > data.endDate) {
    isInvalid = true;
    showErrorMessage(
      "#startDate + p.error-message",
      errorMessage.startDateHigherThanEndDate
    );
    showFieldError("#startDate");
  }

  if (data.technologies.length < 1) {
    isInvalid = true;
    showErrorMessage(
      "#technologies + .error-message",
      errorMessage.techCheckbox
    );
  }

  if (isInvalid) {
    contactForm.querySelector(".input-wrapper .error").focus();
    return;
  }

  projects.push(data);
  renderProjects();

  if (CLEAR_AFTER_SUBMIT) {
    fieldIds.forEach((field) => {
      clearInputValue("#" + field);
    });
    checkboxIds.forEach((field) => {
      document.getElementById(field).checked = false;
    });
  }
};

contactForm.addEventListener("submit", onSubmit);

const getInputValue = (selector) => {
  const el = document.querySelector(selector);

  if (el.type === "file" && el?.files?.[0]) {
    return URL.createObjectURL(el.files?.[0]);
  } else {
    return el.value;
  }
};
const getIsChecked = (selector) =>
  document.querySelector(selector).checked ? true : false;

const showFieldError = (selector) =>
  document.querySelector(selector).classList.add("error");

const clearFieldError = (selector) =>
  document.querySelector(selector).classList.remove("error");

const showErrorMessage = (selector, errorMessage) =>
  (document.querySelector(selector).innerHTML = errorMessage);

const clearInputValue = (selector) =>
  (document.querySelector(selector).value = "");

const clearErrorMessage = (selector) =>
  (document.querySelector(selector).innerHTML = "");

const renderProjects = () => {
  const el = document.getElementById("project-lists");
  el.innerHTML = "";

  if (projects.length > 0) {
    el.innerHTML = [...sampleProjects, ...projects]
      .map((project) =>
        ProjectCard({
          src: project.image,
          title: project.projectName,
          description: project.description,
          technologies: project.technologies,
          endDate: project.endDate,
          startDate: project.startDate,
        })
      )
      .join("");
  }
};

const techIcons = {
  nodejs: `<i class="fa-brands fa-node-js" style="color: #3c873a;"></i>`,
  react: `<i class="fa-brands fa-react" style="color: #61dbfb;"></i>`,
  nextjs: `<img src="./assets/img/nextjs.svg"s />`,
  ts: `<img src="./assets/img/typescript.svg" />`,
};

const ProjectCard = ({
  src,
  title,
  description,
  technologies,
  startDate,
  endDate,
}) => {
  const currentUrl = new URL(window.location.href);

  const duration = getFormattedDuration(getDuration(startDate, endDate));

  currentUrl.pathname = "/projectDetail.html";

  currentUrl.searchParams.set("title", title);
  currentUrl.searchParams.set("desc", description);
  currentUrl.searchParams.set("d", duration);
  currentUrl.searchParams.set("tech", technologies.join(","));
  currentUrl.searchParams.set("img", src);
  currentUrl.searchParams.set("es-date", startDate + "," + endDate);

  return `<div class="card-project">
  <header class="card-header">
    <img
      src="${src}"
      alt="${title}"
    />
  </header>
  <div class="card-body">
  <div class="title">
  <h2>${title}</h2>
  <p>Duration: ${duration}</p>
  </div>
    <p>
      ${description}
    </p>
    <h3>Technologies</h3>
    <ul class="icon-list">
      ${technologies.map((tech) => `<li>${techIcons[tech]}</li>`).join("")}
    </ul>
    <a class="detail-link" href="${currentUrl.href}"></a>
  </div>
  <footer class="card-footer">
    <button class="button button-dark fw-bold r-sm fullwidth">
      Edit
    </button>
    <button class="button button-dark fw-bold r-sm fullwidth">
      Delete
    </button>
  </footer>
  </div><div class="card-project">
  <header class="card-header">
    <img
      src="${src}"
      alt="${title}"
    />
  </header>
  <div class="card-body">
  <div class="title">
  <h2>${title}</h2>
  <p>Duration: ${duration}</p>
  </div>
    <p>
      ${description}
    </p>
    <h3>Technologies</h3>
    <ul class="icon-list">
      ${technologies.map((tech) => `<li>${techIcons[tech]}</li>`).join("")}
    </ul>
    <a class="detail-link" href="${currentUrl.href}"></a>
  </div>
  <footer class="card-footer">
    <button class="button button-dark fw-bold r-sm fullwidth">
      Edit
    </button>
    <button class="button button-dark fw-bold r-sm fullwidth">
      Delete
    </button>
  </footer>
  </div>`;
};

const getDuration = (stDate, endDate) => {
  const start = new Date(stDate);
  const end = new Date(endDate);
  const t = end.getTime() - start.getTime();

  const durrInY = t / (1000 * 60 * 60 * 24 * 30.43 * 12);

  const resY = durrInY - Math.floor(durrInY);
  const month = resY * 12;

  const resM = month - Math.floor(month);
  const day = resM * 30.43;

  const resD = day - Math.floor(day);
  const hour = resD * 24;

  const resH = hour - Math.floor(hour);
  const minute = resH * 60;

  const resMin = minute - Math.floor(minute);

  const second = resMin * 60;

  return {
    year: Math.floor(durrInY),
    month: Math.floor(month),
    day: Math.floor(day),
    hour: Math.floor(hour),
    minute: Math.floor(minute),
    second: Math.floor(second),
  };
};

const getFormattedDuration = (durr) => {
  let count = 0;
  let durrStr = [];
  console.log(durr);

  // ubah object hasil getDuration menjadi array
  Object.entries(durr).forEach(([key, value]) => {
    // mengambil 3 value berurut dari y, m ,d
    if (value > 0 && count <= 2) {
      durrStr.push(`${value} ${value > 1 ? key + "s" : key}`);
      // 1 year, 1 years
      // output: 1 month, 10 months, 87 months
      count++;
    }
  });

  return durrStr.join(", ");
};

const el = document.getElementById("project-lists");

el.innerHTML = sampleProjects
  .map((project) =>
    ProjectCard({
      src: project.image,
      title: project.projectName,
      description: project.description,
      technologies: project.technologies,
      endDate: project.endDate,
      startDate: project.startDate,
    })
  )
  .join("");
