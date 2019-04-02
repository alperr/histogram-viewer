/// <reference path="../../src/component.ts" />
/// <reference path="../../src/util.ts" />
/// <reference path="../../src/globals.ts" />

class BigHistogram extends Component
{
	private container: HTMLElement;
	constructor(root: Element)
	{
		super(root, MARKUP_BIG_HISTOGRAM);
		this.container = this.find("canvas-container");
		Util.listen("histogram-clicked", this.onhistogramclicked);
	}

	private onhistogramclicked = ()=>
	{
		var c = GLOBALS.histograms[GLOBALS.clickedHistogram];
		this.find("big-histogram").style.width = c.width + "px";
		this.container.innerHTML = "";
		this.container.appendChild(c);
	}
}