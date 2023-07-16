//获取cookie、
export function getCookie(name) {
  try {
    let reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (document.cookie.match(reg) !==null)
      return document.cookie.match(reg)[2];
    else
      return null;
  } catch (e){
    return null;
  }

}


//设置cookie,增加到vue实例方便全局调用
export function setCookie (c_name, value, expiredays) {
  const exdate = new Date();
  exdate.setDate(exdate.getDate() + expiredays);
  document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
}

//删除cookie
export function delCookie (name) {
  const exp = new Date();
  exp.setTime(exp.getTime() - 1);
  const cval = getCookie(name);
  if (cval != null)
    document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}
