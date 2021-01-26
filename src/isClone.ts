const isClone = (): boolean =>
  /^(www\.)?betolimp.com$/.test(window.location.hostname);

export default isClone;
