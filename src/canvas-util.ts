/// <reference path="color.ts" />

namespace CanvasUtil
{

	export function putImageData(canvas: HTMLCanvasElement, data: ImageData)
	{
		var x = canvas.getContext("2d");
		x.putImageData(data, 0, 0);
	}

	export function getImageData(img: HTMLImageElement): ImageData
	{
		var w = img.naturalWidth;
		var h = img.naturalHeight;
		var canvas = document.createElement("canvas");
		var x = canvas.getContext("2d");
		canvas.width = w;
		canvas.height = h;
		x.drawImage(img, 0, 0, w, h);
		return x.getImageData(0, 0, w, h);
	}

	// index = 0 for red, index = 1 for green, index = 2 for blue
	export function drawSingleChannel(canvas: HTMLCanvasElement, data: ImageData, index: number)
	{
		var s = data.width * data.height * 4;
		var r = new ImageData(data.width, data.height)
		for (var i=0;i<s;i=i+4)
		{
			r.data[i + index] = data.data[i + index];
			r.data[i + 3] = 255;
		}
		
		var x = canvas.getContext("2d");
		x.putImageData(r, 0, 0);
	}

	export function drawSingleCMYKChannel(canvas: HTMLCanvasElement, data: ImageData, index: number)
	{
		var s = data.width * data.height * 4;
		var r = new ImageData(data.width, data.height);

		for (var i=0;i<s;i=i+4)
		{
			var cmyk = Color.rgb2cmyk(data.data[i], data.data[i+1], data.data[i+2]);
			
			var rgb;

			if (index == 0)
				rgb = Color.cmyk2rgb(cmyk[0], 0, 0, 0);
			else if (index == 1)
				rgb = Color.cmyk2rgb(0, cmyk[1], 0, 0);
			else if (index == 2)
				rgb = Color.cmyk2rgb(0, 0, cmyk[2], 0);
			else if (index == 3)
				rgb = Color.cmyk2rgb(0, 0, 0, cmyk[3]);
			r.data[  i  ] = rgb[0];
			r.data[i + 1] = rgb[1];
			r.data[i + 2] = rgb[2];
			r.data[i + 3] = 255;
		}

		var x = canvas.getContext("2d");
		x.putImageData(r, 0, 0);
	}
}