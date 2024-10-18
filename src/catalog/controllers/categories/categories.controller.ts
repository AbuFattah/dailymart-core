// categories.controller.ts
import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CreateCategoryDto } from 'src/catalog/dtos/CreateCategory.dto';
import { CreateDepartmentDto } from 'src/catalog/dtos/CreateDepartment.dto';
import { CreateSubcategoryDto } from 'src/catalog/dtos/CreateSubcategory.dto';
import { CreateSubcategoryParamsDto } from 'src/catalog/dtos/CreateSubcategoryParams.dto';
import { CategoriesService } from 'src/catalog/services/categories/categories.service';
import { isValidObjectId } from 'mongoose';
import { CategoryHierarchy } from 'src/catalog/mongoose/schemas/Categories.schema';

@Controller('categoryHierarchy')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // Create a department with categories and subcategories
  @Post('department')
  async createDepartment(
    @Body() createDepartmentDto: CreateDepartmentDto,
  ): Promise<CategoryHierarchy> {
    return this.categoriesService.createDepartment(createDepartmentDto);
  }

  @Get('department/:categoryId')
  async findDepartmentByCategoryId(
    @Param('categoryId') categoryId: string,
  ): Promise<CategoryHierarchy> {
    if (!isValidObjectId(categoryId)) {
      throw new HttpException(
        'Invalid category ID format',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.categoriesService.getDepartmentByCategoryId(categoryId);
  }

  @Post('category/:departmentId')
  async createCategory(
    @Param('departmentId') departmentId: string,
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryHierarchy> {
    return this.categoriesService.createCategory(
      departmentId,
      createCategoryDto,
    );
  }

  @Post('subcategory/:departmentId/:categoryId')
  async createSubcategory(
    @Param() params: CreateSubcategoryParamsDto,
    @Body() createSubcategoryDto: CreateSubcategoryDto,
  ): Promise<CategoryHierarchy> {
    const { categoryId, departmentId } = params;

    return this.categoriesService.createSubcategory(
      departmentId,
      categoryId,
      createSubcategoryDto,
    );
  }
}
