import config from 'config';
import { Router } from 'express';
import moment from 'moment';
import csv from 'csvtojson';
import path from 'path';
import { logger, logUser, deleteUser } from './index';

const auth = require('./../services/authentication');
const emailFile = path.join(config.get('logDirectory'), 'emails.csv');
const router = Router({});

router.get('/', auth.BasicAuthentication, async (req, res) => {
  const emails = await csv().fromFile(emailFile);
  res.render('structure', {
    emails,
    title: 'email collector - Theaminds',
  });
});

router.post('/delete/:email', auth.BasicAuthentication, async (req, res) => {
  const { email } = req.params;
  await deleteUser(email);
  res.end();
});

router.post('/email', async (req, res) => {
  const { name, email } = req.body;
  const responseMsg = await logUser(name, email);
  if (responseMsg === 'Successfully registered') {
    logger.info(`${name} signed up with ${email}`);
  }
  res.end(responseMsg);
});

router.get('/download', auth.BasicAuthentication, (req, res) => {
  const date = moment(new Date()).format('MMM-Do-YY');
  const name = `teamindsMail-${date}.csv`;
  res.download(emailFile, name);
});

export const routing = router;
