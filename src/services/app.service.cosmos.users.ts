import { Injectable } from '@nestjs/common';
import { CosmosClient, Database, Container } from '@azure/cosmos';

@Injectable()
export class AzureCosmosUserServiceUsers {
  private database: Database;
  private container: Container;

  constructor() {
    
    const endpoint = process.env.AZURE_COSMOS_ENDPOINT;
    const key = process.env.AZURE_COSMOS_KEY;
    const databaseId = process.env.AZURE_COSMOS_DATABASE;
    const containerId = process.env.AZURE_COSMOS_CONTAINER;

    const client = new CosmosClient({ endpoint, key });
    this.database = client.database(databaseId);
    this.container = this.database.container(containerId);
  }

  // Créer un utilisateur avec une liste vide de publications
  async createUser(userId: string, username: string, email: string): Promise<any> {
    const user = {
      id: userId,
      username,
      email,
      posts: [], // Liste vide de publications
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Insérer ou mettre à jour l'utilisateur dans Cosmos DB
    const { resource } = await this.container.items.upsert(user);
    return resource;
  }

  // Récupérer un utilisateur avec ses publications
  async getUser(userId: string): Promise<any> {
    const { resource } = await this.container.item(userId, userId).read();

    if (!resource) {
      throw new Error(`User ${userId} not found`);
    }

    return resource;
  }

  // Mettre à jour un utilisateur
  async updateUser(userId: string, updatedUser: { username?: string; email?: string }): Promise<any> {
    const { resource: user } = await this.container.item(userId, userId).read();

    if (!user) {
      throw new Error(`User ${userId} not found`);
    }

    // Mettre à jour les propriétés de l'utilisateur si elles sont fournies
    if (updatedUser.username) {
      user.username = updatedUser.username;
    }
    if (updatedUser.email) {
      user.email = updatedUser.email;
    }
    user.updatedAt = new Date().toISOString();

    // Mise à jour de l'utilisateur dans la base de données
    const { resource } = await this.container.item(userId, userId).replace(user);
    return resource;
  }

  // Supprimer un utilisateur
  async deleteUser(userId: string): Promise<any> {
    const { resource: user } = await this.container.item(userId, userId).read();

    if (!user) {
      throw new Error(`User ${userId} not found`);
    }

    // Suppression de l'utilisateur
    await this.container.item(userId, userId).delete();
    return { message: `User ${userId} deleted successfully` };
  }
}
