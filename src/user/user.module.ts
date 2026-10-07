import { Module } from '@nestjs/common';
import { UserService } from './user.service.js';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema.js';
import { UserController } from './user.controller.js';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
    JwtModule,
  ],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController],
})
export class UserModule {}
