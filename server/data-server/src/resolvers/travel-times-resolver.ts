import IDatasource from "../datasources/idatasource";

const travelTimesResolver = (datasource: IDatasource) => {
  return {
    Query: {
      travelTimes: async (_: any, args: any) => {
        const travelTimes = await datasource.getTravelTimes(args.routeName);
        return travelTimes;
      },

      routes: async () => {
        const routes = await datasource.getRoutes();
        return routes;
      },

      route: async (_: any, args: any) => {
        const route = await datasource.getRoute(args.routeName);
        return route;
      }
    }
  };
};

export default travelTimesResolver;
