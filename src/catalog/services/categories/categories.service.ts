// categories.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateCategoryDto } from 'src/catalog/dtos/CreateCategory.dto';
import { CreateDepartmentDto } from 'src/catalog/dtos/CreateDepartment.dto';
import { CreateSubcategoryDto } from 'src/catalog/dtos/CreateSubcategory.dto';
import { CategoryHierarchy } from 'src/catalog/mongoose/schemas/Categories.schema';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(CategoryHierarchy.name)
    private categoriesModel: Model<CategoryHierarchy>,
  ) {}

  // Create a new department
  async createDepartment(
    createDepartmentDto: CreateDepartmentDto,
  ): Promise<CategoryHierarchy> {
    const newDepartment = new this.categoriesModel(createDepartmentDto);
    return await newDepartment.save();
  }

  async getDepartmentByCategoryId(
    categoryId: string,
  ): Promise<CategoryHierarchy> {
    const department = await this.categoriesModel.findOne({
      'categories._id': categoryId,
    });

    if (!department) {
      throw new HttpException(
        'Department not found for the given category name',
        HttpStatus.NOT_FOUND,
      );
    }

    return department;
  }

  // Create a category under a specific department
  async createCategory(
    departmentId: string,
    createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryHierarchy> {
    const department = await this.categoriesModel.findById(departmentId);
    if (!department) {
      throw new HttpException('Department not found', HttpStatus.NOT_FOUND);
    }

    const newCategory = {
      _id: createCategoryDto._id || new Types.ObjectId(),
      name: createCategoryDto.name,
      subcategories: createCategoryDto.subcategories || [],
      status: createCategoryDto.status,
    };

    department.categories.push(newCategory);
    await department.save();

    return department;
  }

  // Create a subcategory under a specific category
  async createSubcategory(
    departmentId: string,
    categoryId: string,
    createSubcategoryDto: CreateSubcategoryDto,
  ): Promise<CategoryHierarchy> {
    const department = await this.categoriesModel.findOne({
      _id: departmentId,
      'categories._id': categoryId,
    });
    if (!department) {
      throw new HttpException(
        'Category not found in the specified department',
        HttpStatus.NOT_FOUND,
      );
    }

    const category = department.categories.id(categoryId);

    const newSubcategory = {
      _id: createSubcategoryDto._id || new Types.ObjectId(),
      name: createSubcategoryDto.name,
      status: createSubcategoryDto.status,
    };

    category.subcategories.push(newSubcategory);
    await department.save();

    return department;
  }
}
