import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { MailService } from './mail.service.js';
import { MailWorker } from './mail.worker.js';

@Module({
    imports: [
        //Queue ka name Register kiya
        BullModule.registerQueue({
            name: 'mail-queue'
        }),
    ],
    providers: [MailService, MailWorker],
    //export kiya taki dusre services is queue me job push kar sakein
    exports: [BullModule, MailService]
})
export class MailModule {}
