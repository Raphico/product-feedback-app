import { instance } from "./client";

function setupResponseInterceptors() {
  instance.interceptors.response.use(
    function (response) {
      return Promise.resolve(response.data);
    },
    async function (error) {
      return Promise.reject(error);
    },
  );
}

export function setupInterceptors() {
  setupResponseInterceptors();
}
