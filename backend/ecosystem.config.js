module.exports = {
  apps: [
    {
      name: 'kupipodari-backend',
      script: 'dist/main.js',          
      env: {
        NODE_ENV: 'production',
        PORT: 4000,
        JWT_SECRET: process.env.JWT_SECRET,
        POSTGRES_HOST: process.env.POSTGRES_HOST,
        POSTGRES_PORT: 5432,
        POSTGRES_USER: process.env.POSTGRES_USER,
        POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
        POSTGRES_DB: process.env.POSTGRES_DB,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 4000,
      },
    },
  ],
};
