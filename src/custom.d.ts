declare module '*.scss' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module 'react-scroll-component' {
  // eslint-disable-next-line no-undef
  export default Scroll;
}
