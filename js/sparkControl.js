// Library code
const BASE_URL = 'https://api.particle.io/v1';

function isFunction(x) {
  /*
	 * Note that this will NOT work for generators, async functions, or proxies;
	 * it's meant only for very simple callback functions.
	 */
  return typeof x === 'function';
}

const sparkControl = function(deviceId, access_token) {
  /*
	 * You can find your device ID and access token in the Particle Build
	 * IDE online.  Use those values to create a new controller:
	 *
	 * var myParticle = new sparkControl(deviceId, access_token);
	 */
  this.deviceId = deviceId;
  this.access_token = access_token;

  // Set testMode = true to log communications to the javascript console
  this.testMode = true;

  this.eventSources = {};
  this.eventHandlers = {};
}

sparkControl.prototype.ping = function(callbackFunction) {
  // PUT /devices/:deviceId/ping
  const url = `${BASE_URL}/devices/${this.deviceId}/ping?access_token=${this.access_token}`;
  const method = 'PUT';
  const P = fetch(url, {method})
    .then(res => res.json());
  if (isFunction(callbackFunction)) {
    P.then(callbackFunction);
  }
  return P;
};

sparkControl.prototype.callFunction = function(functionName, functionArg, callbackFunction) {
  // POST /devices/:deviceId/:functionName
  const url = `${BASE_URL}/devices/${this.deviceId}/${functionName}`;
  const method = 'POST';
  const body = new URLSearchParams();
  body.append('access_token', this.access_token);
  body.append('arg', functionArg);
  const P = fetch(url, {method, body})
    .then(res => res.json())
    .then(data => data.return_value);
  if (isFunction(callbackFunction)) {
    P.then(callbackFunction);
  }
  return P;
}

sparkControl.prototype.getVariable = function(variableName, callbackFunction) {
  // GET /devices/:deviceId/:variableName
  const url = `${BASE_URL}/devices/${this.deviceId}/${variableName}?access_token=${this.access_token}`;
  const P = fetch(url)
    .then(res => res.json())
    .then(data => data.result);
  if (isFunction(callbackFunction)) {
    P.then(callbackFunction);
  }
  return P;
}

sparkControl.prototype.subscribe = function(sparkEventName, callbackFunction) {
  // GET /devices/:deviceId/events

  const url = `${BASE_URL}/devices/${this.deviceId}/events/${sparkEventName}?access_token=${this.access_token}`;
  const eventSource = new EventSource(url);
  const eventHandler = evt => {
    var parsedData = JSON.parse(evt.data).data;
    this.logTestMessage(parsedData);
    if (isFunction(callbackFunction)) {
      callbackFunction(parsedData);
    }
  };
  eventSource.addEventListener(sparkEventName, eventHandler, false);
  this.eventSources[sparkEventName] = eventSource;
  this.eventHandlers[sparkEventName] = eventHandler;
}

sparkControl.prototype.unsubscribe = function(sparkEventName) {
  if (!this.eventSources.hasOwnProperty(sparkEventName)) {
    return;
  }
  const eventSource = this.eventSources[sparkEventName];
  const eventHandler = this.eventHandlers[sparkEventName];
  eventSource.removeEventListener(sparkEventName, eventHandler);
  delete this.eventSources[sparkEventName];
  delete this.eventHandlers[sparkEventName];
}

sparkControl.prototype.logTestMessage = function(message) {
  if (this.testMode) {
    console.log(message);
  }
}