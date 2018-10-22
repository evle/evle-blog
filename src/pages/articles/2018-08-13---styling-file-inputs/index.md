---
title: "Styling File inputs"
date: "2018-08-13"
layout: post
draft: false
path: "/posts/styling-file-inputs"
category: ""
tags:
  - 
description: ""
---
```html
<input type="file" name="file" id="file" class="inputfile" />>
<label for="file">Choose a file</label>
```

## Hiding the file input
CSS properties such as 
`display: none` or `visibility:hidden` will not work out because the input value will be ignored.

therefore:
```css
.inputfile {
	width: 0.1px;
	height: 0.1px;
	opacity: 0;
	overflow: hidden;
	position: absolute;
	z-index: -1;
}
```

## Styling the label
```
.inputfile + label {
    font-size: 1.25em;
    font-weight: 700;
    color: white;
    background-color: black;
    display: inline-block;
}

.inputfile:focus + label,
.inputfile + label:hover {
    background-color: red;
}

.inputfile + label {
	cursor: pointer; /* "hand" cursor */
}

/* Keyboard Navigation */
.inputfile:focus + label {
	outline: 1px dotted #000;
	outline: -webkit-focus-ring-color auto 5px;
}

/* Possible Touch Issues*/
.inputfile + label * {
	pointer-events: none;
}
```

## Multiple Files Selection
Customizing property
```html
<input type="file" name="file" id="file" class="inputfile" data-multiple-caption="{count} files selected" multiple />
```

```javascript
var inputs = document.querySelectorAll( '.inputfile' );
Array.prototype.forEach.call( inputs, function( input )
{
	var label	 = input.nextElementSibling,
		labelVal = label.innerHTML;

	input.addEventListener( 'change', function( e )
	{
		var fileName = '';
		if( this.files && this.files.length > 1 )
			fileName = ( this.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', this.files.length );
		else
			fileName = e.target.value.split( '\\' ).pop();

		if( fileName )
			label.querySelector( 'span' ).innerHTML = fileName;
		else
			label.innerHTML = labelVal;
	});
});
```

## When JavaScript is not available
Since there is no JavaScript-less way to indicate if any files were selected, it would be better to rely on the default looks of the file input for the sake of usability. All we need to do is to add a .no-js class name to the `<html>` element and then use JavaScript and replace it with .js – that’s how we will know if JavaScript is available.

```html
<html class="no-js">
    <head>
        <!-- remove this if you use Modernizr -->
        <script>(function(e,t,n){var r=e.querySelectorAll("html")[0];r.className=r.className.replace(/(^|\s)no-js(\s|$)/,"$1js$2")})(document,window,0);</script>
    </head>
</html>
```
```css
.js .inputfile {
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
}

.no-js .inputfile + label {
    display: none;
}
```

## Test & Fix bug
It is quite unexpected that Firefox completely ignores the `input[type="file"]:focus` expression, whereas `:hover` and `:active` work just fine.
```javascript
input.addEventListener( 'focus', function(){ input.classList.add( 'has-focus' ); });
input.addEventListener( 'blur', function(){ input.classList.remove( 'has-focus' ); });
```
```css
.inputfile:focus + label,
.inputfile.has-focus + label {
    outline: 1px dotted #000;
    outline: -webkit-focus-ring-color auto 5px;
}
```
