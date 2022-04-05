import types from 'typea';
import date from 'typea/types/date.js';
import mongoId from 'typea/types/mongoId.js';
import mobilePhone from 'typea/types/mobilePhone.js';
import email from 'typea/types/email.js';

types.type(date.name, date);
types.type(mongoId.name, mongoId);
types.type(mobilePhone.name, mobilePhone);
types.type(email.name, email);
