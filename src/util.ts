namespace Util
{
	export function createInput(): HTMLInputElement
	{
		var i = document.createElement("input");
		i.type = "file";
		i.style.display = "none";
		document.body.appendChild(i);
		return i;
	}

	export function assignClick(element, onclick: Function)
	{
		element.setAttribute("is-clickable", "yes");
		element.onclick = onclick;
	}

	export function getClickedElement(event: Event)
	{
		var e: any = event.srcElement;
		var counter = 0;
		while (e.getAttribute("is-clickable") !== "yes")
		{
			e = e.parentNode;
			counter++;
			if (counter > 10)
				break;
		}

		if (e.getAttribute("is-clickable") === "yes")
			return e;
	}

	export function listen(event: string, f: Function)
	{
		document.addEventListener(event, <any>f);
	}	

	export function dispatchEvent(event: string)
	{
		document.dispatchEvent(new Event(event));
	}	
}
