import axios from "axios";

const buildClient = ({ req }) => {
  if (typeof window === "undefined") {
    // server
    return axios.create({
      baseURL: "http://www.okocentral.com/",
      headers: req.headers,
    });
  } else {
    // browser
    return axios.create({
      baseURL: "/",
    });
  }
};

export { buildClient };
