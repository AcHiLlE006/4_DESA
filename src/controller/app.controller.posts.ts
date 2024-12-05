import { Controller, Post, Body, Param, Delete, Get, Put } from '@nestjs/common';
import { AzureCosmosUserServicePosts } from 'src/services/app.service.cosmos.posts';

@Controller('users/:userId/posts')
export class PostController {
  constructor(private readonly azureCosmosUserServicePosts: AzureCosmosUserServicePosts) {}

  // Ajouter une publication à un utilisateur
  @Post('create')
  async addPost(
    @Param('userId') userId: string,
    @Body() body: { content: string; type: string } // Le corps de la requête contient le contenu et le type de la publication
  ) {
    const { content, type } = body;
    return await this.azureCosmosUserServicePosts.addPost(userId, content, type);
  }

  // Récupérer toutes les publications d'un utilisateur
  @Get()
  async getUserPosts(@Param('userId') userId: string) {
    return await this.azureCosmosUserServicePosts.getUserPosts(userId);
  }

  // Mettre à jour une publication
  @Put(':postId')
  async updatePost(
    @Param('userId') userId: string,
    @Param('postId') postId: string,
    @Body() body: { updatedContent: string } // Le corps de la requête contient le nouveau contenu de la publication
  ) {
    const { updatedContent } = body;
    return await this.azureCosmosUserServicePosts.updatePost(userId, postId, updatedContent);
  }

  // Supprimer une publication
  @Delete(':postId')
  async deletePost(@Param('userId') userId: string, @Param('postId') postId: string) {
    return await this.azureCosmosUserServicePosts.deletePost(userId, postId);
  }
}
