import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserController } from './controller/app.controller.users';
import { PostController } from './controller/app.controller.posts';
import { AzureCosmosUserServiceUsers } from './services/app.service.cosmos.users'; 
import { AzureCosmosUserServicePosts } from './services/app.service.cosmos.posts';  
import { AzureBlobService } from './services/app.service.blob';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [UserController, PostController],  
  providers: [
    AzureCosmosUserServiceUsers,
    AzureCosmosUserServicePosts,
    AzureBlobService
  ],
  exports: [AzureCosmosUserServiceUsers, AzureCosmosUserServicePosts],  
})
export class AppModule {}
