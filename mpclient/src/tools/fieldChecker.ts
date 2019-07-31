export const usernameChecker = (name: string) => {
  let res = false;
  if (name.length > 5 && name.length < 50 && !name.includes(" ")) res = true;

  return res;
};

export const passwordChecker = (pass: string) => {
  let res = false;
  if (pass.length > 5 && pass.length < 20 && !pass.includes(" ")) res = true;

  return res;
};

export const emailChecker = (email: string) => {
  let res = false;
  if (
    email.includes("@") &&
    email.includes(".") &&
    email.length > 5 &&
    email.length < 120
    && !email.includes(' ') &&
    email.split('.')[1]
  ) {
    res = true;
  }
  return res;
};