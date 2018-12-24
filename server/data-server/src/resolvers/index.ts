import IDatasource from "../datasources/idatasource";

import travelTimesResolver from "./travel-times-resolver";

const resolvers = (datasource: IDatasource) => travelTimesResolver(datasource);

export default resolvers;
