import { Processor, WorkerHost } from "@nestjs/bullmq";
import { MailService } from './mail.service.js'
import { Logger } from "@nestjs/common";
import { Job } from "bullmq";

@Processor('mail-queue') //Redis listen to this queue
export class MailWorker extends WorkerHost {
    private readonly logger = new Logger(MailWorker.name)

    constructor (private mailService: MailService){
        super();
    }

    // Jaise hi koi job aayegi, ye function background me automatically chalega
    async process(job: Job<any, any, string>): Promise<any> {
        this.logger.log(`Background worker picked up job [${job.name}] (ID: ${job.id})`)

        if(job.name === 'sendWelcomeEmail'){
            const { to, name, courseName } = job.data
            return await this.mailService.sendWelcomeEmail(to, name, courseName)
        }

        if(job.name === 'sendPaymentReceipt'){
            const { to, name, courseName, amount, paymentId } = job.data
            return await this.mailService.sendPaymentReceiptEmail(to, name, courseName, amount, paymentId)
        }
    }

}