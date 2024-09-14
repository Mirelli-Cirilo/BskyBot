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
        text: `Boa noite! A data de hoje é: ${dataAtual}`
    });

    console.log("Just posted!");
}

// Executa o post imediatamente ao rodar o script
main().then(() => {
    // Define a expressão cron para rodar todos os dias às 23:00 (10 da noite)
    const scheduleExpression = '0 22 * * *'; // Executa todos os dias às 23:00

    const job = new CronJob(scheduleExpression, main, null, true, 'America/Sao_Paulo');

    job.start();

    console.log("Cron job iniciado. Postará diariamente às 22:00.");
}).catch(err => {
    console.error("Erro ao executar a função main:", err);
});