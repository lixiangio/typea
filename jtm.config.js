import types from 'typea';
import date from 'typea/date.js';
import mongoId from 'typea/mongoId.js';
import mobilePhone from 'typea/mobilePhone.js';
import email from 'typea/email.js';
import snumber from 'typea/snumber.js';

types.add(date.name, date);
types.add(mongoId.name, mongoId);
types.add(mobilePhone.name, mobilePhone);
types.add(email.name, email);
types.add(snumber.name, snumber);