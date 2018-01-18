# `sparkControl`

`sparkControl` is a JavaScript library for controlling a Particle Photon Arduino-compatible Internet of Things cloud device.

`sparkControl` is written and maintained by:

- Andy Forest <andy@steamlabs.ca>
- Evan Savage <evan@steamlabs.ca>

# Usage

## Including `sparkControl` in Your Projects

You can include the library in your own pages directly. For example, put this in the HEAD:

```html
<script src="https://andyforest.github.io/sparkControl/js/sparkControl.js"></script>
<script>
var myPhoton = new sparkControl("<< Your Device ID Here >>", "<< Your access_token here >>");
</script>
```

Now you can call Photon cloud functions directly with one line!  Here's an example using `onclick` to ring a bell when a `<button>` is clicked:

```html
<button onclick="myPhoton.callFunction('ringDoorBell', 'Short');">Ring Door Bell</button>
```

This example calls the Photon function `ringDoorBell`, and passes it the text string `"Short"` as a parameter.

## Getting Return Values with Callbacks

Sometimes, you might want to use the value returned by a Photon [cloud function](https://docs.particle.io/reference/firmware/photon/#cloud-functions).

Calling a cloud function isn't quite like calling a regular function, though!  The cloud function makes a request to the [Particle Cloud API](https://docs.particle.io/reference/api/), which takes time.  To get the return value, we have to provide a *callback function*:

```js
myPhoton.callFunction('ringDoorBell', 'Short', function(return_value) {
  console.log(return_value);
});
```

This *callback function* is called once the Cloud API replies to our request.

## Ping

To check if your Photon is actually online, use `ping()` with a callback to receive the result:

```js
myPhoton.ping(function(result) {
  console.log(result.online);   // true if online
})
```

## Variables

You can fetch variables, again using a callback to receive the result:

```js
myPhoton.getVariable('myVariable', function(myVariable) {
  console.log(myVariable);
})
```

## Events

This is where it gets fun!  Functions and variables are great, but sometimes you want to do something over and over again, or update your web page in response to new server readings.

*Events* help you do that.  By using `subscribe()`, you can listen to events coming from your Photon:

```js
myPhoton.subscribe('myEventType', function(eventData) {
  console.log(eventData);
});
```

The callback function is called whenever your Photon publishes an event of type `"myEventType"`.  To publish events, you can call `.publish()` within the code running on your Photon:

```c
int counter = 0;
char buf[12];
void loop() {
  counter++;
  itoa(counter, buf, 10);
  Particle.publish("myEventType", buf);
  delay(1000);
}
```

Here `itoa` is used to convert `counter` to a string, since that's what `Particle.publish()` requires.

To unsubscribe from an event type, call `.unsubscribe()` with the event type that you no longer want to receive:

```js
myPhoton.unsubscribe('myEventType');
```

This means that your callback function will no longer be called whenever your Photon publishes an event of type `"myEventType"`.  Note that `.unsubscribe()` does **NOT** take a callback function: unsubscribing happens immediately.

So, to recap: your Photon device sends events with `Particle.publish()`, and your JavaScript code subscribes to those events with `myPhoton.subscribe()`.

## Promises!

This section is for more experienced JavaScript programmers.  If you're just learning JavaScript, don't worry!  You can do everything you need with callback functions, as described above.  If you haven't worked much with JavaScript before, it's definitely recommended to use callback functions first, and come back to this once you understand the language better.

Promises provide a cleaner way to do multiple things in a row.  Let's say I want to get a variable, then call a function based on the variable value, then check the value of that variable again.  With callback functions, you'll need to do something like this:

```js
myPhoton.getVariable('myVariable', function(myVariable) {
  if (myVariable === 42) {
    myPhoton.callFunction('ringDoorBell', 'Long', function(result)) {
      myPhoton.getVariable('myVariable', function(myVariable2) {
        console.log(`was ${myVariable}, is now ${myVariable2}`);
      });
    });
  } else {
    myPhoton.callFunction('ringDoorBell', 'Short', function(result) {
      myPhoton.getVariable('myVariable', function(myVariable2) {
        console.log(`was ${myVariable}, is now ${myVariable2}`);
      });
    });
  }
});
```

That's a mouthful!  We've got callback functions inside callback functions inside...well, you get the point.  You can probably imagine how this can get very confusing!

You can make this a bit cleaner by pulling out those nested callbacks into their own functions:

```js
myPhoton.getVariable('myVariable', ringBellBasedOnMyVariable);

function ringBellBasedOnMyVariable(myVariable) {
  var bellType = myVariable === 42 ? 'Long' : 'Short';
  myPhoton.callFunction('ringDoorBell', bellType, function(result) {
    compareMyVariable(myVariable);
  });
}

function compareMyVariable(myVariable) {
  myPhoton.getVariable('myVariable', function(myVariable2) {
    console.log(`was ${myVariable}, is now ${myVariable2}`);
  });
}
```

This is definitely more readable than our first attempt, and it makes it much easier to handle the logic flow.

Promises give us yet another way to do this:

```js
var myVariable = null;
myPhoton.getVariable('myVariable')
  .then(function(value) {
    myVariable = value;
    var bellType = myVariable === 42 ? 'Long' : 'Short';
    return myPhoton.callFunction('ringDoorBell', bellType);
  })
  .then(function(result) {
    return myPhoton.getVariable('myVariable');
  })
  .then(function(myVariable2)) {
    console.log(`was ${myVariable}, is now ${myVariable2}`);
  });
```

You can even use [`Promise.all()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) to do several things at once!  If you're feeling up to it, here's a challenge: see if you can figure out how to fetch two variable values at the same time using `Promise.all()`.

Again: you don't strictly need Promises, so don't be discouraged if this part is confusing!  You can always use callback functions, and come back to this later once you've got that working.  Promises are mainly about *code organization*: especially in larger projects, they can help you make sense of complicated flows involving several calls to the Cloud API.

## Useful Resources!

Tutorials and more examples:
http://steamlabs.ca/wp-content/uploads/2016/04/Internet-of-Things-STEAMLabs-CIRA.docx

Also included is a troubleshooting control panel that you can use to call your remote functions, read variables and subscribe to published events:
https://andyforest.github.io/sparkControl/examples/Spark_Control_Panel.html

A huge thank you to the Canadian Internet Registration Authority's Community Investment Program for helping to fund this work!
http://www.cira.ca/about-cira/community-investment-program/