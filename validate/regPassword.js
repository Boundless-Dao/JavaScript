export const regPassword = (password) => {
  if (/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{10,20}$/.test(password)) {
    // 必须包含大写、小写、数字，并且长度在10-20
    return true;
  } else if (/^(?=.*[A-Z])(?=.*[a-z])(?=.*[\p{P}]).{10,20}$/.test(password)) {
    // 必须包含大写、小写、标点符号，并且长度在10-20
    return true;
  } else if (/^(?=.*[A-Z])(?=.*[a-z])(?=.*[\W_]).{10,20}$/.test(password)) {
    // 必须包含大写、小写、特殊符号，并且长度在10-20
    return true;
  } else if (/^(?=.*[a-z])(?=.*\d)(?=.*[\p{P}]).{10,20}$/.test(password)) {
    // 必须包含小写、数字、标点符号，并且长度在10-20
    return true;
  } else if (/^(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{10,20}$/.test(password)) {
    // 必须包含小写、数字、特殊符号，并且长度在10-20
    return true;
  } else if (/^(?=.*\d)(?=.*[\W_]).{10,20}$/.test(password)) {
    // 必须包含数字、特殊符号、标点符号，并且长度在10-20
    return true;
  } else {
    return false;
  }
};