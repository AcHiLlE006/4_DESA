import { Controller, Post, Body, Param, Delete, Get, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AzureCosmosUserServiceUsers } from 'src/services/app.service.cosmos.users';

@ApiTags('users') // Regroupe les endpoints sous la catégorie "users" dans Swagger
@Controller('users')
export class UserController {
  constructor(private readonly azureCosmosUserServiceUsers: AzureCosmosUserServiceUsers) {}

  // Créer un utilisateur
  @Post('create')
  @ApiOperation({ summary: 'Créer un nouvel utilisateur' })
  @ApiResponse({ status: 201, description: 'Utilisateur créé avec succès.' })
  @ApiBody({
    description: 'Données nécessaires pour créer un utilisateur',
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string', example: '12345' },
        username: { type: 'string', example: 'JohnDoe' },
        email: { type: 'string', example: 'johndoe@example.com' },
      },
    },
  })
  async createUser(
    @Body() body: { userId: string; username: string; email: string } // Le corps de la requête contient userId, username et email
  ) {
    const { userId, username, email } = body;
    return await this.azureCosmosUserServiceUsers.createUser(userId, username, email);
  }

  // Récupérer un utilisateur par ID
  @Get(':userId')
  @ApiOperation({ summary: 'Récupérer les informations d\'un utilisateur par ID' })
  @ApiParam({
    name: 'userId',
    description: 'Identifiant unique de l\'utilisateur',
    example: '12345',
  })
  @ApiResponse({ status: 200, description: 'Informations de l\'utilisateur retournées.' })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé.' })
  async getUser(@Param('userId') userId: string) {
    return await this.azureCosmosUserServiceUsers.getUser(userId);
  }

  // Mettre à jour un utilisateur
  @Put(':userId')
  @ApiOperation({ summary: 'Mettre à jour les informations d\'un utilisateur' })
  @ApiParam({
    name: 'userId',
    description: 'Identifiant unique de l\'utilisateur',
    example: '12345',
  })
  @ApiBody({
    description: 'Données à mettre à jour pour l\'utilisateur',
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string', example: 'JaneDoe', nullable: true },
        email: { type: 'string', example: 'janedoe@example.com', nullable: true },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Utilisateur mis à jour avec succès.' })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé.' })
  async updateUser(
    @Param('userId') userId: string,
    @Body() body: { username?: string; email?: string } // Le corps de la requête contient les champs à mettre à jour
  ) {
    const { username, email } = body;
    return await this.azureCosmosUserServiceUsers.updateUser(userId, { username, email });
  }

  // Supprimer un utilisateur
  @Delete(':userId')
  @ApiOperation({ summary: 'Supprimer un utilisateur par ID' })
  @ApiParam({
    name: 'userId',
    description: 'Identifiant unique de l\'utilisateur',
    example: '12345',
  })
  @ApiResponse({ status: 200, description: 'Utilisateur supprimé avec succès.' })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé.' })
  async deleteUser(@Param('userId') userId: string) {
    return await this.azureCosmosUserServiceUsers.deleteUser(userId);
  }
}
