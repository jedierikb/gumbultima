// import React from 'react';

// export default function Button(props) {
//     return React.createElement("div", null, 'huh');
// }


import{jsx as r}from"react/jsx-runtime";function t(r){var e,n,o="";if("string"==typeof r||"number"==typeof r)o+=r;else if("object"==typeof r)if(Array.isArray(r))for(e=0;e<r.length;e++)r[e]&&(n=t(r[e]))&&(o&&(o+=" "),o+=n);else for(e in r)r[e]&&(o&&(o+=" "),o+=e);return o}function e(){for(var r,e,n=0,o="";n<arguments.length;)(r=arguments[n++])&&(e=t(r))&&(o&&(o+=" "),o+=e);return o}var n=function(t){var n=t.text;return r("a",{className:e("bg-crimson","text-white","h-36","w-36","rounded-full","flex","items-center justify-center","shadow-noButtonCrimson","hover:shadow-buttonCrimson","transition-shadow ease-bop duration-300","cursor-pointer"),children:n})};export{n as RoundButton};
//# sourceMappingURL=cds.js.map
