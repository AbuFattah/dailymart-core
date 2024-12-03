// categories.service.ts
import { InjectQueue } from '@nestjs/bullmq';
import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Queue } from 'bullmq';
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
    @InjectQueue('products-queue') private productsQueue: Queue,
  ) {}

  // Create a new department
  async createDepartment(
    createDepartmentDto: CreateDepartmentDto,
  ): Promise<CategoryHierarchy> {
    const department = await this.categoriesModel.findOne({
      name: createDepartmentDto.name,
    });

    if (department) {
      throw new HttpException(
        'Department name already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
    const newDepartment = new this.categoriesModel(createDepartmentDto);
    return await newDepartment.save();
  }

  async getCategoriesHierarchy() {
    try {
      const hierarchy = await this.categoriesModel.aggregate([
        {
          $match: {
            status: { $ne: 'inactive' },
          },
        },
        {
          $addFields: {
            categories: {
              $filter: {
                input: '$categories',
                as: 'category',
                cond: { $ne: ['$$category.status', 'inactive'] },
              },
            },
          },
        },
        {
          $addFields: {
            categories: {
              $map: {
                input: '$categories',
                as: 'category',
                in: {
                  $mergeObjects: [
                    '$$category',
                    {
                      subcategories: {
                        $filter: {
                          input: '$$category.subcategories',
                          as: 'subcategory',
                          cond: { $ne: ['$$subcategory.status', 'inactive'] },
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            categories: 1,
            status: 1,
            __v: 1,
          },
        },
      ]);
      return hierarchy;
    } catch (error) {
      console.error('Error fetching hierarchy:', error);
      throw new NotFoundException('Error fetching hierarchy');
    }
  }

  async getDepartmentWithChildren() {
    return this.categoriesModel.find();
  }

  async getDepartmentById(departmentId: string) {
    const department = await this.categoriesModel.findOne({
      _id: departmentId,
    });

    if (!department) {
      throw new HttpException('Department not found', HttpStatus.NOT_FOUND);
    }

    return {
      _id: department.id,
      name: department.name,
      status: department.status,
    };
  }
  async getDepartmentByCategoryId(categoryId: string) {
    const department = await this.categoriesModel.findOne({
      'categories._id': categoryId,
    });

    if (!department) {
      throw new HttpException(
        'Department not found for the given category name',
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      _id: department.id,
      name: department.name,
      status: department.status,
    };
  }

  async updateDepartmentName(
    departmentId: string,
    newName: string,
  ): Promise<{ id: string; name: string }> {
    const updatedDepartment = await this.categoriesModel.findByIdAndUpdate(
      departmentId,
      { $set: { name: newName } },
      { new: true, runValidators: true },
    );

    if (!updatedDepartment) {
      throw new NotFoundException(
        `Department with ID ${departmentId} not found`,
      );
    }

    return { id: updatedDepartment.id, name: updatedDepartment.name };
  }

  async updateCategoryName(
    categoryId: string,
    newName: string,
  ): Promise<{ id: string; name: string }> {
    const updatedCategory = await this.categoriesModel.findOneAndUpdate(
      { 'categories._id': categoryId },
      { $set: { 'categories.$.name': newName } },
      { new: true, runValidators: true },
    );

    if (!updatedCategory) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }

    // Extract the updated category for double checking
    const category = updatedCategory.categories.find(
      (cat) => cat._id.toString() === categoryId,
    );

    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }
    this.productsQueue.add('update-category-name', {
      id: categoryId,
      name: newName,
    });

    return { id: category._id.toString(), name: category.name };
  }

  async updateSubcategoryName(
    subcategoryId: string,
    newName: string,
  ): Promise<{ id: string; name: string }> {
    const updatedDocument = await this.categoriesModel.findOneAndUpdate(
      { 'categories.subcategories._id': subcategoryId }, // Locate the document with the subcategory ID
      { $set: { 'categories.$[].subcategories.$[subcategory].name': newName } }, // Update the subcategory name
      {
        new: true,
        runValidators: true,
        arrayFilters: [
          { 'subcategory._id': subcategoryId }, // Match the subcategory ID
        ],
      },
    );

    if (!updatedDocument) {
      throw new NotFoundException(
        `Subcategory with ID ${subcategoryId} not found`,
      );
    }

    this.productsQueue.add('update-subcategory-name', {
      id: subcategoryId,
      name: newName,
    });

    return { id: subcategoryId, name: newName };
  }

  async deleteDepartment(
    departmentId: string,
  ): Promise<{ departmentId: string; name: string; status: string }> {
    const department = await this.categoriesModel.findById(departmentId);

    if (!department) {
      throw new NotFoundException(
        `Department with ID ${departmentId} not found`,
      );
    }

    const updatedDepartment = await this.categoriesModel.findByIdAndUpdate(
      departmentId,
      { $set: { status: 'inactive' } },
      { new: true, runValidators: true },
    );

    return {
      departmentId: updatedDepartment.id,
      name: updatedDepartment.name,
      status: updatedDepartment.status,
    };
  }

  // Create a category under a specific department
  async createCategory(
    departmentId: string,
    createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryHierarchy> {
    const existingCategory = await this.categoriesModel.findOne({
      _id: departmentId,
      'categories.name': createCategoryDto.name,
    });

    if (existingCategory) {
      throw new ConflictException(
        `Category ${createCategoryDto.name} already exists`,
      );
    }

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

  async getCategoriesByDepartmentId(departmentId: string) {
    try {
      const department = await this.categoriesModel.findOne({
        _id: departmentId,
      });
      return department.categories;
    } catch (error) {
      throw new NotFoundException('Error fetching categories ' + error);
    }
  }
  async getSubcategoriesByCategoryId(categoryId: string) {
    try {
      const department = await this.categoriesModel.findOne(
        { 'categories._id': categoryId },
        { 'categories.$': 1, name: 1, status: 1 },
      );

      const category: any = department.categories.filter(
        (category) => category.id === categoryId,
      );

      return category[0].subcategories || [];
    } catch (error) {
      throw new NotFoundException('Error fetching categories ' + error);
    }
  }

  async getCategorybyId(categoryId: string) {
    try {
      const department = await this.categoriesModel.findOne(
        { 'categories._id': categoryId },
        { 'categories.$': 1, name: 1, status: 1 },
      );

      const category = department.categories[0];

      return {
        departmentName: department.name,
        departmentStatus: department.status,
        categoryName: category.name,
        categoryId: category._id,
        categoryStatus: category.status,
      };
    } catch (error) {
      throw new NotFoundException('Error fetching category ' + error);
    }
  }
  async getSubcategorybyId(subcategoryId: string) {
    try {
      const department = await this.categoriesModel.findOne(
        { 'categories.subcategories._id': subcategoryId },
        { 'categories.$': 1, name: 1, status: 1 },
      );

      if (!department) {
        throw new NotFoundException(
          `Subcategory not found with ID: ${subcategoryId}`,
        );
      }

      const category = department.categories[0];

      const subcategory = category.subcategories.find(
        (sub) => sub.id == subcategoryId,
      );

      if (!subcategory) {
        throw new NotFoundException(
          `Subcategory not found with ID: ${subcategoryId}`,
        );
      }

      return {
        departmentName: department.name,
        departmentStatus: department.status,
        categoryName: category.name,
        categoryId: category._id,
        categoryStatus: category.status,
        subcategoryName: subcategory.name,
        subcategoryId: subcategory.id,
        subcategoryStatus: subcategory.status,
      };
    } catch (error) {
      throw new NotFoundException('Error fetching category ' + error);
    }
  }

  async createSubcategoryByCategoryId(
    categoryId: string,
    createSubcategoryDto: CreateSubcategoryDto,
  ) {
    try {
      const existingSubcategory = await this.categoriesModel.findOne({
        'categories._id': new Types.ObjectId(categoryId),
        'categories.subcategories.name': createSubcategoryDto.name,
      });

      if (existingSubcategory) {
        throw new ConflictException(
          `Subcategory with name "${createSubcategoryDto.name}" already exists in this category`,
        );
      }

      const result = await this.categoriesModel.findOneAndUpdate(
        { 'categories._id': new Types.ObjectId(categoryId) },
        {
          $push: {
            'categories.$.subcategories': {
              _id: createSubcategoryDto.id || new Types.ObjectId(),
              name: createSubcategoryDto.name,
              status: createSubcategoryDto.status,
            },
          },
        },
        { new: true, runValidators: true },
      );

      if (!result) {
        throw new NotFoundException(
          `Category not found with ID: ${categoryId}`,
        );
      }

      const updatedCategory = result.categories.find(
        (category) => category._id.toString() === categoryId,
      );

      return {
        departmentId: result._id,
        departmentName: result.name,
        category: updatedCategory,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      console.error('Error creating subcategory:', error);
      throw new InternalServerErrorException('Error creating subcategory');
    }
  }
}
