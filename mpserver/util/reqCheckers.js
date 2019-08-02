const checker = {};

//User Fields
checker.checkPassword = pass => {
  let res = false;
  if (pass.length > 5 && pass.length < 20 && !pass.includes(" ")) res = true;

  return res;
};

checker.checkUserName = name => {
  let res = false;
  if (name.length > 5 && name.length < 40 && !name.includes(".")) res = true;

  return res;
};

checker.checkEmail = email => {
  let res = false;
  if (
    email.length > 10 &&
    email.length < 120 &&
    email.includes("@") &&
    email.split("@")[0].length > 1
  )
    res = true;
  return res;
};

checker.checkProfileId = id => {
  let res = false;
  if (!isNaN(id) && id > 0 && id < 6) res = true;

  return res;
};

//Reviews Fields
checker.checkReviewContent = content => {
  let res = false;
  if (content.length < 600) res = true;
  return res;
};

checker.checkReviewTitle = title => {
  let res = false;
  if (title.length > 6 && title.length < 100) res = true;
  return res;
};

checker.checkReviewRating = rating => {
  let res = false;
  if (!isNaN(rating) && rating > 0 && rating <= 5) res = true;
  return res;
};

//Comment Fields

checker.checkComment = content => {
  let res = false;
  if (content.length > 2 && content.length < 255) res = true;
  return res;
};

module.exports = checker;
