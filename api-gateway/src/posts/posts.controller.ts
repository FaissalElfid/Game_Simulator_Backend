import {Body, Controller, Get, Post} from '@nestjs/common';
import {Client, ClientKafka, Transport} from "@nestjs/microservices";
import {Challenge} from "./interfaces/challenge.interface";

@Controller('challenges')
export class ChallengesController {
    @Client({
        transport: Transport.KAFKA,
        options: {
            client: {
                clientId: 'challenges',
                brokers: ['localhost:9092'],
            },
            consumer: {
                groupId: 'challenges-consumer'
            }
        }
    })
    client: ClientKafka;

    async onModuleInit() {
        this.client.subscribeToResponseOf('add.new.challenge');
        this.client.subscribeToResponseOf('get.challenges.list');

        await this.client.connect();
    }

    @Post('/')
    appPost(@Body() challenge: Challenge) {
        return this.client.send('add.new.challenge', challenge);
    }

    @Get('/')
    getList() {
        return this.client.send('get.challenges.list', '');
    }
}
