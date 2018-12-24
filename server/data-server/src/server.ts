import { ApolloServer } from "apollo-server";
import getIdl from "./idl/get-idl";
import resolvers from "./resolvers";
import ArangoDatasource from "./datasources/arango-datasource";

const typeDefs = getIdl();
const arangoDatasource = new ArangoDatasource();

arangoDatasource.connect().then(
  () => {
    const arangoResolvers = resolvers(arangoDatasource);
    const server = new ApolloServer({ typeDefs, resolvers: arangoResolvers });

    // This `listen` method launches a web-server.  Existing apps
    // can utilize middleware options, which we'll discuss later.
    server.listen().then((args: any) => {
      console.log(`🚀  Server ready at ${args.url}`);
    });
  },
  () => {
    console.log("Unable to connect to datasource");
  }
);
