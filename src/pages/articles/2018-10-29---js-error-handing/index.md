---
title: "JavaScript-7 Error Handing"
date: "2018-10-29"
layout: post
draft: false
path: "/posts/js-7"
category: ""
tags:
  - 
description: ""
---

# Error handling

## try..catch

Usually, a script immediately stops in case of an error, fortunately,`try...catch`
allow us to catch errors.

Let's see an example:

```javascript
try {

  alert('Start of try runs');  // (1) <--

  lalala; // error, variable is not defined!

  alert('End of try (never reached)');  // (2)

} catch(err) {

  alert(`Error has occured!`); // (3) <--

}

alert("...Then the execution continues");
```

For all built-in errors, the error object inside catch block has two main properties:
`name`  
Error name. For an undefined variable that’s `ReferenceError`  
`message`
Textual message about error details.  
`stack`  
Current call stack: a string with information about the sequence of nested calls that led to the error.  

It should be noted that `try...catch` only works synchronously

```javascript

// Bad
try {
  setTimeout(function() {
    noSuchVariable; // script will die here
  }, 1000);
} catch (e) {
  alert( "won't work" );
}

// Good
setTimeout(function() {
  try {
    noSuchVariable; // try..catch handles the error!
  } catch (e) {
    alert( "error is caught here!" );
  }
}, 1000);
```

## try..catch..finally

The finally clause is often used when we start doing something before `try..catch` and want to finalize it in any case of outcome.

```javascript
function func() {

  try {
    return 1;  

  } catch (e) {
    /* ... */
  } finally {
    console.log( 'finally' );  
  }
}

console.log( func() );  // finally, 1
```

## Throw an error

JavaScript has many built-in constructors for standard errors: Error, SyntaxError, ReferenceError, TypeError and others. We can use them to create error objects as well.

```javascript
let error = new Error('something wrong! @_@');
throw error

throw new TypeError('something wrong! @_@')
```

## Global catch

```javascript
window.onerror = function(message, url, line, col, error) {
  // ...
};
```

## Custom errors

```javascript
class ReadError extends Error {
  constructor(message, cause) {
    super(message);
    this.cause = cause;
    this.name = 'ReadError';
  }
}

class ValidationError extends Error {
   constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
 }
class PropertyRequiredError extends ValidationError {
 constructor(property) {
    super("No property: " + property);
    this.property = property;
  }

 }

function validateUser(user) {
  if (!user.age) {
    throw new PropertyRequiredError("age");
  }

  if (!user.name) {
    throw new PropertyRequiredError("name");
  }
}

function readUser(json) {
  let user;

  try {
    user = JSON.parse(json);
  } catch (err) {
    if (err instanceof SyntaxError) {
      throw new ReadError("Syntax Error", err);
    } else {
      throw err;
    }
  }

  try {
    validateUser(user);
  } catch (err) {
    if (err instanceof ValidationError) {
      throw new ReadError("Validation Error", err);
    } else {
      throw err;
    }
  }

}

try {
  readUser('{bad json}');
} catch (e) {
  if (e instanceof ReadError) {
    alert(e);
    // Original error: SyntaxError: Unexpected token b in JSON at position 1
    alert("Original error: " + e.cause);
  } else {
    throw e;
  }
}
```
