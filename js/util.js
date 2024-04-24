function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  const expires = `expires=${d.toUTCString()}`;
  // document.cookie = `${cname}=${cvalue};${expires};path=/`; //esto da error de samesite???
  document.cookie = `${cname}=${cvalue};${expires};path=/;SameSite=None;Secure`;
}

function getCookie(cname) {
  const re = new RegExp(`(?:(?:^|.*;\\s*)${cname}\\s*\\=\\s*([^;]*).*$)|^.*$`);
  return document.cookie.replace(re, "$1");
}
export { setCookie, getCookie }; //getCookie("name") setCookie("name", "value", 30)
