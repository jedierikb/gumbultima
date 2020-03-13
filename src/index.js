import React, {
  useState,
  useEffect
} from 'react';

import styled from 'styled-components';

const ReactDOM = require('react-dom');

const TesterStyled = styled.div`
  background-color: green; //natch
  width: 50px;
  height: 50px;
  position: absolute;
`;

const GumbultimaEditor = function( ) {
	return <TesterStyled/>;
}

ReactDOM.render( 
  <GumbultimaEditor/>, document.getElementById('app') );