namespace Color
{
	export function rgb2cmyk(r, g, b)
	{
		r /= 255, g /= 255, b /= 255;
		var k = Math.min(1-r, 1-g, 1-b);
		var c = (1 - r - k) / (1 - k);
		var m = (1 - g - k) / (1 - k);
		var y = (1 - b - k) / (1 - k);
		
		c = (c * 255) | 0;
		m = (m * 255) | 0;
		y = (y * 255) | 0;
		k = Math.round(k * 100);

		return [c, m, y, k];
	}

	export function cmyk2rgb(c, m, y, k)
	{
		c /= 255, m /= 255, y /= 255, k /= 100;
		var r = (255 * (1 - c) * (1 - k)) | 0;
		var g = (255 * (1 - m) * (1 - k)) | 0;
		var b = (255 * (1 - y) * (1 - k)) | 0;

		return [r, g, b];
	}

	export function rgb2hsl(r, g, b)
	{
		r /= 255, g /= 255, b /= 255;
		var max = Math.max(r, g, b), min = Math.min(r, g, b);
		var h, s, l = (max + min) / 2;
		if (max == min)
		{
			h = s = 0;
		}
		else
		{
			var d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

			switch (max)
			{
				case r: h = (g - b) / d + (g < b ? 6 : 0); break;
				case g: h = (b - r) / d + 2; break;
				case b: h = (r - g) / d + 4; break;
			}

			h /= 6;
		}

		h = (h * 360) | 0;
		s = (s * 100) | 0;
		l = (l * 100) | 0;
		return [h, s, l];
	}

	export function hsl2Rgb(h, s, l)
	{
		h = h / 360;
		s = s / 100;
		l = l / 100;
		function hue2rgb(p, q, t) {
			if (t < 0) t += 1;
			if (t > 1) t -= 1;
			if (t < 1/6) return p + (q - p) * 6 * t;
			if (t < 1/2) return q;
			if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
			return p;
		}
		var r, g, b;

		if (s == 0)
		{
			r = g = b = l;
		}
		else
		{
			var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
			var p = 2 * l - q;
			r = hue2rgb(p, q, h + 1/3);
			g = hue2rgb(p, q, h);
			b = hue2rgb(p, q, h - 1/3);
		}

		return [ r * 255, g * 255, b * 255 ];
	}

	// !!TODO add YUV
}