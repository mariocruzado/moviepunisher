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