const config =
  process.env.NODE_ENV === "production"
    ? require("./production").default
    : require("./development").default;

export default config;
