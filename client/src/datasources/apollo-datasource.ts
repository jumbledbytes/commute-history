import ApolloClient from "apollo-boost";

class ApolloDatasource {
  private defaultServerUrl = "http://localhost:5001/";
  private serverUrl: string;
  private _client: ApolloClient<any>;

  constructor(url?: string) {
    this.serverUrl = url || this.defaultServerUrl;
    this._client = new ApolloClient({ uri: this.serverUrl });
  }

  public get client(): ApolloClient<any> {
    return this._client;
  }
}

export default ApolloDatasource;
