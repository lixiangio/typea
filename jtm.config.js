import types from 'typea';
import date from 'typea/types/date.js';
import mongoId from 'typea/types/mongoId.js';
import mobilePhone from 'typea/types/mobilePhone.js';
import email from 'typea/types/email.js';

types.add(date.name, date);
types.add(mongoId.name, mongoId);
types.add(mobilePhone.name, mobilePhone);
types.add(email.name, email);
