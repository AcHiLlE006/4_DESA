import { 
  Controller, 
  Post, 
  Body, 
  Param, 
  Delete, 
  Get, 
  Put, 
  UseInterceptors,
  UploadedFile
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse, ApiConsumes } from '@nestjs/swagger';
import { extname } from 'path';
import { AzureCosmosUserServicePosts } from 'src/services/app.service.cosmos.posts';
import { AzureBlobService } from 'src/services/app.service.blob';


// API Controller for posts
@ApiTags('posts')
@Controller('posts')
export class PostController {
  constructor(private readonly azureCosmosUserServicePosts: AzureCosmosUserServicePosts, private readonly blobService: AzureBlobService) {}

  // Ajouter une publication à un utilisateur
  @Post(':userId')
  @ApiOperation({ summary: 'Upload a media file for a post' })
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'userId', description: 'ID of the user' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Media file (image, video, etc.)',
          nullable: true, // Rendre ce champ optionnel
        },
        type: {
          type: 'string',
          description: 'Type of the post (e.g., image, video, text)',
          example: 'image',
        },
        textContent: {
          type: 'string',
          description: 'Optional text content for the post',
          example: 'This is a text-only post.',
          nullable: true,
        },
      },
      required: ['type'], // Spécifiez que "type" est obligatoire
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      
      fileFilter: (req, file, callback) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif|mp4|avi)$/)) {
          callback(null, true);
      }},
    }),
  )
  async uploadPost(
    @Param('userId') userId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('content') content: string,
    @Body('type') type: string,
  ) {
    // Si le fichier est présent, c'est un média, donc on traite le fichier
    if (file) {
      const mediaUrl = await this.blobService.uploadFile(userId,file.filename,file);
      console.log("ce")
      return await this.azureCosmosUserServicePosts.addPost(userId, mediaUrl, type);
    } else if (content) {
      // Sinon, c'est un texte, on appelle addPost avec le texte
      return await this.azureCosmosUserServicePosts.addPost(userId, content, type);
    } else {
      throw new Error('No valid content provided.');
    }
  }


  // Récupérer toutes les publications d'un utilisateur
  @Get(':userId')
  @ApiOperation({ summary: 'Get all posts of a user' })
  @ApiParam({ name: 'userId', description: 'ID of the user whose posts are to be retrieved' })
  @ApiResponse({ status: 200, description: 'Posts retrieved successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserPosts(@Param('userId') userId: string) {
    return await this.azureCosmosUserServicePosts.getUserPosts(userId);
  }

  // Mettre à jour une publication
  @Put(':userId/:postId')
  @ApiOperation({ summary: 'Update a user’s post' })
  @ApiParam({ name: 'userId', description: 'ID of the user who owns the post' })
  @ApiParam({ name: 'postId', description: 'ID of the post to update' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Media file (image, video, etc.)',
          nullable: true, // Rendre ce champ optionnel
        },
        type: {
          type: 'string',
          description: 'Type of the post (e.g., image, video, text)',
          example: 'image',
        },
        textContent: {
          type: 'string',
          description: 'Optional text content for the post',
          example: 'This is a text-only post.',
          nullable: true,
        },
      },
      required: ['type'], // Spécifiez que "type" est obligatoire
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      
      fileFilter: (req, file, callback) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif|mp4|avi)$/)) {
          callback(null, true);
      }},
    }),
  )
  @ApiResponse({ status: 200, description: 'Post successfully updated' })
  @ApiResponse({ status: 404, description: 'User or post not found' })
  async updatePost(
    @Param('userId') userId: string,
    @Param('postId') postId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('content') content: string,
    @Body('type') type: string,
  ) {
    // Si le fichier est présent, c'est un média, donc on traite le fichier
    if (file) {
      const mediaUrl = await this.blobService.uploadFile(userId,file.filename,file);
      return await this.azureCosmosUserServicePosts.updatePost(userId, postId, mediaUrl);
    } else if (content) {
      // Sinon, c'est un texte, on appelle addPost avec le texte
      return await this.azureCosmosUserServicePosts.updatePost(userId, postId, content);
    } else {
      throw new Error('No valid content provided.');
    }
  

  }

  // Supprimer une publication
  @Delete(':userId/:postId')
  @ApiOperation({ summary: 'Delete a user’s post' })
  @ApiParam({ name: 'userId', description: 'ID of the user who owns the post' })
  @ApiParam({ name: 'postId', description: 'ID of the post to delete' })
  @ApiResponse({ status: 200, description: 'Post successfully deleted' })
  @ApiResponse({ status: 404, description: 'User or post not found' })
  async deletePost(@Param('userId') userId: string, @Param('postId') postId: string) {
    return await this.azureCosmosUserServicePosts.deletePost(userId, postId);
  }
}
