import Mailjet from 'node-mailjet';
import dotenv from 'dotenv';
import config from '../config';

dotenv.config();

const mailjet = Mailjet.apiConnect(
     config.mailJet.apiKey,
     config.mailJet.apiSecret
);



export default mailjet;