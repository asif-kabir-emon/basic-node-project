## Install
- Initialize Project : `npm init -y`
- Install express: `npm install express`
- Install dotenv: `npm install dotenv`
- Install cors: `npm install cors`
- Install mongodb and mongoose: `npm install mongodb mongoose`
- Install typescript: `npm install typescript --save-dev`
- Initialize typescript: `tsc -init`
- Change `rootDir` and `outDir` from ***tsconfig.json***
- Install: `npm i --save-dev @types/express` and `npm i --save-dev @types/cors`
- Add `"build": "tsc",` to ***package.json*** 

### Install ESLint
- Documentation link: https://blog.logrocket.com/linting-typescript-eslint-prettier/
- Add bellow lines to ***tsconfig.json***
    ```
    "include": ["src"], // which files to compile
    "exclude": ["node_modules"], // which files to skip
    ```
- `npm install eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin --save-dev`
- `npx eslint --init`
- Add `"lint": "eslint src --ignore-path .eslintignore --ext .ts"` to ***package.json*** 

### Install Prettier
- `npm install --save-dev prettier`

- `npm i ts-node-dev --save-dev`