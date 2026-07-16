const appConfig = require("../config/app");

// Max Age string parser (e.g. '7d' -> milliseconds)
const parseMaxAge = (durationStr) => {
  if (durationStr.endsWith("d")) {
    return parseInt(durationStr) * 24 * 60 * 60 * 1000;
  }
  if (durationStr.endsWith("m")) {
    return parseInt(durationStr) * 60 * 1000;
  }
  return 15 * 60 * 1000; // fallback 15m
};

const setAuthCookies = (
  res,
  accessToken,
  refreshToken,
  accessExpiresIn,
  refreshExpiresIn,
) => {
  const cookieOptions = {
    httpOnly: true,
    secure: appConfig.isProduction,
    sameSite: "strict",
    path: "/api/", // Restrict cookies to API routes
  };

  res.cookie("access_token", accessToken, {
    ...cookieOptions,
    maxAge: parseMaxAge(accessExpiresIn),
  });

  res.cookie("refresh_token", refreshToken, {
    ...cookieOptions,
    maxAge: parseMaxAge(refreshExpiresIn),
    path: "/api/v1/auth/refresh-token", // Restrict refresh token even further
  });
};

const clearAuthCookies = (res) => {
  res.clearCookie("access_token", { path: "/api/" });
  res.clearCookie("refresh_token", { path: "/api/v1/auth/refresh-token" });
};

module.exports = {
  parseMaxAge,
  setAuthCookies,
  clearAuthCookies,
};
