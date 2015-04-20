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
<button onclick="sparkCore.callFunction('ringDoorBell', 'Short');">
```

Library also includes callback functions, reading variables, and subscribing to published events from the core.

Tutorials and more examples:
http://steamlabs.ca/wp-content/uploads/2015/04/Internet-of-Things-STEAMLabs-CIRA.docx
