import { BskyAgent } from '@atproto/api';
import * as dotenv from 'dotenv';
import { CronJob } from 'cron';
import * as process from 'process';
import { DateTime } from 'luxon';

dotenv.config();

// Create a Bluesky Agent 
const agent = new BskyAgent({
    service: 'https://bsky.social',
});

async function main() {
    await agent.login({ identifier: process.env.BLUESKY_USERNAME!, password: process.env.BLUESKY_PASSWORD! });

    const dataAtual = DateTime.now().setZone('America/Sao_Paulo').toFormat("dd/MM/yyyy");

    await agent.post({     
        text: `Boa noite! A data de hoje é: ${dataAtual}`
    });
    console.log("Just posted!");
}

main();

// Agendamento cron job para rodar uma vez por dia à 23h

const scheduleExpression = '0 23 * * *'; // Executa todos os dias à 23h

const job = new CronJob(scheduleExpression, main);

job.start();