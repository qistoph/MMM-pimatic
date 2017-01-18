# Pimatic - MagicMirror² module

[![Build Status](https://travis-ci.org/qistoph/MMM-pimatic.svg?branch=master)](https://travis-ci.org/qistoph/MMM-pimatic)

This is a module for [MagicMirror²](https://github.com/MichMich/MagicMirror) to
send events to a [Pimatic](https://pimatic.org) installation.

## Installing the module

To install the module, just clone this repository to your __modules__ folder:
`git clone https://github.com/qistoph/MMM-pimatic.git pimatic`.
The run `cd pimatic` and `npm install` to install the dependencies.

## Updating the module

Pull the git updates: `git pull`.
The update dependencies in the module folder: `cd pimatic` followed by `npm install`.

## Using the module

To use this module, add it to the modules array in the `config/config.js` file:

```javascript
modules: [
  {
    module: 'pimatic',
    config: {
      url: 'https://host.com:8080/api/',
      username: 'magicmirror',
      password: 'PASSWORD'
    }
  }
]
```

## Configuration options

The following properties can be configured:

Option           | Description
---------------- | -----------
`url`            | The URL to get the status from. Must be a php-nagios-json page.<br>**Required**
`username`       | The username to use for API calls.<br>**Required**
`password`       | The password to use for API calls.<br>**Required**
`mappings`       | An array of mappings used to convert notifications to Pimatic calls. See (Mappings)[#mappings] for details.<br>**Required**</br>

### Mappings

Simple functions are used to convert notifications to Pimatic calls. `mappings`
must contain an array of functions with the signature
`function(notification, payload, sender)` and must return `undefined` or a named
array with the following parameters:

Key        | Value
---------- | -------
`uri`      | The API uri to call, e.g. `device/DEVICE_NAME/ACTION`
`params`   | A named array with parameters to send as query string in the GET request

If your pimatic installation has a `DummuPresenceSensor` with the id
`magicmirror-presence` you could use the following samples to change its
presence when `USER_PRESENCE` notifactions are received.

**Send present only**
````javascript
mappings: [
  function(notification, payload, sender) {
    if (notification == "USER_PRESENCE" && payload == true) {
      return {"uri": "device/magicmirror-presence/changePresenceTo", "params": {"presence": "true"}};
    }
  }
]
````

**Send present and absent events**
````javascript
mappings: [
  function(notification, payload, sender) {
    if (notification == "USER_PRESENCE") {
      return {"uri": "device/magicmirror-presence/changePresenceTo", "params": {"presence": (payload === true) }};
    }
  }
]

````
