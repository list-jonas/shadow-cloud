const baseUrl = () => {
  if (window.location.protocol && window.location.host) {
    if (`${window.location.protocol}//${window.location.host}` == "http://localhost:3001") {
      return "http://localhost:3000"
    }
    return `${window.location.protocol}//${window.location.host}`;
  }
  return "http://danl.ddns.net";
}
export default {
  baseUrl
}