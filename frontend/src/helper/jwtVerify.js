import { jwtDecode } from "jwt-decode";

const parseJwt = (token) => {
  try {
    return jwtDecode(token);
  } catch (err) {
    console.log(err);
    return null;
  }
};

export function AuthVerify() {
  const accessToken = localStorage.getItem("token");
  if (!accessToken) return false;

  const decodedJwt = parseJwt(accessToken);
  if (!decodedJwt) return false;

  if (decodedJwt.exp * 1000 < Date.now()) {
    localStorage.clear();
    return false;
  }

  return true;
}

export default AuthVerify;
