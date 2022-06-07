import { createType } from 'typea';
import date from 'typea/date.js';
import mongoId from 'typea/mongoId.js';
import snumber from 'typea/snumber.js';
import email from "typea/email.js";
import mobilePhone from "typea/mobilePhone.js";

createType(date.name, date);
createType(mongoId.name, mongoId);
createType(snumber.name, snumber);
createType(email.name, email);
createType(mobilePhone.name, mobilePhone);
