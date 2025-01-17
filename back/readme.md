## Comandos
```bash
npm init
npm i express dotenv cors jsonwebtoken mongoose bcryptjs nodemailer cookie-parser   

  "type":"module",
  "scripts": { 
    "start": "node --watch --env-file=.env server.js"
  },

docker-compose up -d
```

## .env
```bash
PORT='4000' 
MONGODB_URI='mongodb://admin:admin123@localhost:27017'
JWT_SECRET='secret'
NODE_ENV='development'
SMTP_HOST='smtp.gmail.com'
SMTP_USER='example@gmail.com'
SMTP_PASS='example'
SMTP_SENDER='example@gmail.com'
```
