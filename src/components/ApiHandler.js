import axios from "axios";
import { ToastError } from "./UI/Functional/ToastMessage";
const baseLink = "https://localhost:7007/api/app/";

function CheckFirstSlash(str) {
  const first = str.substring(0, 1);
  if (first !== "/") {
    return "/" + str;
  }
  return str;
}
let RefreshingToken = false;

const RefreshTokenHandler = () => {
  const users = JSON.parse(localStorage.getItem("user"));
  if (!users) {
    return;
  }
  if (RefreshingToken) {
    console.log("Return refresh");
    return;
  }
  RefreshingToken = true;
  console.log({ users });

  const data = {
    ExpiredToken: users.token,
    RefreshToken: users.refreshToken,
  };

  axios
    .post(baseLink + "/Authenticate/RefreshToken", data)
    .then((res) => {
      console.log(res);
      if (res && res.data && res.data.isSuccess) {
        localStorage.setItem("user", JSON.stringify(res.data));
      }
    })
    .catch((err) => {
      console.error(err);
      ToastError("Token Not Valid");
      localStorage.clear();
      window.location.reload();
    })
    .finally((e) => {
      RefreshingToken = false;
    });
};


// Api calling functions when call api call from this functions it makes it possible to be used like a component 
// to be used again and again also be able to pass token validation 
export const GetApiHandler = async (props) => {
  const user = JSON.parse(localStorage.getItem("user"));
  let token = "";
  if (user) {
    token = user.token;
  }
  if (RefreshingToken) {
    console.log("Refreshing User Token");
    return Promise.reject("Refreshing Token");
  }
  const { url } = props;
  const result = await axios
    .get(baseLink + CheckFirstSlash(url), {
      headers: token === "" ? {} : { Authorization: `Bearer ${token}` },
      cancelToken: props.cancelToken ? props.cancelToken : false,
    })
    .then((res) => {
      if (res.data) {
        return Promise.resolve(res.data);
      } else {
        return Promise.resolve(res);
      }
    })
    .catch((err) => {
      const error = err;
      console.error(error);
      if (
        typeof error.toJSON === "function" &&
        error.toJSON().message === "Network Error"
      ) {
        ToastError("no internet connection");
      }
      if (err.response && err.response.status && err.response.status === 401) {
        console.error(err.response);
        RefreshTokenHandler();
        // ToastError("Token has expired Please refresh");
      }
      return Promise.reject(err);
    });
  return await result;
};

export const PostApiHandler = async (props) => {
  if (RefreshingToken) {
    console.log("Refreshing User Token");
    return Promise.reject("Refreshing Token");
  }
  const user = JSON.parse(localStorage.getItem("user"));
  let token = "";
  if (user) {
    token = user.token;
  }
  const { url, data } = props;
  const result = await axios
    .post(baseLink + CheckFirstSlash(url), data, {
      headers: !token ? {} : { Authorization: `Bearer ${token}` },
      cancelToken: props.cancelToken ? props.cancelToken : false,
    })
    .then((res) => {
      return Promise.resolve(res);
    })
    .catch((err) => {
      console.error(err);
      const error = err;
      if (error.toJSON().message === "Network Error") {
        ToastError("no internet connection");
      }
      if (err.response && err.response.status && err.response.status === 401) {
        console.error(err.response);
        RefreshTokenHandler();
        //  ToastError("Token has expired Please refresh");
      }
      return Promise.reject(err);
    });
  return result;
};

export const PutApiHandler = async (props) => {
  if (RefreshingToken) {
    console.log("Refreshing User Token");

    return Promise.reject("Refreshing Token");
  }
  const user = JSON.parse(localStorage.getItem("user"));
  let token = "";
  if (user) {
    token = user.token;
  }
  const { url, data } = props;
  const result = await axios
    .put(baseLink + CheckFirstSlash(url), data, {
      headers: !token ? {} : { Authorization: `Bearer ${token}` },
      cancelToken: props.cancelToken ? props.cancelToken : false,
    })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      const error = err;
      if (typeof error.toJSON !== "undefined" && error.toJSON().message === "Network Error") {
        ToastError("no internet connection");
      }
      if (err.response && err.response.status && err.response.status === 401) {
        console.error(err.response);
        RefreshTokenHandler();
        // ToastError("Token has expired Please refresh");
      }
      return Promise.reject(err);
    });
  return result;
};

export const DeleteApiHandler = async (props) => {
  if (RefreshingToken) {
    console.log("Refreshing User Token");
    return Promise.reject("Refreshing Token");
  }
  const user = JSON.parse(localStorage.getItem("user"));
  let token = "";
  if (user) {
    token = user.token;
  }
  const { url } = props;
  const result = await axios
    .delete(baseLink + CheckFirstSlash(url), {
      headers: !token ? {} : { Authorization: `Bearer ${token}` },
      cancelToken: props.cancelToken ? props.cancelToken : false,
    })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.error(err);
      const error = err;
      if (error && error.toJSON() && error.toJSON().message === "Network Error") {
        ToastError("no internet connection");
      }
      if (err.response && err.response.status && err.response.status === 401) {
        console.error(err.response);
        RefreshTokenHandler();
        //  ToastError("Token has expired Please refresh");
      }
      return Promise.reject(err);
    });
  return result;
};

const ApiHandler = {
  get: GetApiHandler,
  post: PostApiHandler,
  put: PutApiHandler,
  delete: DeleteApiHandler,
  cancelToken: axios.CancelToken,
}

export default ApiHandler;