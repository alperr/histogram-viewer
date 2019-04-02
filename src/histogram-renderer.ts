/// <reference path="color.ts" />
/// <reference path="histogram.ts" />

namespace HistogramRenderer
{
	export function renderRGB(h: histogram_t, isLarge: boolean = false): Array<HTMLCanvasElement>
	{
		var BAR_WIDTH = 1;
		var BAR_HEIGHT = 84;

		if (isLarge)
		{
			BAR_WIDTH = 2;
			BAR_HEIGHT = 200;
		}

		function render(channel: Float32Array, maxValue: number, color: number)
		{
			var checkerColor;
			switch (color)
			{
				case 0: checkerColor= "#733";break;
				case 1: checkerColor= "#373";break;
				case 2: checkerColor= "#337";break;
			}

			var canvas = document.createElement("canvas");
			canvas.width = 256 * BAR_WIDTH;
			canvas.height = BAR_HEIGHT;

			var x: CanvasRenderingContext2D = canvas.getContext("2d");
			drawCheckerBoard(canvas, checkerColor, "#222");

			for (var i=0;i<256;i++)
			{
				var c = i.toString(16);
				if (c.length < 2)
					c = "0" + c;

				switch (color)
				{
					case 0: x.fillStyle = "#"+c+"0000"; break;
					case 1: x.fillStyle = "#00"+c+"00"; break;
					case 2: x.fillStyle = "#0000"+c+""; break;
				}

				// var h = r[i] * canvas.height; // <- linear scaled bars
				var h = Math.pow((channel[i] / maxValue), 0.3) * canvas.height;
				x.fillRect(i*BAR_WIDTH, canvas.height - h,BAR_WIDTH,h);
			}
	
			return canvas;
		}

		return [
			render(h.rgb.r, h.rgb.maxR, 0),
			render(h.rgb.g, h.rgb.maxG, 1),
			render(h.rgb.b, h.rgb.maxB, 2)
		]
	}

	export function renderCMYK(h: histogram_t, isLarge: boolean = false): Array<HTMLCanvasElement>
	{
		var BAR_WIDTH = 1;
		var BAR_HEIGHT = 84;

		if (isLarge)
		{
			BAR_WIDTH = 2;
			BAR_HEIGHT = 200;
		}

		function render(channel: Float32Array, maxValue: number, color: number)
		{
			var  bgColor;

			switch (color)
			{
				case 0: bgColor= "#ccffff";break;
				case 1: bgColor= "#ffccff";break;
				case 2: bgColor= "#dddd88";break;
				case 3: bgColor= "#aaaaaa";break;
			}

			var limit = 256;
			var canvas = document.createElement("canvas");
			
			if (color == 3)
			{
				BAR_WIDTH *= 2;
				limit = 100;
			}
			
			canvas.width = limit * BAR_WIDTH;
			canvas.height = BAR_HEIGHT;
	
			var x: CanvasRenderingContext2D = canvas.getContext("2d");
			drawCheckerBoard(canvas, bgColor);

			for (var i=0;i<limit;i++)
			{
				var c = i.toString(16);
				if (color == 3)
				{
					c = Math.floor(i*2.56).toString(16)
				}

				if (c.length < 2)
					c = "0" + c;

				switch (color)
				{
					case 0: x.fillStyle = "#00"+c+c+"ff"; break;
					case 1: x.fillStyle = "#"+c+"00"+c+"ff"; break;
					case 2: x.fillStyle = "#"+c+c+"00ff"; break;
					case 3: x.fillStyle = "#"+c+c+c+"ff"; break;
				}

				// var h = r[i] * canvas.height; // <- linear scaled bars
				var h = Math.pow((channel[i] / maxValue), 0.3) * canvas.height;
				x.fillRect(i*BAR_WIDTH, canvas.height - h,BAR_WIDTH,h);
			}

			return canvas;
		}

		return [
			render(h.cmyk.c, h.cmyk.maxC, 0),
			render(h.cmyk.m, h.cmyk.maxM, 1),
			render(h.cmyk.y, h.cmyk.maxY, 2),
			render(h.cmyk.k, h.cmyk.maxK, 3)
		]
	}

	export function renderHSL(h: histogram_t, isLarge: boolean = false): Array<HTMLCanvasElement>
	{
		var BAR_WIDTH = 1;
		var BAR_HEIGHT = 84;

		if (isLarge)
		{
			BAR_WIDTH = 2;
			BAR_HEIGHT = 200;
		}

		function render(channel: Float32Array, maxValue: number, color: number)
		{
			var checkerColor, limit;
			var bgColor = "#fff";

			var MULTIPLIER = 3;
			
			switch (color)
			{
				case 0: checkerColor= "#aa4"; bgColor = "#220"; limit = 360; MULTIPLIER = 1; break;
				case 1: checkerColor= "#aaaaaa"; limit = 100; break;
				case 2: checkerColor= "#aaaaaa"; limit = 100; break;
			}

			var canvas = document.createElement("canvas");
			canvas.width = limit * BAR_WIDTH * MULTIPLIER;
			canvas.height = BAR_HEIGHT;

			var x: CanvasRenderingContext2D = canvas.getContext("2d");
			drawCheckerBoard(canvas, checkerColor, bgColor);

			for (var i=0;i<limit;i++)
			{
				switch (color)
				{
	
					case 0: 
					var rgb = Color.hsl2Rgb(i, 100, 50);
					x.fillStyle = "rgb("+rgb[0]+","+rgb[1]+","+rgb[2]+")";
					break;

					case 1: 
					var rgb = Color.hsl2Rgb(330, i, 50);
					x.fillStyle = "rgb("+rgb[0]+","+rgb[1]+","+rgb[2]+")";
					break;

					case 2: 
					var rgb = Color.hsl2Rgb(0, 0, i);
					x.fillStyle = "rgb("+rgb[0]+","+rgb[1]+","+rgb[2]+")";
					break;	
				}
				
				var h = Math.pow((channel[i] / maxValue), 0.3) * canvas.height;
				x.fillRect(i*BAR_WIDTH * MULTIPLIER, canvas.height - h,BAR_WIDTH * MULTIPLIER,h);
			}
	
			return canvas;
		}

		return [
			render(h.hsl.h, h.hsl.maxH, 0),
			render(h.hsl.s, h.hsl.maxS, 1),
			render(h.hsl.l, h.hsl.maxL, 2),
		]
	}

	function drawCheckerBoard(canvas: HTMLCanvasElement, checkerColor: string, bg: string = "#fff")
	{
		var CHECKER_SIZE = 6;
		var ctx: CanvasRenderingContext2D = canvas.getContext("2d");
		ctx.fillStyle = bg;
		ctx.fillRect(0,0,canvas.width,canvas.height);

		var x = canvas.width / CHECKER_SIZE;
		var y = canvas.height / CHECKER_SIZE;

		ctx.fillStyle = checkerColor;
		for (var i=0;i<x;i=i+2)
		{
			for (var j=0;j<y;j=j+1)
			{
				
				ctx.fillRect(((j % 2) + i)*CHECKER_SIZE,j*CHECKER_SIZE,CHECKER_SIZE,CHECKER_SIZE);
			}
		}
	}
}