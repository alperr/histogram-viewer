/// <reference path="../../src/component.ts" />
/// <reference path="../../src/histogram.ts" />
/// <reference path="../../src/histogram-renderer.ts" />
/// <reference path="../../src/util.ts" />
/// <reference path="../../src/canvas-util.ts" />
/// <reference path="../../src/globals.ts" />
/// <reference path="../big-histogram/big-histogram.ts" />

class Application extends Component
{
	private canvas: HTMLCanvasElement;
	private fileInput: HTMLInputElement;
	private img: HTMLImageElement;
	private downloadButton: HTMLElement;
	constructor(root: Element, options?: Object)
	{
		super(root, MARKUP_APPLICATION);
		this.img = (<any>this.find("image"));
		this.loadImage("i2.jpg");

		this.canvas = <any>this.find("canvas");
		this.fileInput = <HTMLInputElement>this.find("file")
		this.fileInput.onchange = this.onfileselect;
		this.find("image-selector").onclick = this.onselectorclick;

		var buttons = this.querySelectorAll(".button");
		for (var i=0;i<buttons.length;i++)
			Util.assignClick(buttons[i], this.onhistogramclick);

		new BigHistogram(this.find("big-histogram-container"));
		this.downloadButton = this.find("download");
		this.downloadButton.onclick = this.ondownload;

		Util.listen("histogram-clicked", this.render);
	}

	private ondownload = ()=>
	{
		var c = document.createElement("canvas");
		c.width = GLOBALS.bitmap.width;
		c.height = GLOBALS.bitmap.height;		
		switch(GLOBALS.clickedHistogram)
		{
			case "r" : CanvasUtil.drawSingleChannel(c, GLOBALS.bitmap, 0); break;
			case "g" : CanvasUtil.drawSingleChannel(c, GLOBALS.bitmap, 1); break;
			case "b" : CanvasUtil.drawSingleChannel(c, GLOBALS.bitmap, 2); break;
			case "c" : CanvasUtil.drawSingleCMYKChannel(c, GLOBALS.bitmap, 0); break;
			case "m" : CanvasUtil.drawSingleCMYKChannel(c, GLOBALS.bitmap, 1); break;
			case "y" : CanvasUtil.drawSingleCMYKChannel(c, GLOBALS.bitmap, 2); break;
			case "k" : CanvasUtil.drawSingleCMYKChannel(c, GLOBALS.bitmap, 3); break;
		}

		var a = document.createElement("a");
		var url = c.toDataURL("image/png").replace("image/png", "image/octet-stream");
		a.setAttribute('download', 'channel-'+GLOBALS.clickedHistogram+'.png');
		a.setAttribute("href", url);
		a.click();
	}

	private onhistogramclick = (event)=>
	{
		var e = Util.getClickedElement(event);
		GLOBALS.clickedHistogram = e.className.substr(7);
		Util.dispatchEvent("histogram-clicked");
	}

	private render = ()=>
	{
		var hide = false;
		switch(GLOBALS.clickedHistogram)
		{
			case "r" : CanvasUtil.drawSingleChannel(this.canvas, GLOBALS.scaled, 0); break;
			case "g" : CanvasUtil.drawSingleChannel(this.canvas, GLOBALS.scaled, 1); break;
			case "b" : CanvasUtil.drawSingleChannel(this.canvas, GLOBALS.scaled, 2); break;
			case "c" : CanvasUtil.drawSingleCMYKChannel(this.canvas, GLOBALS.scaled, 0); break;
			case "m" : CanvasUtil.drawSingleCMYKChannel(this.canvas, GLOBALS.scaled, 1); break;
			case "y" : CanvasUtil.drawSingleCMYKChannel(this.canvas, GLOBALS.scaled, 2); break;
			case "k" : CanvasUtil.drawSingleCMYKChannel(this.canvas, GLOBALS.scaled, 3); break;
			case "h" : hide = true; CanvasUtil.putImageData(this.canvas, GLOBALS.scaled); break;
			case "s" : hide = true; CanvasUtil.putImageData(this.canvas, GLOBALS.scaled); break;
			case "l" : hide = true; CanvasUtil.putImageData(this.canvas, GLOBALS.scaled); break;
		}

		var names = {
			"r" : "Red",
			"g" : "Green",
			"b" : "Blue",
			"c" : "Cyan",
			"y" : "Yellow",
			"m" : "Magenta",
			"k" : "Key"
		}

		if (hide)
		{
			this.downloadButton.style.display = "none";
		}
		else
		{
			this.downloadButton.innerHTML = "Download " + names[GLOBALS.clickedHistogram] + " channel as PNG";
			this.downloadButton.style.display = "block";
		}
	}

	private onfileselect = (e)=>
	{
		var fr = new FileReader();
		var self = this;
		fr.onload = function(e) {  self.loadImage(<any>this.result); };
		fr.readAsDataURL(e.target.files[0]);
	}

	private onselectorclick = ()=>
	{
		this.fileInput.click();
	}

	private appendCanvas = (q: string, canvas)=>
	{
		this.find(q).innerHTML = "";
		this.find(q).appendChild(canvas);
	}

	private loadImage(path)
	{
		this.img.src = path;
		this.img.onload = ()=>
		{
			const CANVAS_WIDTH = 500;

			var w = this.img.naturalWidth;
			var h = this.img.naturalHeight;
			var x = this.canvas.getContext("2d");
			this.canvas.width = CANVAS_WIDTH;
			this.canvas.height = CANVAS_WIDTH * h / w;
			x.drawImage(this.img, 0, 0, CANVAS_WIDTH, CANVAS_WIDTH * h / w);

			GLOBALS.scaled = x.getImageData(0, 0, this.canvas.width, this.canvas.height);
			GLOBALS.bitmap = CanvasUtil.getImageData(this.img);

			var hist =  Histogram.generate(GLOBALS.scaled);
			var canvases = HistogramRenderer.renderRGB(hist);
			
			this.appendCanvas("r", canvases[0]);
			this.appendCanvas("g", canvases[1]);
			this.appendCanvas("b", canvases[2]);

			canvases = HistogramRenderer.renderCMYK(hist);
			this.appendCanvas("c", canvases[0]);
			this.appendCanvas("m", canvases[1]);
			this.appendCanvas("y", canvases[2]);
			this.appendCanvas("k", canvases[3]);

			canvases = HistogramRenderer.renderHSL(hist);
			this.appendCanvas("h", canvases[0]);
			this.appendCanvas("s", canvases[1]);
			this.appendCanvas("l", canvases[2]);

			GLOBALS.histograms = {};
			var c = HistogramRenderer.renderRGB(hist, true);
			GLOBALS.histograms["r"] = c[0];
			GLOBALS.histograms["g"] = c[1];
			GLOBALS.histograms["b"] = c[2];
			c = HistogramRenderer.renderCMYK(hist, true);
			GLOBALS.histograms["c"] = c[0];
			GLOBALS.histograms["m"] = c[1];
			GLOBALS.histograms["y"] = c[2];
			GLOBALS.histograms["k"] = c[3];
			c = HistogramRenderer.renderHSL(hist, true);
			GLOBALS.histograms["h"] = c[0];
			GLOBALS.histograms["s"] = c[1];
			GLOBALS.histograms["l"] = c[2];

			GLOBALS.clickedHistogram = "h";
			Util.dispatchEvent("histogram-clicked");
		}
	}
}