// THIS FILE IS AUTO GENERATED , DO NOT EDIT
class Component
{
	public root: HTMLElement;
	constructor(root: Element, markup: number)
	{
		this.root = <HTMLElement>root;
		this.loadMarkup(markup);
	}

	public find = (query: string): HTMLElement =>
	{
		query = "." + query;
		return <HTMLElement>this.root.querySelector(query);
	}

	public querySelector = (query: string): Element =>
	{
		return this.root.querySelector(query);
	}

	public querySelectorAll = (query: string): NodeList =>
	{
		return this.root.querySelectorAll(query);
	}

	private loadMarkup = (key: number) =>
	{
		var w: any = window;
		if (!w.__markup_data[key])
			throw "there is no markup for " + key;

			
		this.root.innerHTML = decodeURIComponent(atob(w.__markup_data[key]));
	}
}
function loadTemplate(key: number): HTMLElement
{
	var w: any = window;
	if (!w.__markup_data[key])
		throw "there is no markup for " + key;

	function htmlToElement(html)
	{
		var template = document.createElement('template');
		html = html.trim();
		template.innerHTML = html;
		return template.content.firstChild;
	}
	return <HTMLElement>htmlToElement(decodeURIComponent(atob(w.__markup_data[key])));
}
const MARKUP_APPLICATION = 0;
const MARKUP_BASE = 1;
const MARKUP_BIG_HISTOGRAM = 2;
const MARKUP_HISTOGRAM_GROUP = 3;