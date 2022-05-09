import types from 'typea';
import date from 'typea/date.js';
import mongoId from 'typea/mongoId.js';
import snumber from 'typea/snumber.js';
import email from "typea/email.js";
import mobilePhone from "typea/mobilePhone.js";

types.add(date.name, date);
types.add(mongoId.name, mongoId);
types.add(snumber.name, snumber);
types.add(email.name, email);
types.add(mobilePhone.name, mobilePhone);
