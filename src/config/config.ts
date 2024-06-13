const config = (key: string) => {
  const configKeys: any = {
    jwt_key: process.env.JWT_SECRET_KEY || "",

    dbURL:
      process.env.NODE_ENV === "production"
        ? process.env.PROD_DATABASE
        : process.env.DEV_DATABASE,

    cloudinary: {
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_SECRET_KEY,
    },
  };

  return configKeys[key];
};

export default config;
