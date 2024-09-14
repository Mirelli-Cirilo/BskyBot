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

    const dataAtual = DateTime.now().toFormat("dd/MM/yyyy");

    await agent.post({     
        text: `Boa noite! A data de hoje é: ${dataAtual}`
    });
    console.log("Just posted!");
}

main();

// Run this on a cron job
const scheduleExpressionMinute = '* * * * *'; // Run once every minute for testing

// Agendamento cron job para rodar uma vez por dia à meia-noite

const scheduleExpression = '0 22 * * *'; // Executa todos os dias à meia-noite

const job = new CronJob(scheduleExpression, main);

job.start();