import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { ItemsModule } from './procurement/items/items.module';
import { IndentsModule } from './procurement/indents/indents.module';
import { MisModule } from './procurement/mis/mis.module';
import { RfqsModule } from './procurement/rfqs/rfqs.module';
import { VendorsModule } from './procurement/vendors/vendors.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ItemsModule,
    IndentsModule,
    MisModule,
    VendorsModule,
    RfqsModule
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
