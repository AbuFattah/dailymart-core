// categories.controller.ts
import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Patch,
  Delete,
} from '@nestjs/common';
import { CreateCategoryDto } from 'src/catalog/dtos/CreateCategory.dto';
import { CreateDepartmentDto } from 'src/catalog/dtos/CreateDepartment.dto';
import { CreateSubcategoryDto } from 'src/catalog/dtos/CreateSubcategory.dto';
import { CreateSubcategoryParamsDto } from 'src/catalog/dtos/CreateSubcategoryParams.dto';
import { CategoriesService } from 'src/catalog/services/categories/categories.service';
import { CategoryHierarchy } from 'src/catalog/mongoose/schemas/Categories.schema';
import { ValidateMongoIdPipe } from 'src/catalog/pipes/ValidateMongoId.pipe';
import { UpdateDepartmentNameDto } from 'src/catalog/dtos/UpdateDepartmentDto';

@Controller('categoryHierarchy')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // Create a department with categories and subcategories
  @Get('')
  async getCategoriesHierarchy() {
    return this.categoriesService.getCategoriesHierarchy();
  }

  @Post('department')
  async createDepartment(
    @Body() createDepartmentDto: CreateDepartmentDto,
  ): Promise<CategoryHierarchy> {
    return this.categoriesService.createDepartment(createDepartmentDto);
  }

  // get all depts including inactive
  @Get('allDepartments')
  async getDepartmentWithChildren() {
    return this.categoriesService.getDepartmentWithChildren();
  }

  @Get('department/:departmentId')
  async getDepartmentById(
    @Param('departmentId', ValidateMongoIdPipe) departmentId: string,
  ) {
    return this.categoriesService.getDepartmentById(departmentId);
  }
  @Get('department/category/:categoryId')
  async getDepartmentByCategoryId(
    @Param('categoryId', ValidateMongoIdPipe) categoryId: string,
  ) {
    return this.categoriesService.getDepartmentByCategoryId(categoryId);
  }

  @Patch('department')
  async updateDepartmentName(
    @Body() updateDepartementDto: UpdateDepartmentNameDto,
  ): Promise<{ id: string; name: string }> {
    const { id, name } = updateDepartementDto;
    return this.categoriesService.updateDepartmentName(id, name);
  }

  @Delete('department/:departmentId')
  async deleteDepartment(
    @Param('departmentId', ValidateMongoIdPipe) departmentId: string,
  ): Promise<{ departmentId: string; name: string; status: string }> {
    return this.categoriesService.deleteDepartment(departmentId);
  }

  //* CATEGORY

  @Post('category/:departmentId')
  async createCategoryInDepartment(
    @Param('departmentId', ValidateMongoIdPipe) departmentId: string,
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<CategoryHierarchy> {
    return this.categoriesService.createCategory(
      departmentId,
      createCategoryDto,
    );
  }

  @Get('category/:id')
  async getCategorybyId(@Param('id', ValidateMongoIdPipe) id: string) {
    return this.categoriesService.getCategorybyId(id);
  }
  @Get('category/department/:departmentId')
  async getCategoriesByDepartmentId(
    @Param('departmentId', ValidateMongoIdPipe) departmentId: string,
  ) {
    return this.categoriesService.getCategoriesByDepartmentId(departmentId);
  }

  //* SUBCATEGORY

  @Post('subcategory/:categoryId')
  async createSubcategory(
    @Param() params: CreateSubcategoryParamsDto,
    @Body() createSubcategoryDto: CreateSubcategoryDto,
  ) {
    const { categoryId } = params;

    return this.categoriesService.createSubcategoryByCategoryId(
      categoryId,
      createSubcategoryDto,
    );
  }

  @Get('subcategory/:id')
  async getSubcategorybyId(@Param('id', ValidateMongoIdPipe) id: string) {
    return this.categoriesService.getSubcategorybyId(id);
  }

  @Get('subcategory/category/:categoryId')
  async getSubcategoriesByCategoryId(
    @Param('categoryId', ValidateMongoIdPipe) categoryId: string,
  ) {
    return this.categoriesService.getSubcategoriesByCategoryId(categoryId);
  }
}
