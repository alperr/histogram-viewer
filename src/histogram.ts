/// <reference path="color.ts" />

interface histogram_t
{
	rgb: rgb_histogram_t;
	hsl: hsl_histogram_t;
	cmyk: cmyk_histogram_t;
}

interface rgb_histogram_t
{
	r: Float32Array;
	g: Float32Array;
	b: Float32Array;
	maxR: number;
	maxG: number;
	maxB: number;
}

interface hsl_histogram_t
{
	h: Float32Array;
	s: Float32Array;
	l: Float32Array;
	maxH: number;
	maxS: number;
	maxL: number;	
}

interface cmyk_histogram_t
{
	c: Float32Array;
	m: Float32Array;
	y: Float32Array;
	k: Float32Array;
	maxC: number;
	maxM: number;
	maxY: number;
	maxK: number;
}

namespace Histogram
{
	export function generate(d: ImageData): histogram_t
	{
		var rgb: rgb_histogram_t = {
			"r" : new Float32Array(256),
			"g" : new Float32Array(256),
			"b" : new Float32Array(256),
			"maxR" : 0,
			"maxG" : 0,
			"maxB" : 0
		};

		var hsl: hsl_histogram_t = {
			"h" : new Float32Array(360),
			"s" : new Float32Array(100),
			"l" : new Float32Array(100),
			"maxH" : 0,
			"maxS" : 0,
			"maxL" : 0
		};

		var cmyk: cmyk_histogram_t = {
			"c" : new Float32Array(256),
			"m" : new Float32Array(256),
			"y" : new Float32Array(256),
			"k" : new Float32Array(100),
			"maxC" : 0,
			"maxM" : 0,
			"maxY" : 0,
			"maxK" : 0
		};

		var arr = d.data;
		for (var i=0;i<arr.length;i=i+4)
		{
			rgb.r[arr[  i  ]]++;
			rgb.g[arr[i + 1]]++;
			rgb.b[arr[i + 2]]++;

			var hslPixel = Color.rgb2hsl(arr[i], arr[i+1], arr[i+2]);
			hsl.h[hslPixel[0]]++;
			hsl.s[hslPixel[1]]++;
			hsl.l[hslPixel[2]]++;

			var cmykPixel = Color.rgb2cmyk(arr[i], arr[i+1], arr[i+2]);
			cmyk.c[cmykPixel[0]]++;
			cmyk.m[cmykPixel[1]]++;
			cmyk.y[cmykPixel[2]]++;
			cmyk.k[cmykPixel[3]]++;
		}

		for (var i=0;i<256;i++)
		{
			if (rgb.r[i] > rgb.maxR) rgb.maxR = rgb.r[i];
			if (rgb.g[i] > rgb.maxG) rgb.maxG = rgb.g[i];
			if (rgb.b[i] > rgb.maxB) rgb.maxB = rgb.b[i];

			if (hsl.h[i] > hsl.maxH) hsl.maxH = hsl.h[i];
			if (hsl.s[i] > hsl.maxS) hsl.maxS = hsl.s[i];
			if (hsl.l[i] > hsl.maxL) hsl.maxL = hsl.l[i];

			if (cmyk.c[i] > cmyk.maxC) cmyk.maxC = cmyk.c[i];
			if (cmyk.m[i] > cmyk.maxM) cmyk.maxM = cmyk.m[i];
			if (cmyk.y[i] > cmyk.maxY) cmyk.maxY = cmyk.y[i];
			if (cmyk.k[i] > cmyk.maxK) cmyk.maxK = cmyk.k[i];
		}

		return {
			"rgb" : rgb,
			"hsl" : hsl,
			"cmyk" : cmyk
		}
	}
}