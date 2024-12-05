import { Controller, Post, Body, Param, Delete, Get, Put } from '@nestjs/common';
import { AzureCosmosUserServiceUsers } from 'src/services/app.service.cosmos.users';

@Controller('users')
export class UserController {
  constructor(private readonly azureCosmosUserServiceUsers: AzureCosmosUserServiceUsers) {}

  // Créer un utilisateur
  @Post('create')
  async createUser(
    @Body() body: { userId: string; username: string; email: string } // Le corps de la requête contient userId, username et email
  ) {
    const { userId, username, email } = body;
    return await this.azureCosmosUserServiceUsers.createUser(userId, username, email);
  }

  // Récupérer un utilisateur par ID
  @Get(':userId')
  async getUser(@Param('userId') userId: string) {
    return await this.azureCosmosUserServiceUsers.getUser(userId);
  }

  // Mettre à jour un utilisateur
  @Put(':userId')
  async updateUser(
    @Param('userId') userId: string,
    @Body() body: { username?: string; email?: string } // Le corps de la requête contient les champs à mettre à jour
  ) {
    const { username, email } = body;
    return await this.azureCosmosUserServiceUsers.updateUser(userId, { username, email });
  }

  // Supprimer un utilisateur
  @Delete(':userId')
  async deleteUser(@Param('userId') userId: string) {
    return await this.azureCosmosUserServiceUsers.deleteUser(userId);
  }
}
