import { LocationModel } from '../models/LocationModel';
import { SchemaComposer } from 'graphql-compose';
import { composeWithMongoose } from 'graphql-compose-mongoose';

const locationSchema = new SchemaComposer();

const customizationOptions = {};
const LocationTC = composeWithMongoose(LocationModel, customizationOptions);

locationSchema.Query.addFields({
  locationById: LocationTC.getResolver('findById'),
  locationByIds: LocationTC.getResolver('findByIds'),
  locationOne: LocationTC.getResolver('findOne'),
  locationMany: LocationTC.getResolver('findMany'),
  locationCount: LocationTC.getResolver('count'),
  locationConnection: LocationTC.getResolver('connection'),
  locationPagination: LocationTC.getResolver('pagination'),
});

export const LocationGraphQL = locationSchema.buildSchema();
