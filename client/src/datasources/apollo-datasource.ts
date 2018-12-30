import ApolloClient from "apollo-boost";
import config from "./apollo-datasource.json";

class ApolloDatasource {
  private defaultServerUrl = `${window.location.protocol}//${window.location.hostname}:4001/`;
  private serverUrl: string;
  private _client: ApolloClient<any>;
  private apolloConfig = config;

  constructor(url?: string) {
    this.serverUrl = url || this.getServerUrl();
    this._client = new ApolloClient({ uri: this.serverUrl });
  }

  public get client(): ApolloClient<any> {
    return this._client;
  }

  private getServerUrl() {
    let hostname = this.apolloConfig.serverUrl;
    if (hostname === "${window.location.hostname}") {
      hostname = window.location.hostname;
    }
    let hostNameMutator = this.apolloConfig.serverUrlRegex;
    if (hostNameMutator && hostNameMutator.length >= 2) {
      hostname = hostname.replace(hostNameMutator[0], hostNameMutator[1]);
    }
    if (!hostname) {
      hostname = this.defaultServerUrl;
    }
    const portString = this.apolloConfig.serverPort > 0 ? `:${this.apolloConfig.serverPort}` : "";
    const serverUrl = `${window.location.protocol}//${hostname}${portString}`;
    return serverUrl;
  }
}

export default ApolloDatasource;
