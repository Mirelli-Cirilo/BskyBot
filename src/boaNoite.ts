import { BskyAgent } from '@atproto/api';
import * as dotenv from 'dotenv';
import { CronJob } from 'cron';
import * as process from 'process';
import { DateTime } from 'luxon';

dotenv.config();

// Cria o Bluesky Agent
const agent = new BskyAgent({
    service: 'https://bsky.social',
});

async function main() {
    await agent.login({ 
        identifier: process.env.BLUESKY_USERNAME!, 
        password: process.env.BLUESKY_PASSWORD! 
    });

    const dataAtual = DateTime.now().setZone('America/Sao_Paulo').toFormat("dd/MM/yyyy");


    await agent.post({
        text: `Bom dia! A data de hoje é: ${dataAtual}`
    });

    console.log("Just posted!");
}

// Define a expressão cron para rodar todos os dias às 08:00 (10 da noite)
const scheduleExpression = '0 8 * * *'; // Executa todos os dias às 08:00

const job = new CronJob(scheduleExpression, main);

job.start();