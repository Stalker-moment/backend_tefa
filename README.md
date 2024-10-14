# Backend CCR
 API for CCR for PT. TMMIN

## Using :
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB) ![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white) ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)	![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)

## URL :
- [API Url](https://ccrapi.akti.cloud)

# Installation

## Windows
* [`Download Node JS`](https://nodejs.org/en/download/)
* [`Download Git`](https://git-scm.com/download/win)
* [`Download PostgreSQL`](https://www.postgresql.org/download/)

## Cloning this repo
```cmd
> git clone https://github.com/anamkombo/backend_ccr
> cd backend_ccr
```

## Install the package
```cmd
> npm i
```

## Added .env files
```env
DATABASE_URL="postgresql://{user}:{password}@localhost:5432/{DatabaseName}"
DIRECT_URL="postgresql://{user}:{password}@localhost:5432/{DatabaseName}"
JWT_SECRET="your_secret"
INTERNAL_SECRET="your_secret"
PORT=3024
```

## Build Prisma
```cmd
> npx prisma migrate dev
```

or

```cmd
> npx prisma migrate deploy
```

## Run script on development mode
```cmd
> node run dev
```

## Run the script
```cmd
> npm start
```
