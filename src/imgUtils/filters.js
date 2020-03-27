
const clamp = require('lodash/clamp');

export function posterize(srcImageData, levels) {
  const srcPixels    = srcImageData.data;
  const srcWidth     = srcImageData.width;
  const srcHeight    = srcImageData.height;
  const dstImageData = new ImageData( srcWidth, srcHeight );
  const dstPixels    = dstImageData.data;

  const clampedLevels = clamp( levels, 2, 255 );

  const levelMap = [];
  const clampedLevelsMinus1 = clampedLevels - 1;
  for (let i = 0; i < clampedLevels; i += 1) {
    levelMap[i] = (255 * i) / clampedLevelsMinus1;
  }

  let j = 0;
  let k = 0;
  mapRGB(srcPixels, dstPixels, function (value) {
    const ret = levelMap[j];
    k += levels;
    if (k > 255) {
      k -= 255;
      j += 1;
    }
    return ret;
  });

  return dstImageData;
};

export function pixelate( imgData, imgW, imgH, scale ) {
  const imgWidth = imgW;
  const imgHeight = imgH;
  const scaledWidth = imgWidth * scale;
  const scaledHeight = imgHeight * scale;

  const [img, itx] = createCanvas( imgW, imgH );
  itx.putImageData( imgData, 0, 0 );

  const [buffer, btx] = createCanvas( scaledWidth, scaledHeight );
  pixelateContext( btx );
  btx.drawImage( img, 0, 0, scaledWidth, scaledHeight );

  const [cuffer, ctx] = createCanvas( imgWidth, imgHeight );
  pixelateContext( ctx );
  ctx.drawImage( buffer, 0, 0, scaledWidth, scaledHeight, 0, 0, imgWidth, imgHeight );
  return ctx.getImageData( 0, 0, imgWidth, imgHeight );
}

export function replaceColors( byteArray, colorRemoveReplaces ) {
  for (let i = 0; i < byteArray.length; i += 4) {
    const r = byteArray[ i ];
    const g = byteArray[ i+1 ];
    const b = byteArray[ i+2 ];
    const a = byteArray[ i+3 ];

    for (const removeReplace of colorRemoveReplaces) {
      const removeRGBA = removeReplace[0];
      const replaceRGBA = removeReplace[1];

      if( r === removeRGBA.r && 
          g === removeRGBA.g && 
          b === removeRGBA.b &&
          a === removeRGBA.a ) {

        byteArray[i] = replaceRGBA.r;
        byteArray[i+1] = replaceRGBA.g;
        byteArray[i+2] = replaceRGBA.b;
        byteArray[i+3] = replaceRGBA.a;
      
      }
    }
  }
}

//ok, so... take in a byte array.
//make transparent everything that has alphaReplaces
//everything else, we need to sample the pixel at that pt in the colorReference.
//then use the colorReplaceList to replace that image in our byteArray
export function automagicReplaceColors( 
  byteArray, colorRemoveReplaces, refByteArray, colorReplaceList ) {

  for (let i = 0; i < byteArray.length; i += 4) {
    const ir = i;
    const ig = i+1;
    const ib = i+2;
    const ia = i+3;
    const r = byteArray[ ir ];
    const g = byteArray[ ig ];
    const b = byteArray[ ib ];
    const a = byteArray[ ia ];

    let replaced = false;
    for (const removeReplace of colorRemoveReplaces) {
      const removeRGBA = removeReplace[0];
      const replaceRGBA = removeReplace[1];

      if( r === removeRGBA.r && 
          g === removeRGBA.g && 
          b === removeRGBA.b &&
          a === removeRGBA.a ) {

        byteArray[ir] = replaceRGBA.r;
        byteArray[ig] = replaceRGBA.g;
        byteArray[ib] = replaceRGBA.b;
        byteArray[ia] = replaceRGBA.a;
        replaced = true;
        break;
      }
    }

    if (!replaced) {
      const refR = refByteArray[ir];
      const refG = refByteArray[ig];
      const refB = refByteArray[ib];

      const remapRGB = mapColorToPalette( refR, refG, refB, colorReplaceList );
      byteArray[ir] = remapRGB.r;
      byteArray[ig] = remapRGB.g;
      byteArray[ib] = remapRGB.b;

    }

  }

}

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length === 1 ? "0" + hex : hex;
}

export function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

export function hexToRgb(hex) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
    return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function mapColorToPalette( red, green, blue, palette ) {

    var mappedColor;
    let distance = Number.POSITIVE_INFINITY;
    for(var i=0; i<palette.length; i++){
      const color = palette[i];
      const diffR = color.r - red;
      const diffG = color.g - green;
      const diffB = color.b - blue;
      const diffDistance = diffR*diffR + diffG*diffG + diffB*diffB;
      if ( diffDistance < distance  ) { 
        distance = diffDistance; 
        mappedColor = palette[i]; 
      };
    }
    return mappedColor;
}
function createCanvas( w, h ) {
  const buffer = document.createElement('canvas');
  const btx = buffer.getContext('2d');
  buffer.width = w;
  buffer.height = h;
  return [buffer, btx];
}

function pixelateContext( btx ) {
  btx.mozImageSmoothingEnabled = false;
  btx.webkitImageSmoothingEnabled = false;
  btx.imageSmoothingEnabled = false;
}


function buildMap( f ) {
  for (var m = [], k = 0, v; k < 256; k += 1) {
    m[k] = (v = f(k)) > 255 ? 255 : v < 0 ? 0 : v | 0;
  }
  return m;
}

function applyMap( src, dst, map ) {
  for (var i = 0, l = src.length; i < l; i += 4) {
    dst[i]     = map[src[i]];
    dst[i + 1] = map[src[i + 1]];
    dst[i + 2] = map[src[i + 2]];
    dst[i + 3] = src[i + 3];
  }
}

function mapRGB( src, dst, func ) {
  applyMap(src, dst, buildMap(func));
}