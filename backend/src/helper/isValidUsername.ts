function isValidName(name: string) {
    // This regex matches any string of one or more characters that are not
    // lowercase letters, numbers, or underscores.
    const regex = /[^a-z0-9_]/;
  
    // If the regex matches, that means there are invalid characters in the name,
    // so we return false. If it doesn't match, the name is valid, so we return true.
    return !regex.test(name);
  }

export default isValidName;