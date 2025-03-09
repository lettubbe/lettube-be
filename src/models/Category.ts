import { model, Schema, Model } from "mongoose";

const categorySchema = new Schema(
  {
    name: { type: String, required: [true, "Category Name is required"] },
  },
  { timestamps: true }
);

export interface ICategory extends Document {
  name: string;
}

export interface ICategoryModel extends Model<ICategory> {
  paginate(
    query: object,
    options: object
  ): Promise<{
    docs: ICategory[];
    totalDocs: number;
    limit: number;
    totalPages: number;
    page: number;
    pagingCounter: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    prevPage: number | null;
    nextPage: number | null;
  }>;
}

export const Category = model<ICategory, ICategoryModel>("category", categorySchema);

export default Category;
