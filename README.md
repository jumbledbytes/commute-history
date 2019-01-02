# Overview

Commute history is a small tool I put together to record and visualize travel times along various commuting routes. 
The travel times are retrieved regularly at a configurable interval, stored in a backend database, and then visualized
in a chart showing travel times over a period of time (i.e. the last day or two).

The commute history tool consists of 4 services that manage each aspect of loading, saving, and visualizing the data. 
The following services run on the server side:

* **Credentials Server** - This is responsible for providing the necessary credentials, tokens, and keys required to use mapping
   and database services
* **Data Loader** - This is responsible for connecting to a map provider and retrieving travel times
* **Data Server** - This is responsible for servicing requests for travel time data from the client

The client application communicates exclusively with the Data Server to retrieve the travel time data it visualizes. 
The client application does  not communicate directly with the credentials server and the data loader and it they are implemented 
to support being run behind a firewall with no publicly exposed ports or APIs.

The commute history backend is modular to support multiple mapping providers. Currently Apple Maps and Mapkit are supported,
however Apple's Mapkit.js does not provide traffic information.

# Configuring and Running

## Install dependencies

Currently the commute tool uses [ArangoDb](https://www.arangodb.com/) as a backend database to store the travel data. The Arango database server needs to be
installed, configured, and running prior to running the commute service.

Use the `arangodump` tool to create a 'commute' database using the schema provided in https://github.com/jumbledbytes/commute-history/tree/master/server/schema/arangodb3 

## Configure Commute History

To install all of the remaining dependencies run the following in the base of the repo:

`yarn configure`

### Configure the Credentials Server

The credentials server needs to be provided with the keys and credentials required for the mapping server and the Arango database.

You will need to create the following files with the appropriate values for your configuration:

**server/credentials-server/keys/commuter-db-credentials.json**
```json

{
  "arango": {
    "host": "http://<arangodb_hostname>:<arangodb_port>",
    "database": "<database_name>",
    "username": "<username>",
    "password": "<password>"
  }
}
```

**server/credentials-server/keys/mapbox.json**
```json
{
  "mapboxgl": {
    "accessToken": "<your_mapbox_access_token"
  }
}
```

## The Data Loader

The data-loader service is also intended to provide an administrative service to manage what data is loaded, 
however currently it only displays the routes data is collected for. The data-loader requires a browser to run
due to some mapping services requiring the browswer provided `window` variable. For data loading the loader is run
in a headless chrome instance

### Scheduling the data loader

The data-loader scheduling is controlled by https://github.com/jumbledbytes/commute-history/blob/master/server/data-loader/scheduler/schedule.json
Modify this file to fit your needs (and the number of monthly/daily queries allowed by you map provider account)

## Configure the Client

The client needs to be configured to specify the location of the data server it retrieves traffic data from. To configure the client edit:

https://github.com/jumbledbytes/commute-history/blob/master/client/src/datasources/apollo-datasource.json
```json
{
  "serverUrl": "${window.location.hostname}",
  "serverUrlRegex": ["traffic", "traffic-data"],
  "serverPort": -1
}
```

Replace serverUrl to match the location of the data server, or use `${window.location.hostname}` to use the location of the client. The serverUrlRegex will be used to modify the value of serverUrl. In the above example if `window.location.hostname` is `traffic.mywebsite.com` the serverUrlRegis above will modify this to `traffic-data.mywebsite.com`. If you are using a custom port specify it with `serverPort` or leave it as -1 to use `window.location.port`.

## Running the services

### Using the webpack dev server

This is not recommended for production, but it is currently primary means of running the tool. To start run the following 
at the top level of the repo:

`yarn start`

This will start the server and client. The credential server will be running on port 4000, the data-server on port 4001, the
data-loader on port 4002, and the client on port 3000.

Running a reverse proxy and a firewall to only expose port 3000 (preferably using https) is recommended as this tool does 
not provide any built in support for SSL and the credential service will expose any credentials on port 4000.

### Docker

Running with docker is still untested, but to create a docker image that runs all of the service run the following;

`yarn build:docker`

