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
    email.length < 120 &&
    !email.includes(" ") &&
    email.split(".")[1]
  ) {
    res = true;
  }
  return res;
};

export const commentChecker = (comment: string) => {
  let res = true;
  if (comment.length < 1 || comment.length > 200) res = false;
  return res;
};

export const reviewContentChecker = (content: string) => {
  let res = false;
  if (content.length >= 100 && content.length <= 1500) res = true;
  return res;
};

export const reviewTitleChecker = (title: string) => {
  let res = false;
  if (title.length >= 2 && title.length <= 50) res = true;
  return res;
};

export const searchBoxChecker = (search: string) => {
  let res = false;
  if (search.length > 2 && search.length < 100) res = true;
  return res;
};

export const alphanumericChecker = (text: string) => {
  let res = false;
  const chars = /^[0-9a-zA-Z ]*$/;
  if (text.match(chars)) res = true;
  return res;
};
