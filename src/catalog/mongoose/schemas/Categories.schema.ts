// categories.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ id: true })
class Subcategory {
  @Prop({ required: true })
  name: string;

  @Prop({ type: [String], default: ['brand', 'type', 'size'] })
  filter: string[];

  @Prop({ required: true, enum: ['active', 'inactive'], default: 'active' })
  status: 'active' | 'inactive';
}

@Schema({ id: true })
export class Category {
  @Prop({ required: true })
  name: string;

  @Prop({ type: [Subcategory], default: [] })
  subcategories: Types.DocumentArray<Subcategory>;

  @Prop({ type: [String], default: ['brand', 'type', 'size'] })
  filter: string[];

  @Prop({ required: true, enum: ['active', 'inactive'], default: 'active' })
  status: 'active' | 'inactive';
}

@Schema({ id: true })
export class CategoryHierarchy extends Document {
  // Main Categories schema
  @Prop({ required: true })
  name: string;

  @Prop({ type: [Category], default: [] })
  categories: Types.DocumentArray<Category>;

  @Prop({ type: [String], default: ['brand', 'type', 'size'] })
  filter: string[];

  @Prop({ required: true, enum: ['active', 'inactive'], default: 'active' })
  status: 'active' | 'inactive';
}

export const CategoriesHierarchySchema =
  SchemaFactory.createForClass(CategoryHierarchy);
