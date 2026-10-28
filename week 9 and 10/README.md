# FreelanceHub (React)

A React version of the FreelanceHub project: browse freelancers loaded from
`freelancers.json`, save favourites, create a freelancer profile and post a
project. Built for **Weeks 9 & 10**.

## What each topic looks like in the code

| Topic | Where to find it |
| --- | --- |
| `try` / `catch` / `finally` | `src/api.js`, `src/storage.js`, `JoinSection.jsx`, `HireSection.jsx`, `App.jsx` |
| Custom errors | `src/errors.js` (`AppError`, `NetworkError`, `DataError`, `StorageError`, `ValidationError`), thrown in `api.js`, `storage.js`, `validation.js` |
| Event handling | `onClick`, `onChange`, `onSubmit` (with `event.preventDefault()`) in every component |
| Forms and controlled components | `SearchForm.jsx`, `JoinSection.jsx`, `HireSection.jsx` (every input has `value` + `onChange`) |
| Component composition | `App.jsx` composes the page; `SectionHeading` and `GridMessage` use `children`; `FreelancersSection` wraps `ResultsToolbar` + `FreelancerGrid` |
| Lifting state up | `filters`, `favorites`, `customFreelancers` and `hireRequest` live in `App.jsx` and flow down as props |
| Hooks intro | `useState` in `App.jsx` and both forms; `useEffect` for loading data, saving to localStorage and filling the project form |
| NPM | `package.json` scripts and the commands below |
| GitHub | The workflow below |

## NPM commands

```bash
npm init -y                      # how a package.json is first created (already done here)
npm install                      # install every dependency listed in package.json
npm install react react-dom      # add packages to "dependencies"
npm install -D vite              # add a package to "devDependencies"
npm uninstall <package>          # remove a package
npm run dev                      # start the dev server (http://localhost:5173)
npm run build                    # create the production build in dist/
npm run preview                  # preview the production build
npm list --depth=0               # list installed packages
npm outdated                     # show packages with newer versions
```

`node_modules/` and `dist/` are listed in `.gitignore`, so they are never pushed.
Anyone who clones the repo runs `npm install` to recreate them.

## GitHub workflow

### 1. Create your GitHub account (ID) and the repository

1. Sign up at github.com and pick a username (your GitHub ID).
2. Click **New repository**, name it `freelancehub`, leave it empty (no README) and click **Create repository**.

### 2. Connect the local project

```bash
git config --global user.name "Your Name"
git config --global user.email "you@example.com"

git init
git add .
git commit -m "Initial commit: FreelanceHub React app"
git branch -M main
git remote add origin https://github.com/<your-username>/freelancehub.git
git push -u origin main
```

### 3. Branching, merging and pull requests

```bash
git switch -c feature/custom-errors      # create and switch to a new branch
# ...edit files...
git status                               # see what changed
git add src/errors.js
git commit -m "Add custom error classes"
git push -u origin feature/custom-errors # publish the branch
```

Then on GitHub:

1. Click **Compare & pull request** for `feature/custom-errors`.
2. Write a title and description, then click **Create pull request**.
3. Review the changes, then click **Merge pull request** and **Delete branch**.

Back in your terminal:

```bash
git switch main
git pull                                 # bring the merged work into local main
git branch -d feature/custom-errors      # delete the local branch
```

Merging locally instead of through a pull request:

```bash
git switch main
git merge feature/custom-errors
```

If two branches changed the same lines, Git stops with a **merge conflict**.
Open the file, keep the correct lines, remove the `<<<<<<<`, `=======` and
`>>>>>>>` markers, then run `git add <file>` and `git commit`.

### Suggested branches for this project

| Branch | Work |
| --- | --- |
| `feature/react-setup` | Vite + React setup, `package.json`, `.gitignore` |
| `feature/custom-errors` | `errors.js`, `try`/`catch` in `api.js` and `storage.js` |
| `feature/forms` | Controlled forms and `validation.js` |
| `feature/hooks` | `useState` / `useEffect` in `App.jsx` |

## Project structure

```
freelancehub/
├── index.html
├── package.json
├── vite.config.js
├── .gitignore
├── public/
│   └── freelancers.json
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── api.js
    ├── constants.js
    ├── errors.js
    ├── storage.js
    ├── validation.js
    └── components/
```

> Because the data is loaded with `fetch`, always use `npm run dev` (or any local
> server). Opening `index.html` directly from the file system will not work.
