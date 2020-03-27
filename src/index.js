import React, {
  useState,
  useRef,
  useCallback,
  useEffect
} from 'react';


import {
  // posterize,
  pixelate,
  replaceColors,
  automagicReplaceColors,
  rgbToHex,
  hexToRgb
} from './imgUtils/filters';

import {
  placeWidth,
  placeHeight
} from './constants';

import {
  ImageCropper
} from 'image-cropper';

import pSBC from 'shade-blend-color';

import styled from 'styled-components';
import {
  useDropzone
} from 'react-dropzone'

import workerCanny from 'workerize-loader!canny-edge-detector-worker'; // eslint-disable-line import/no-webpack-loader-syntax

import ColorThief from 'colorthief';


const p1 = [
'#292418',
'#524839',
'#73654a',
'#8b7d62',
'#a48d6a',
'#bda583',
'#cdba94',
'#e6ceac'
].map( (i) => hexToRgb(i) );

const p2 = [
'#f4f5ef',
'#f8c7a4',
'#e784a8',
'#bb9a3e',
'#c8dbdf',
'#d74d4c',
'#a65d35',
'#35884e',
'#962f2c',
'#682d2c',
'#85dfeb',
'#1b4c5a',
'#191023',
'#72adee',
'#435edb',
'#322d4d',
].map( (i) => hexToRgb(i) );

const p3 = [
'#25131a',
'#3d253b',
'#523b40',
'#1f3736',
'#2a5a39',
'#427f3b',
'#80a53f',
'#bbc44e',
'#96c641',
'#ccf61f',
'#8a961f',
'#5c6b53',
'#895a45',
'#d1851e',
'#ffd569',
'#bf704d',
'#e1a171',
'#e6deca',
'#9b4c51',
'#802954',
'#d01946',
'#e84444',
'#40369f',
'#7144ff',
'#af69bf',
'#eaa5ff',
'#5880cc',
'#62abd4',
'#9bf0fd',
'#cae6f5',
'#ffffff',
'#a7acba',
'#606060',
'#56587b',
'#9a8571',
'#dfbbb3'].map( (i) => hexToRgb(i) );

const p4 = [
'#000000',
'#6f6776',
'#9a9a97',
'#c5ccb8',
'#8b5580',
'#c38890',
'#a593a5',
'#666092',
'#9a4f50',
'#c28d75',
'#7ca1c0',
'#416aa3',
'#8d6268',
'#be955c',
'#68aca9',
'#387080',
'#6e6962',
'#93a167',
'#6eaa78',
'#557064',
'#9d9f7f',
'#7e9e99',
'#5d6872',
'#433455'
].map( (i) => hexToRgb(i) );

// var imgSrcData;
// var pixImgData;
// var $p;

//   const $d = document.createElement('canvas');
//   const $k = document.createElement('div');
//   document.body.appendChild( $k );

// // Attach an event listener to receive calculations from your worker
// c.addEventListener('message', (message) => {
//   if (message.data.type === 'cannied') {
//     const msgData = message.data.data;
//     const ay8 = new Uint8ClampedArray( msgData );
//     const imgData = new ImageData( ay8, 1000, 758 );

//     //return as alpha channel
//     // replaceColors( imgData.data, [
//     //     [{r:0, g:0, b:0, a:255}, {r:0, g:0, b:0, a:0}],
//     //     [{r:255, g:255, b:255, a:255}, {r:0, g:0, b:0, a:255}]
//     //   ]
//     // );

//     const colorPalette = ct.getPalette(img)
//     .map( (v) => {
//       const hex = rgbToHex( v[0], v[1], v[2] );
//       const convHex = pSBC( -.75, hex );
//       const convRgb = hexToRgb( convHex );
//       return convRgb;
//     });


//     automagicReplaceColors(
//       imgData.data, 
//       [[{r:0, g:0, b:0, a:255}, {r:0, g:0, b:0, a:0}]],
//       imgSrcData.data,
//       colorPalette
//     );

//     const pData = pixelate( imgData, 1000, 758, 0.2 );


//     //now... convert to pixel art!
//     automagicReplaceColors( pData.data, [], pData.data, pa3 );
//     automagicReplaceColors( pixImgData.data, [], pixImgData.data, pa3 );

//     $d
//     .getContext('2d')
//     .putImageData( pData, 0, 0);

//     $p
//     .getContext('2d')
//     .putImageData( pixImgData, 0, 0 );

//   }
// });

// var img = document.createElement('img');
// img.src = room1;
// // $k.appendChild( img );
// img.onload = function( ) {
//   const imgWidth = img.width;
//   const imgHeight = img.height;

//   $d.width = imgWidth;
//   $d.height = imgHeight;
//   $d.style = 'position:absolute;'


//   imgSrcData = getImageData( img, imgWidth, imgHeight );
//   // posterImgData = posterize( imgData, 4 );

//   $d
//   .getContext('2d')
//   .putImageData( imgSrcData, 0, 0);

//   pixImgData = pixelate( imgSrcData, imgWidth, imgHeight, 0.2 );
//   $p = document.createElement('canvas');
//   $p.style = 'position:absolute';
//   $p.width = imgWidth;
//   $p.height = imgHeight;
//   const ktx = $p.getContext('2d');
//   ktx.putImageData( pixImgData, 0, 0 );

//   $k.appendChild( $p );
//   $k.appendChild( $d );

//   const imgBuffer = imgSrcData.data;
//   c.cannyWorker( imgWidth, imgHeight, imgBuffer, 0.3, 0.35 );
// }


// function getImageData( img, imgWidth, imgHeight ) {
//   const canvas = document.createElement('canvas');
//   canvas.width = imgWidth;
//   canvas.height = imgHeight;
//   const context = canvas.getContext('2d');
//   context.drawImage( img, 0, 0 );
//   return context.getImageData( 0, 0, imgWidth, imgHeight );
// }


const ReactDOM = require('react-dom');


const ImageDropZone = styled.div`

  width: ${placeWidth}px;
  height: ${placeHeight}px;
  top: 0;
  left: 0;

  display: flex;
  justify-content: center;
  align-items: center;

  ${props => {
    if (props.isDragActive) {
      if (props.isDragAccept) {
        return 'border: solid #0f0 1px';
      }
      else {
        return 'border: solid #f00 1px';
      }
    }
    else {
      return 'border: solid #000 1px';
    }
  }};
`;

const DropWrap = styled.div`
  position: relative;
  width: ${ placeWidth }px;
  height: ${ placeHeight }px;
`;

const DroppedImageCanvas = styled.canvas`
  width: ${ placeWidth }px;
  height: ${ placeHeight }px;
  height: 100%;
  position: absolute;
  background-color: red;

  display: ${props => props.visible ? 'block' : 'none'};
`;

const ps = {
  "1": p1,
  "2": p2,
  "3": p3,
  "4": p4
};
const mimeTypes = ['image/jpeg', 'image/png' ];
const GumbultimaEditor = function( ) {

  const [imageFile, setImageFile] = useState( null );

  const [completeCrop, setCompleteCrop] = useState( false );

  const [fakeState, setFakeState] = useState( true );

  const srcImgCvs = useRef( document.createElement('canvas') );
  const dropImgCvs = useRef( null );
  const wc = useRef( null );

  const [cannyImgData, setCannyImgData] = useState( null );

  const pixelArtPalette = useRef( '1' );
  const drawLines = useRef( true );

  useEffect( () => {
    wc.current = workerCanny();
    wc.current.addEventListener('message', (message) => {
      if (message.data.type === 'cannied') {

        setCannyImgData( message.data );

        // //we will need these
        // const dvs = dropImgCvs.current;
        // const dtx = dvs.getContext('2d');

        // // //let's begin by getting our color palette from the existing img
        // // const ct = new ColorThief();
        // // const colorPalette = ct.getPalette( img )
        // // .map( (v) => {
        // //   const hex = rgbToHex( v[0], v[1], v[2] );
        // //   const convHex = pSBC( -.75, hex );
        // //   const convRgb = hexToRgb( convHex );
        // //   return convRgb;
        // // });

        // //get the canny line data img
        // const msgData = message.data.data;
        // const ay8 = new Uint8ClampedArray( msgData );
        // const imgData = new ImageData( ay8, placeWidth, placeHeight );

        // // remove the black, replace with alpha channel
        // replaceColors( imgData.data, [
        //     [{r:0, g:0, b:0, a:255}, {r:0, g:0, b:0, a:0}],
        //     [{r:255, g:255, b:255, a:255}, {r:0, g:0, b:0, a:255}]
        //   ]
        // );

        // //paint lines on top of image
        // const pixImgData = pixelate( imgData, placeWidth, placeHeight, 0.2 );
        // const pixImg = document.createElement('canvas');
        // pixImg.width = placeWidth;
        // pixImg.height = placeHeight;
        // pixImg.getContext('2d').putImageData( pixImgData, 0, 0 );
        // dtx.drawImage( pixImg, 0, 0 );

        // //convert whole image to pixelArtColors
        // const dtxImgData = dtx.getImageData( 0, 0, placeWidth, placeHeight );
        // automagicReplaceColors( dtxImgData.data, [], dtxImgData.data, pixelArtPalette2 );
        // dtx.putImageData( dtxImgData, 0, 0 );


        // // const colorPalette = ct.getPalette(img)
        // // .map( (v) => {
        // //   const hex = rgbToHex( v[0], v[1], v[2] );
        // //   const convHex = pSBC( -.75, hex );
        // //   const convRgb = hexToRgb( convHex );
        // //   return convRgb;
        // // });


      }
    });
  }, [] );

  const finalizeImage = useCallback( () => {
    if (!cannyImgData) {
      return;
    }

    const dvs = dropImgCvs.current;
    const dtx = dvs.getContext('2d');

    const svs = srcImgCvs.current;
    const stx = svs.getContext('2d');

    const srcImgData = stx.getImageData( 0, 0, placeWidth, placeHeight );
    
    const pixImgData = pixelate( srcImgData, placeWidth, placeHeight, 0.2 );
    dtx.putImageData( pixImgData, 0, 0 );


    if (drawLines.current) {
      //get the canny line data img
      const msgData = cannyImgData.data;
      const ay8 = new Uint8ClampedArray( msgData );
      const imgData = new ImageData( ay8, placeWidth, placeHeight );

      // remove the black, replace with alpha channel
      replaceColors( imgData.data, [
          [{r:0, g:0, b:0, a:255}, {r:0, g:0, b:0, a:0}],
          [{r:255, g:255, b:255, a:255}, {r:0, g:0, b:0, a:255}]
        ]
      );

      //paint lines on top of image
      const pixImgData = pixelate( imgData, placeWidth, placeHeight, 0.2 );
      const pixImg = document.createElement('canvas');
      pixImg.width = placeWidth;
      pixImg.height = placeHeight;
      pixImg.getContext('2d').putImageData( pixImgData, 0, 0 );
      dtx.drawImage( pixImg, 0, 0 );
    }

    //convert whole image to pixelArtColors
    const dtxImgData = dtx.getImageData( 0, 0, placeWidth, placeHeight );
    automagicReplaceColors( 
      dtxImgData.data, [], dtxImgData.data, ps[pixelArtPalette.current] );
    dtx.putImageData( dtxImgData, 0, 0 );

  }, [cannyImgData, pixelArtPalette, drawLines] );

  useEffect( () => {
    finalizeImage( );
  }, [cannyImgData, pixelArtPalette, finalizeImage, drawLines] );

  const buttonClickCb = function( ) {
    setCompleteCrop( true );
  }

  const linesButtonClickCb = function( ) {
    drawLines.current = !drawLines.current;
    finalizeImage();
  }

  const handleChange = function( e ) {
    pixelArtPalette.current = e.target.value;
    finalizeImage();
    setFakeState( !fakeState );
  }

  const onCompleteCrop = function( cvs, ctx ) {
    setImageFile( null );
    setCompleteCrop( false );

    const data = ctx.getImageData( 0, 0, cvs.width, cvs.height );

    srcImgCvs.current.width = placeWidth;
    srcImgCvs.current.height = placeHeight;
    const srcImgCtx = srcImgCvs.current.getContext('2d');
    srcImgCtx.putImageData( data, 0, 0 );

    wc.current.cannyWorker( cvs.width, cvs.height, data.data, 0.3, 0.35 );
  }


  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone( {
    onDrop: acceptedFiles => {
      for (const acceptedFile of acceptedFiles) {
        setImageFile( acceptedFile );
        console.log( 'setImageFile', acceptedFile );
      }
    },
    accept: mimeTypes.join(', '),
    noClick: true
  } );

  return (
    <div>
      <DropWrap>
        <ImageDropZone 
          isDragAccept={ isDragAccept }
          isDragReject={ isDragReject }
          isDragActive={ isDragActive }
          {...getRootProps()}
        >
          <input 
            {...getInputProps()}
          />
          {
            imageFile &&
            <ImageCropper
              dimensionsRequired={ [placeWidth, placeHeight] }
              imageFile={ imageFile }
              completeCrop={ completeCrop }
              onCompleteCrop={ onCompleteCrop }
              aspectRatio={ placeWidth/placeHeight }
            />
          }
            <DroppedImageCanvas
              ref={ dropImgCvs }
              visible={ !imageFile }
              width={ placeWidth }
              height={ placeHeight }
            />
        </ImageDropZone>
      </DropWrap>
      <input type="button" onClick={buttonClickCb} value="pix!"/>

      <input type="button" onClick={linesButtonClickCb} value="lines"/>
      <select value={ pixelArtPalette.current } onChange={handleChange}>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
      </select>
    </div>
  )
}

ReactDOM.render( 
  <GumbultimaEditor/>, document.getElementById('app') );