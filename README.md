# sparkControl
Javascript library for controlling a Spark Core or Spark Photon Arduino compatible Internet of Things cloud device.
Author: Andy Forest <andy@steamlabs.ca>

You can include the library in your own pages directly. For example, put this in the HEAD:

```html
<script src="https://code.jquery.com/jquery-1.11.2.min.js"></script>
<script src="https://andyforest.github.io/sparkControl/js/sparkControl.js"></script>
<script type="text/javascript">
  var sparkCore = new sparkControl("<< Your CORE ID Here >>", "<< Your access_token here >>");
</script>
```

Now you can call Core functions directly with one line! eg:

```html
<button onclick="sparkCore.callFunction('ringDoorBell', 'Short');">Ring Door Bell</button>
```

This example calls the Spark function ringDoorBell, and passes it the text string "Short" as a parameter.

Library also includes callback functions, reading variables, and subscribing to published events from the core.

Tutorials and more examples:
http://steamlabs.ca/wp-content/uploads/2016/04/Internet-of-Things-STEAMLabs-CIRA.docx

Also included is a troubleshooting control panel that you can use to call your remote functions, read variables and subscribe to published events:
https://andyforest.github.io/sparkControl/examples/Spark_Control_Panel.html

A huge thank you to the Canadian Internet Registration Authority's Community Investment Program for helping to fund this work!
http://www.cira.ca/about-cira/community-investment-program/
