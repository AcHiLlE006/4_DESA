import { Injectable } from '@nestjs/common';
import { CosmosClient, Database, Container, User } from '@azure/cosmos';
import { AzureCosmosUserServiceUsers } from './app.service.cosmos.users';

@Injectable()
export class AzureCosmosUserServicePosts {
  private database: Database;
  private container: Container;
  private user : AzureCosmosUserServiceUsers;

  constructor() {

    const endpoint = process.env.AZURE_COSMOS_ENDPOINT;
    const key = process.env.AZURE_COSMOS_KEY;
    const databaseId = process.env.AZURE_COSMOS_DATABASE;
    const containerId = process.env.AZURE_COSMOS_CONTAINER;

    const client = new CosmosClient({ endpoint, key });
    this.database = client.database(databaseId);
    this.container = this.database.container(containerId);
  }


  // Ajouter une publication à un utilisateur
  async addPost(userId: string, content: string, type: string): Promise<any> {
    const { resource: user } = await this.container.item(userId, userId).read();

    if (!user) {
      throw new Error(`User ${userId} not found`);
    }

    const postId = `post-${Date.now()}`; // Générer un ID unique pour la publication
    const post = {
      id: postId,
      content,
      type, // "text" ou "media"
      createdAt: new Date().toISOString(),
    };

    user.posts.push(post);
    user.updatedAt = new Date().toISOString();

    // Mise à jour de l'utilisateur avec la nouvelle publication
    const { resource } = await this.container.item(userId, userId).replace(user);
    return resource;
  }


  // Récupérer toutes les publications d'un utilisateur
  async getUserPosts(userId: string): Promise<any[]> {
    const user = await this.user.getUser(userId);
    return user.posts;
  }

  // Mettre à jour une publication
  async updatePost(userId: string, postId: string, updatedContent: string): Promise<any> {
    const user = await this.user.getUser(userId);

    const postIndex = user.posts.findIndex(post => post.id === postId);
    if (postIndex === -1) {
      throw new Error(`Post ${postId} not found`);
    }

    user.posts[postIndex].content = updatedContent;
    user.posts[postIndex].updatedAt = new Date().toISOString();
    user.updatedAt = new Date().toISOString();

    const { resource } = await this.container.item(userId, userId).replace(user);
    return resource;
  }

  // Supprimer une publication
  async deletePost(userId: string, postId: string): Promise<any> {
    const user = await this.user.getUser(userId);

    const postIndex = user.posts.findIndex(post => post.id === postId);
    if (postIndex === -1) {
      throw new Error(`Post ${postId} not found`);
    }

    user.posts.splice(postIndex, 1); // Supprimer la publication
    user.updatedAt = new Date().toISOString();

    const { resource } = await this.container.item(userId, userId).replace(user);
    return resource;
  }
}
