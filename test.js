import React from 'react';

const reverse = require( 'lodash/reverse' );

export default function Button(props) {
    const huh = reverse( 'oh no'.split('') ).join('');
    return React.createElement("div", null, huh);
}
