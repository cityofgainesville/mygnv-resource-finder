import { CategoryModel } from "../models/CategoryModel";
import { SchemaComposer } from "graphql-compose";
import { composeWithMongoose } from "graphql-compose-mongoose";

const categorySchema = new SchemaComposer();

const customizationOptions = {};
const CategoryTC = composeWithMongoose(CategoryModel, customizationOptions);

categorySchema.Query.addFields({
  categoryById: CategoryTC.getResolver('findById'),
  categoryByIds: CategoryTC.getResolver('findByIds'),
  categoryOne: CategoryTC.getResolver('findOne'),
  categoryMany: CategoryTC.getResolver('findMany'),
  categoryCount: CategoryTC.getResolver('count'),
  categoryConnection: CategoryTC.getResolver('connection'),
  categoryPagination: CategoryTC.getResolver('pagination'),
});

export const CategoryGraphQL = categorySchema.buildSchema();
