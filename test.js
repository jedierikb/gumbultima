import React from 'react';

// const reverse = require( 'lodash/reverse' );
import * as _ from "https://jspm.dev/lodash@4.17.21"

export default function Button(props) {
    const huh = _.reverse( 'oh no'.split('') ).join('');
    return React.createElement("div", null, huh);
}
