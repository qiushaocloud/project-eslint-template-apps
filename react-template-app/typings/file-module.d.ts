declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.ttf'
// declare module '*.module.less' {
//     const classes: { readonly [key: string]: string };
//     export default classes;
// }
// declare module '*.module.scss' {
//     const classes: { readonly [key: string]: string };
//     export default classes;
// }
// declare module '*.module.sass' {
//     const classes: { readonly [key: string]: string };
//     export default classes;
// }

declare module '*.module.css' {
    const classes: { [key: string]: string };
    export default classes;
  }

  declare module '*.module.scss' {
    const classes: { [key: string]: string };
    export default classes;
  }

  declare module '*.module.sass' {
    const classes: { [key: string]: string };
    export default classes;
  }

  declare module '*.module.less' {
    const classes: { [key: string]: string };
    export default classes;
  }

  declare module '*.module.styl' {
    const classes: { [key: string]: string };
    export default classes;
  }

declare module '*.less'
declare module '*.scss'
declare module '*.sass'