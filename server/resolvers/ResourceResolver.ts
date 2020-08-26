import { ResourceModel } from "../models/ResourceModel";
import { SchemaComposer } from "graphql-compose";
import { composeWithMongoose } from "graphql-compose-mongoose";

const resourceSchema = new SchemaComposer();

const customizationOptions = {};
const ResourceTC = composeWithMongoose(ResourceModel, customizationOptions);

resourceSchema.Query.addFields({
  resourceById: ResourceTC.getResolver('findById'),
  resourceByIds: ResourceTC.getResolver('findByIds'),
  resourceOne: ResourceTC.getResolver('findOne'),
  resourceMany: ResourceTC.getResolver('findMany'),
  resourceCount: ResourceTC.getResolver('count'),
  resourceConnection: ResourceTC.getResolver('connection'),
  resourcePagination: ResourceTC.getResolver('pagination'),
});

export const ResourceGraphQL = resourceSchema.buildSchema();
