import { gql } from "apollo-server";
import { DocumentNode } from "graphql";
import * as fs from "fs";

const getIdl = (): DocumentNode => {
  console.log(process.cwd());
  const idl = fs.readFileSync("src/idl/travel-times.gql").toString();
  return gql`
    ${idl}
  `;
};

export default getIdl;
